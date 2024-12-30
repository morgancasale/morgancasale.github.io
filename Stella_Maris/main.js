let connectedDevices = [];

let selectedDevice = null;

async function ToggleElectroMagnet(event){
    console.log("Electromagnet toggled");
    console.log("Received message:", event.target.value);
    await sendToDevice(selectedDevice, 32);
}

async function powerButton(){
    const powerButton = document.querySelector("#actionButton");
    let classes = powerButton.classList;

    if(selectedDevice == null){
        console.error("No device connected!");

        powerButton.innerHTML = "No device!" + power_icon;
        await new Promise(resolve => setTimeout(resolve, button_alert_time));
        if(classes.contains("power_on")){
            powerButton.innerHTML = "Turn On" + power_icon;
        } else {
            powerButton.innerHTML = "Turn Off" + power_icon;
        }
    } else {
        if(classes.contains("power_on")){
            await sendToDevice(selectedDevice, 32);
            classes.remove("power_on");
            classes.add("power_off");
            powerButton.innerHTML = "Turn Off" + power_icon;
        } else {
            await sendToDevice(selectedDevice, 0);
            classes.remove("power_off");
            classes.add("power_on");
            powerButton.innerHTML = "Turn On" + power_icon;
        }
    }
}

function changeDevEMState(event){
    const decoder = new TextDecoder('utf-8'); // Assuming the data is UTF-8 encoded
    const stringValue = decoder.decode(event.target.value);
    const jsonData = JSON.parse(stringValue);

    console.log("Received message:", jsonData);

    document.querySelector("#" + jsonData.device_name).updateEMState(JSON.parse(jsonData.EM_state));
}

async function addCmdListener(server) {
    const service = await server.getPrimaryService(service_uuid); 
    const deviceCmdChar = await service.getCharacteristic(deviceCmdChar_uuid);
    //fromDeviceMsgChar.writeValue(Uint8Array.of(0));

    // Start notifications
    deviceCmdChar.startNotifications();
    console.log(`Started notifications listener`);

    // Add an event listener for received messages
    deviceCmdChar.addEventListener('characteristicvaluechanged', (event) => ToggleElectroMagnet(event));
}

async function addStateListener(server) {
    const service = await server.getPrimaryService(service_uuid);
    const deviceStateChar = await service.getCharacteristic(deviceStateChar_uuid);

    // Start notifications
    deviceStateChar.startNotifications();
    console.log(`Started state notifications listener`);

    // Add an event listener for received messages
    deviceStateChar.addEventListener('characteristicvaluechanged', (event) => changeDevEMState(event));

    // console.log("State listener added");
}

function onDeviceDisconnected(event) {
    const device = event.target;

    console.log(`Device disconnected: ${device.name}`);

    // Remove the device from the list of connected devices
    connectedDevices = connectedDevices.filter(connectedDevice => connectedDevice !== device);

    // Remove the device's button
    const deviceButton = document.getElementById(device.name);
    deviceButton.remove();

    // If the disconnected device was the selected device, clear the selected device
    if (selectedDevice === device.name) {
        selectedDevice = null;
    }
}

async function onDeviceConnected(server, device) {
    const deviceListDiv = document.getElementById('deviceList');
    if (! connectedDevices.length) {
        // Create a button for each connected device
        deviceListDiv.innerHTML = "";
    }

    await addCmdListener(server);
    await addStateListener(server);

    const deviceButton = document.createElement('exp-btn');

    deviceButton.setAttribute("deviceName", device.name);
    deviceButton.id = device.name;
    
    deviceListDiv.appendChild(deviceButton);

}

