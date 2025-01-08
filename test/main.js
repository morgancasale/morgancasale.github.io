let connectedDevices = [];

let debug_data = null;

let selectedDevice = null;

const msg_worker = new Worker('msg_worker.js');

async function ToggleElectroMagnet(event){
    console.log("Electromagnet toggled");
    console.log("Received message:", event.target.value);
    //await sendToDevice(selectedDevice, 2);
    msg_worker.postMessage({deviceName: selectedDevice, message: 2});

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
        let msg;
        if(classes.contains("power_on")){
            msg = 1;
            classes.remove("power_on");
            classes.add("power_off");
            powerButton.innerHTML = "Turn Off" + power_icon;
        } else {
            msg = 0;
            classes.remove("power_off");
            classes.add("power_on");
            powerButton.innerHTML = "Turn On" + power_icon;
        }
        // await sendToDevice(selectedDevice, msg)

        // Using the worker to queue messages with a cooldown time 
        // as to not overload the device in case of rapid button presses
        msg_worker.postMessage({deviceName: selectedDevice, message: msg});
    }
}

function changeDevEMState(event){
    const decoder = new TextDecoder('utf-8'); // Assuming the data is UTF-8 encoded
    const stringValue = decoder.decode(event.target.value);
    const jsonData = JSON.parse(stringValue);

    console.log("Received message:", jsonData);

    document.querySelector("#" + jsonData.device_name).updateEMState(JSON.parse(jsonData.EM_state));
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

