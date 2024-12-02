let service_uuid = '19b10000-e8f2-537e-4f6c-d104768a1214';
let toDeviceMsgChar_uuid = '19b10001-e8f2-537e-4f6c-d104768a1214';
let fromDeviceMsgChar_uuid = '19b10003-e8f2-537e-4f6c-d104768a1214';

let connectedDevices = [];

let selectedDevice = null;

function ToggleElectroMagnet(){
    sendToDevice(selectedDevice, 32);
}

async function addReceiveListener() {
    // Access the desired service and characteristic
    const service = await server.getPrimaryService('service_uuid'); // Replace with your service UUID
    const characteristic = await service.getCharacteristic(fromDeviceMsgChar_uuid); // Replace with your characteristic UUID

    // Start notifications
    await characteristic.startNotifications();
    console.log(`Started notifications listener`);

    // Add an event listener for received messages
    characteristic.addEventListener('characteristicvaluechanged', (event) => ToggleElectroMagnet());
}

async function selectDevice(deviceName) {
    try {
        // Find the device with the given name
        const device = connectedDevices.find(device => device.name === deviceName);



        if (!device) {
            console.error("Device not found:", deviceName);
            return;
        }

        // Enable all devices' buttons
        const deviceListDiv = document.getElementById('deviceList');
        deviceListDiv.childNodes.forEach(button => {
            button.disabled = false;
        });

        // Disable the selected device's button
        const selectedButton = document.getElementById(deviceName);
        selectedButton.disabled = true;

        selectedDevice = deviceName;
        console.log(`Selected device: ${deviceName}`);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

async function connectToDevicesUntilCancel() {
    try {
        while (true) {
            console.log("Opening pairing menu...");
            
            // Request a device through the pairing interface
            const device = await navigator.bluetooth.requestDevice({
                filters: [{
                    services: [service_uuid]
                }]
            });

            // Connect to the selected device
            const server = await device.gatt.connect();
            console.log(`Connected to device: ${device.name}`);

            // Store the connected device
            connectedDevices.push(device);
        }
    } catch (error) {
        if (error.name === "NotFoundError") {
            // Pairing menu was canceled by the user
            console.log("Pairing menu canceled. Stopping device connection.");
        } else {
            console.error("An error occurred:", error);
        }
    }

    console.log("Final list of connected devices:", connectedDevices);

    //localStorage.setItem('connectedDevices', JSON.stringify(connectedDevices));

    // Create a button for each connected device
    const deviceListDiv = document.getElementById('deviceList');
    deviceListDiv.innerHTML = "";

    connectedDevices.forEach(device => {
        const sendButton = document.createElement('button');
        sendButton.textContent = device.name;
        //sendButton.onclick = () => sendToDevices(device.name, 128);
        sendButton.id = device.name;
        sendButton.onclick = () => selectDevice(device.name);
        
        deviceListDiv.appendChild(sendButton);
    });
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
