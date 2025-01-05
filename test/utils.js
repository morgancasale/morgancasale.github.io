async function withTimeout(promise, timeout) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), timeout)
        ),
    ]);
}
  