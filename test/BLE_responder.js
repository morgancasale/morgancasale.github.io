const worker = new Worker('BLE_worker.js');

worker.onmessage = function(event){
    switch(event.data.status){
        case "deviceConnected":
            onDeviceConnected(event.data.result);
            break;
        case "deviceConnectedError":
            onDeviceConnectedError(event.data.result);
            break;
        case "deviceDisconnected":
            onDeviceDisconnected(event.data.result);
            break;
        case "disconnectedAllDevices":
            onDisconnectedAllDevices(event.data.result);
            break;
        default:
            console.error("Unknown message received from worker: ", event.data);
    }
}

async function onDeviceConnected(result){
    connectedDevices = result.connectedDevices;

    const deviceButton = document.createElement('exp-btn');

    deviceButton.setAttribute("deviceName", result.deviceName);
    deviceButton.id = deviceName;
    
    deviceListDiv.appendChild(deviceButton);
}

async function onDeviceConnectedError(result){
    const allowedMsgs = ["Prompt canceled", "Error!", "Already connected!"];

    if(allowedMsgs.includes(result.msg)){
        const connectButton = document.querySelector("#connectButton");
        connectButton.innerHTML = connect_icon + result.msg;
        await new Promise(resolve => setTimeout(resolve, button_alert_time));
        connectButton.innerHTML = connect_icon + "Connect";
    }else{
        console.error("Unknown message received from worker: ", result);
    }
}

async function onDeviceDisconnected(result){
    connectedDevices = result.connectedDevices;

    const deviceName = result.deviceName;

    // Remove the device's button
    let connectButton = document.querySelector("#connectButton");
    const deviceButton = document.getElementById(deviceName);

    connectButton.disabled = true;
    connectButton.innerHTML = connect_icon + "Disconnected!";
    if(deviceButton != null){
        const int_btn_el = deviceButton.shadowRoot.querySelector("#"+deviceName);
        const opt_btn_el = deviceButton.shadowRoot.querySelector("#optsButton_" + deviceName);
        int_btn_el.disabled = true;
        opt_btn_el.disabled = true;
        int_btn_el.innerHTML = deviceButton.dev_icon + "Disconnected!";
    }

    await new Promise(resolve => setTimeout(resolve, button_alert_time));

    connectButton.disabled = false;
    connectButton.innerHTML = connect_icon + "Connect";
    if(deviceButton != null){
        deviceButton.remove();
    }

    // If the disconnected device was the selected device, clear the selected device
    if (selectedDevice === device.name) {
        selectedDevice = null;
    }
}

async function onDisconnectedAllDevices(result){
    connectedDevices = result.connectedDevices;

    const disconnectButton = document.querySelector("#disconnectButton");
    disconnectButton.disabled = true;
    disconnectButton.innerHTML = disconnect_icon + "Disconnecting...";

    await new Promise(resolve => setTimeout(resolve, button_alert_time-result.timespent));

    disconnectButton.disabled = false;
    disconnectButton.innerHTML = disconnect_icon + "Disconnect All";

    selectedDevice = null;
}