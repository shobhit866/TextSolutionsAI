export async function summarizeText(text) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
You are an expert summarization AI. Read the text carefully and produce a highly accurate, structured summary.

### **OUTPUT REQUIREMENTS**
- Do NOT change or fabricate any information.
- Produce a **clean, organized, human-quality summary**.
- Use the following format:

1. **Short Overview (3–5 lines)**
2. **Key Points / Events / Findings (pointwise, precise)**
3. **Important Facts, Data, or Values (if present)**
4. **Conclusion / Final Insight**

### RULES
- Keep the summary neutral, factual, and concise.
- Preserve all important numbers, names, and medical/technical details.
- Remove noise, filler text, and irrelevant parts.
- If the text is messy (OCR noise), smartly correct formatting but never guess facts.

### TEXT TO SUMMARIZE:
${text}
`
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated.";
}
