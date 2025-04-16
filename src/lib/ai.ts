import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.NEBIUS_API_KEY,
});

async function main() {
  const response = await client.chat.completions.create({
    model: "Qwen/Qwen2.5-Coder-32B-Instruct",
    temperature: 0,
    messages: [{ role: "user", content: "Hello, world!" }],
  });
  console.log(response);
}

main().catch(console.error);
