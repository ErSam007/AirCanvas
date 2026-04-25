import { createServerFn } from "@tanstack/react-start";

export const guessDrawing = createServerFn({ method: "POST" })
  .inputValidator((input: { imageDataUrl: string }) => {
    if (!input?.imageDataUrl?.startsWith("data:image/"))
      throw new Error("Invalid image");
    return input;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { guess: null, error: "AI not configured" };
    }
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You are an art critic. Look at the sketch and reply in ONE short playful sentence (max 14 words) guessing what it is.",
            },
            {
              role: "user",
              content: [
                { type: "text", text: "What did I draw?" },
                { type: "image_url", image_url: { url: data.imageDataUrl } },
              ],
            },
          ],
        }),
      });
      if (!res.ok) {
        if (res.status === 429) return { guess: null, error: "Rate limited, try again." };
        if (res.status === 402) return { guess: null, error: "AI credits exhausted." };
        return { guess: null, error: "AI gateway error" };
      }
      const json = await res.json();
      const guess = json?.choices?.[0]?.message?.content?.trim() ?? null;
      return { guess, error: null };
    } catch (e) {
      console.error("guessDrawing failed", e);
      return { guess: null, error: "AI request failed" };
    }
  });
