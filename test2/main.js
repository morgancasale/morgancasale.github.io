// Create a new Web Worker
const worker = new Worker('worker.js');

// Send data to the worker
worker.postMessage('Hello, Worker!');

// Listen for messages from the worker
worker.onmessage = function (event) {
    console.log('Message from Worker:', event.data);
};

// Handle errors from the worker
worker.onerror = function (error) {
    console.error('Worker Error:', error.message);
};
