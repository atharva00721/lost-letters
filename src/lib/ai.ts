import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: "",
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
