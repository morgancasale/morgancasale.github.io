// const service_uuid = '19b10000-e8f2-537e-4f6c-d104768a1214';
// const toDeviceMsgChar_uuid = '19b10001-e8f2-537e-4f6c-d104768a1214';
// const deviceCmdChar_uuid = '19b10003-e8f2-537e-4f6c-d104768a1214';
// const deviceStateChar_uuid = '19b10004-e8f2-537e-4f6c-d104768a1214';

// const ble_msg_cooldown = 100;

importScripts('config.js');
importScripts('utils.js');

let msgQueue = [];
let isProcessing = false;

let connectedDevices = [];

self.onmessage = function (event) {
    switch(event.data.cmd){
        case "connectDevice":
            connectDevice(event.data.filters);
            break;
        case "disconnectAllDevices":
            disconnectAllDevices();
            break;
        case "sendToDevice":
            msgQueue.push(event.data);
            processMsgQueue();
            break;
        default:
            console.error("Unknown message received from main thread: ", event.data);
    }
};

// Function to process the next item in the msgQueue
async function processMsgQueue() {
  if (isProcessing || msgQueue.length === 0) return;

  isProcessing = true;
  const { deviceName, message } = msgQueue.shift(); // Get the next message to send

  try {
    const result = await sendToDevice(deviceName, message); // Send the message
    self.postMessage({status: 'msgQueueProcessed', result : {status: 'fulfilled', result}});

    await new Promise(r => setTimeout(r, ble_msg_cooldown)); // Cooldown period
  } catch (error) {
    self.postMessage({status: 'msgQueueProcessed', result : {status: 'rejected', error: error.message}});
    console.error('An error occurred while processing msgQueue:', error);
  } finally {
    isProcessing = false;
    processMsgQueue(); // Process the next message
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
            let not_done = true;
            do{
                try {
                    server = await device.gatt.connect();
                    // Wait to ensure the connection is established
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    debug_data = server.connected;
                    if(server != null && server.connected){
                        not_done = false;
                    }
                } catch (error) {
                    not_done = true;
                }
            } while(not_done);
                
            console.log(`Connected to device: ${device.name}`);

            // Set up event listener for when device gets connected and disconnected.
            console.log("Server state: " + (server.connected ? "Connected" : "Disconnected"));
            
            // Store the connected device
            connectedDevices.push(device);

            onDeviceConnected(server, device);
            device.addEventListener('gattserverdisconnected', onDeviceDisconnected);
            
            
        } else {
            console.log(`Device already connected: ${device.name}`);

            self.postMessage({status: 'deviceConnectedError', result: {msg : `Already connected!`, deviceName: device.name}});
        }

    } catch (error) {
        let msg;
        if(error.name === "NotFoundError"){
            msg = "Prompt canceled";
        } else {
            msg = "Error!";
        }

        self.postMessage({status: 'deviceConnectedError', result: {msg : msg, deviceName: device.name}});

        if (error.name === "SecurityError") {
            console.log("Security error: User gesture required.");
            throw error;
        } else {
            console.log("An error occurred:");
            console.log(error);
        }
    }
}

async function onDeviceConnected(server, device) {
    if(server.connected){
        const deviceListDiv = document.getElementById('deviceList');
        if (! connectedDevices.length) {
            // Create a button for each connected device
            deviceListDiv.innerHTML = "";
        }

        await addCmdListener(server);
        await addStateListener(server);

    } else {
        console.error("Device not connected!");
    }

    self.postMessage({status: "deviceConnected", result: {deviceName: device.name, connectedDevices: connectedDevices}});
}

async function onDeviceDisconnected(event) {
    const device = event.target;

    // The event listener is kept even after the device is disconnected so
    // it interferes with the reconnection process. Remove it.
    device.removeEventListener('gattserverdisconnected', onDeviceDisconnected);

    console.log(`Device disconnected: ${device.name}`);

    // Remove the device from the list of connected devices
    connectedDevices = connectedDevices.filter(connectedDevice => connectedDevice !== device);

    self.postMessage({status: "deviceDisconnected", result: {
        deviceName: device.name,
        connectedDevices: connectedDevices
    }}); 
}

async function disconnectAllDevices() {
    // Disconnect from all connected devices
    const startTime = performance.now();
    for(let device of connectedDevices){
        await device.gatt.disconnect();
        console.log('Disconnected from:', device.name);       
    }

    // Clear the list after disconnecting
    connectedDevices.length = 0;

    self.postMessage({status: "disconnectedAllDevices", result: {
        timespent: performance.now()-startTime, 
        connectedDevices: connectedDevices
    }});
}

async function addCmdListener(server) {
    try{
        if(server.connected){
            const service = await withTimeout(server.getPrimaryService(service_uuid), 2000); 
            // TODO: Sometimes getPrimaryService hangs up indefinitely and gets the device stuck, aka, the device cannot be connected to again until page refresh.
            
            const deviceCmdChar = await service.getCharacteristic(deviceCmdChar_uuid);
            //fromDeviceMsgChar.writeValue(Uint8Array.of(0));

            // Start notifications
            deviceCmdChar.startNotifications();
            console.log(`Started notifications listener`);

            // Add an event listener for received messages
            deviceCmdChar.addEventListener('characteristicvaluechanged', (event) => ToggleElectroMagnet(event));
        } else {
            console.error("Device not connected!");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

async function addStateListener(server) {
    try{
        if(server.connected){
            const service = await server.getPrimaryService(service_uuid);
            const deviceStateChar = await service.getCharacteristic(deviceStateChar_uuid);

            // Start notifications
            deviceStateChar.startNotifications();
            console.log(`Started state notifications listener`);

            // Add an event listener for received messages
            deviceStateChar.addEventListener('characteristicvaluechanged', (event) => changeDevEMState(event));
        } else {
            console.error("Device not connected!");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
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