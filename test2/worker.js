// Listen for messages from the main thread
self.onmessage = function (event) {
    console.log('Message received in Worker:', event.data);

    // Perform some computation
    const result = event.data.split('').reverse().join('');

    // Send a response back to the main thread
    self.postMessage(`Reversed string: ${result}`);
};
