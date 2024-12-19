let service_uuid = '19b10000-e8f2-537e-4f6c-d104768a1214';
let toDeviceMsgChar_uuid = '19b10001-e8f2-537e-4f6c-d104768a1214';
let fromDeviceMsgChar_uuid = '19b10003-e8f2-537e-4f6c-d104768a1214';

let connectedDevices = [];

let selectedDevice = null;

function ToggleElectroMagnet(event){
    console.log("Electromagnet toggled");
    console.log("Received message:", event.target.value);
    sendToDevice(selectedDevice, 32);
}

async function addReceiveListener(server) {
    const service = await server.getPrimaryService(service_uuid); 
    const fromDeviceMsgChar = await service.getCharacteristic(fromDeviceMsgChar_uuid);
    //fromDeviceMsgChar.writeValue(Uint8Array.of(0));

    // Start notifications
    fromDeviceMsgChar.startNotifications();
    console.log(`Started notifications listener`);

    // Add an event listener for received messages
    fromDeviceMsgChar.addEventListener('characteristicvaluechanged', (event) => ToggleElectroMagnet(event));
}

function onDeviceDisconnected(event) {
    const device = event.target;

    console.log(`Device disconnected: ${device.name}`);

    // Remove the device from the list of connected devices
    connectedDevices = connectedDevices.filter(connectedDevice => connectedDevice !== device);

    // Remove the device's button
    const deviceButton = document.getElementById(device.name);
    deviceButton.remove();

    // Turn off disconnected device's electromagnet
    // sendToDevice(device.name, 0);

    // If the disconnected device was the selected device, clear the selected device
    if (selectedDevice === device.name) {
        selectedDevice = null;
    }
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
        connectedDevices.forEach(device => {
            sendToDevice(device.name, 0);
        });

        // Disable the selected device's button
        const selectedButton = document.getElementById(deviceName);
        selectedButton.shadowRoot.querySelector("#"+selectedButton.id).disabled = true;

        selectedDevice = deviceName;
        console.log(`Selected device: ${deviceName}`);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

function deselectDevice() {
    selectedDevice = null;
    
    // Enable all devices' buttons
    const deviceListDiv = document.getElementById('deviceList');
    deviceListDiv.childNodes.forEach(button => {
        button.shadowRoot.querySelector("#"+button.id).disabled = false;

        let deviceName = button.id;
        // Turn off selected device's electromagnet
        sendToDevice(deviceName, 0);
    });

    // Turn off the selected device's electromagnet

    console.log("Device deselected");
}

async function connectToDevicesUntilCancel() {
    let server;
    try {
        // while (true) {
            console.log("Opening pairing menu...");
            
            // Request a device through the pairing interface
            server = await connectDevice([{services: [service_uuid]}]);
            document.getElementById('body').click();
            // delay(400);

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

    console.log("Final list of connected devices:", connectedDevices);
    
    await addReceiveListener(server);

    // Create a button for each connected device
    const deviceListDiv = document.getElementById('deviceList');
    deviceListDiv.innerHTML = "";

    connectedDevices.forEach(device => {
        const deviceButton = document.createElement('exp-btn');

        deviceButton.setAttribute("deviceName", device.name);
        deviceButton.id = device.name;
        
        deviceListDiv.appendChild(deviceButton);
    });
}

function sendToSelectedDevice(message) {
    if (!selectedDevice) {
        console.error("No device selected.");
        return;
    }

    sendToDevice(selectedDevice, message);
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
        console.log(`Connected to device: ${device.name}`);

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
    } catch (error) {
        if (error.name === "SecurityError") {
            console.log("Security error: User gesture required.");
            throw error;
        } else {
            console.error("An error occurred:", error);
        }
    }

    // Connect to the selected device

    const server = await device.gatt.connect();
    console.log(`Connected to device: ${device.name}`);

    // Set up event listener for when device gets disconnected.
    device.addEventListener('gattserverdisconnected', onDeviceDisconnected);

    // Store the connected device
    if (!connectedDevices.includes(device)) {
        connectedDevices.push(device);
    }

    // localStorage.setItem('connectedDevices', connectedDevices);

    return server;
}

// async function connectPairedDevs(){
//     const pairedDevices = // localStorage.getItem('connectedDevices');
//     console.log("Paired devices:", pairedDevices);
    
//     pairedDevices.forEach(deviceName => async () => {
//             await connectDevice([{name: deviceName}])
//         }
//     );
    
// }