async function selectDevice(deviceName) {
    try {
        // Find the device with the given name
        const device = connectedDevices.find(device => device.name === deviceName);

        if (!device) {
            if(device == null){
                console.error("No device connected!");
            } else {
                console.error("Device not found:", deviceName);
            }
            return;
        }

        // Enable all devices' buttons
        const deviceListDiv = document.getElementById('deviceList');
        deviceListDiv.childNodes.forEach(button => {
            button.shadowRoot.querySelector("#"+button.id).disabled = false;
        });

        // Turn off all devices' electromagnets
        for (let device of connectedDevices) {
            await sendToDevice(device.name, 0);
        }

        // Disable the selected device's button
        const selectedButton = document.getElementById(deviceName);
        selectedButton.shadowRoot.querySelector("#"+selectedButton.id).disabled = true;

        selectedDevice = deviceName;
        console.log(`Selected device: ${deviceName}`);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

async function deselectDevice() {
    selectedDevice = null;
    
    // Enable all devices' buttons
    const deviceListDiv = document.getElementById('deviceList');

    for(let button of deviceListDiv.childNodes){
        button.shadowRoot.querySelector("#"+button.id).disabled = false;

        let deviceName = button.id;
        // Turn off selected device's electromagnet
        await sendToDevice(deviceName, 0);
        console.log(`Em off for dev: ${deviceName}`);
    };

    console.log("Device deselected");
}

async function promptDeviceConnection() {
    try {
        // while (true) {
            console.log("Opening pairing menu...");

            let connectButton = document.querySelector("#connectButton");
            connectButton.disabled = true;
            connectButton.innerHTML = connect_icon + "Connecting...";
            
            // Request a device through the pairing interface
            await connectDevice([{services: [service_uuid]}]);

            connectButton.disabled = false;
            connectButton.innerHTML = connect_icon + "Connect";
            
            // localStorage.setItem('connectedDevices', connectedDevices);
        // }
    } catch (error) {
        if (error.name === "NotFoundError") {
            // Pairing menu was canceled by the user
            console.log("Pairing menu canceled. Stopping device connection.");
            return;
        } else if (error.name === "SecurityError") {
            return;
        } else {
            console.error("An error occurred:", error);
        }
    }

    console.log("List of connected devices:", connectedDevices);
}

async function sendToDevice(deviceName, message){
    try {
        // Find the device with the given name
        const device = connectedDevices.find(device => device.name === deviceName);

        if (!device) {
            console.error("Device not found:", deviceName);
            return;
        }

        // Connect to the device
        const server = await device.gatt.connect();
        // console.log(`Connected to device: ${device.name}`);

        // Get the service
        const service = await server.getPrimaryService(service_uuid);

        // Get the characteristic
        const characteristic = await service.getCharacteristic(toDeviceMsgChar_uuid);

        // Send the message
        await characteristic.writeValue(Uint8Array.of(message));
        console.log(`Sent message to device: ${device.name}`);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

async function connectDevice(filters){
    let device;
    try{
        device = await navigator.bluetooth.requestDevice({
            filters: filters
        });

        if (!connectedDevices.includes(device)) {
            let server;
            // Connect to the selected device
            let done = true;
            do{
                try {
                    server = await device.gatt.connect();
                    done = true;
                } catch (error) {
                    done = false;
                }
            } while(!done);
                
            console.log(`Connected to device: ${device.name}`);

            // Set up event listener for when device gets connected and disconnected.
            onDeviceConnected(server, device);
            device.addEventListener('gattserverdisconnected', onDeviceDisconnected);

            // Store the connected device
            connectedDevices.push(device);
        } else {
            console.log(`Device already connected: ${device.name}`);

            const connectButton = document.querySelector("#connectButton");
            connectButton.innerHTML = connect_icon + "Already connected!";
            await new Promise(resolve => setTimeout(resolve, button_alert_time));
            connectButton.innerHTML = connect_icon + "Connect";
        }

    } catch (error) {
        const connectButton = document.querySelector("#connectButton");
        connectButton.innerHTML = connect_icon + "Error!";
        await new Promise(resolve => setTimeout(resolve, button_alert_time));
        connectButton.innerHTML = connect_icon + "Connect";
        connectButton.disabled = false;
        if (error.name === "SecurityError") {
            console.log("Security error: User gesture required.");
            throw error;
        } else {
            console.log("An error occurred:");
            console.log(error);
        }
    }
}