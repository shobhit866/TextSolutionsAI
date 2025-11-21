importScripts("https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js");

self.onmessage = async (e) => {
  const file = e.data;

  const { data } = await Tesseract.recognize(file, "eng", {
    logger: (m) => console.log(m),
  });

  self.postMessage({ text: data.text });
};
