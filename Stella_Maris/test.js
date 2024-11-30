let service_uuid = '19b10000-e8f2-537e-4f6c-d104768a1214';
let characteristic_uuid = '19b10001-e8f2-537e-4f6c-d104768a1214';

let connectedDevices = [];

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
    const deviceListDiv = document.getElementById('deviceList');
    deviceListDiv.innerHTML = '';

    connectedDevices.forEach(device => {
        const deviceItem = document.createElement('div');
        deviceItem.textContent = `Device Name: ${device.name}`;
        deviceListDiv.appendChild(deviceItem);
    });
}

// Start the process
connectToDevicesUntilCancel();
