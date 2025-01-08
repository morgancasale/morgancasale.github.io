const queue = [];
let isProcessing = false;

// Function to process the next item in the queue
async function processMsgQueue() {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;
  const { deviceName, message } = queue.shift(); // Get the next message to send

  try {
    const result = await sendToDevice(deviceName, message); // Send the message
    // self.postMessage({ id, status: 'fulfilled', result });

    await new Promise(r => setTimeout(r, ble_msg_cooldown)); // Cooldown period
  } catch (error) {
    // self.postMessage({ id, status: 'rejected', error: error.message });
    console.error('An error occurred while processing queue:', error);
  } finally {
    isProcessing = false;
    processMsgQueue(); // Process the next message
  }
}

// Listen for incoming tasks from the main thread
self.onmessage = function (event) {
  const { deviceName, message } = event.data;

  queue.push({deviceName, message});
  processMsgQueue();
};
