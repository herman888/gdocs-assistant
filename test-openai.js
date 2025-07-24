const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const OPENAI_API_KEY = "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"; // Put your key here

async function testAPI() {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: "Say hello!" }
        ],
        max_tokens: 10
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ API Error:", data.error);
    } else {
      console.log("✅ API Success:", data.choices[0].message.content.trim());
    }
  } catch (err) {
    console.error("❌ Network/Error:", err);
  }
}

testAPI();
