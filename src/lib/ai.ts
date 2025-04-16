import OpenAI from "openai";

if (!process.env.NEBIUS_API_KEY) {
  throw new Error("NEBIUS_API_KEY environment variable is not set.");
}

const client = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.NEBIUS_API_KEY,
});

client.chat.completions
  .create({
    model: "Qwen/Qwen2.5-Coder-32B-Instruct",
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          'check if the message is okay and can be posted doesn\'t contain any spam but it can contain some bad language if the message can be posted return "true"',
      },
    ],
  })
  .then((response) => console.log(response))
  .catch((err) => {
    console.error("OpenAI API error:", err);
  });
