export async function convertTextToMindmap(text) {
  const prompt = `
You are an expert text-to-mindmap structuring AI.

Your job is to convert ANY text—academic, business, historical, general knowledge, scientific, or technical—into a **clean structured mind map**.

Output MUST follow this JSON schema:

{
  "topic": "Main topic extracted from the text",
  "branches": [
    {
      "name": "Section name",
      "children": ["point 1", "point 2", "..."]
    }
  ]
}

Strict rules:
- Extract the ACTUAL topic from the text. Do NOT invent topics.
- Branch names MUST come from real sections or logical themes in the text.
- Children must be concise bullet points (max 1 sentence each).
- NO hallucinations, NO invented content.
- NO extra fields, no markdown, no backticks.
- Response must be ONLY raw JSON. No explanation.

TEXT TO CONVERT:
${text}
`;

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await resp.json();

  let raw =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "{}";

  raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(raw);
  } catch (e) {
    const fixed = raw
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      .replace(/\n/g, " ");
    return JSON.parse(fixed);
  }
}
