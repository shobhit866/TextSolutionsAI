export async function extractTextFromImage(file) {
  const { createWorker } = await import("tesseract.js");

  const worker = await createWorker("eng");

  const {
    data: { text }
  } = await worker.recognize(file);

  await worker.terminate();

  return text;
}
