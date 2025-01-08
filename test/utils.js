async function withTimeout(promise, timeout) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), timeout)
        ),
    ]);
}

async function waitWorker(worker, msg){
    return new Promise(resolve => {
        worker.onmessage = function(event){
            resolve(event);
        };

        worker.postMessage(msg);
    });
}