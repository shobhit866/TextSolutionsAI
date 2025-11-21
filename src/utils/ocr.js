// src/utils/ocr.js

export async function extractTextFromImage(file) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("/ocr-worker.js");

    worker.postMessage(file);

    worker.onmessage = (e) => {
      resolve(e.data.text);
      worker.terminate();
    };

    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };
  });
}
