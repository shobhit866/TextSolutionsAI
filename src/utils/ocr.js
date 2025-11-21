export async function extractTextFromImage(file) {
  // Load Tesseract dynamically ONLY at runtime
  const { createWorker } = await import("tesseract.js");

  const worker = await createWorker("eng");

  const {
    data: { text }
  } = await worker.recognize(file);

  await worker.terminate();

  return text;
}
