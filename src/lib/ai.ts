import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";



const client = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey:
    "eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnb29nbGUtb2F1dGgyfDExMjc5ODQ3Njg5MzkyNTI0ODM3OCIsInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIiwiaXNzIjoiYXBpX2tleV9pc3N1ZXIiLCJhdWQiOlsiaHR0cHM6Ly9uZWJpdXMtaW5mZXJlbmNlLmV1LmF1dGgwLmNvbS9hcGkvdjIvIl0sImV4cCI6MTkwMjUyMDYxMCwidXVpZCI6ImEzZWJjY2JjLTZmYzItNDk3ZS04ZTg5LTEwMDEwMzJkOTA1YyIsIm5hbWUiOiJMb3N0bGV0dGVycy1TcGFtIiwiZXhwaXJlc19hdCI6IjIwMzAtMDQtMTVUMjE6NTY6NTArMDAwMCJ9.zmAMJE2q4_dldNIQUK-GbXE331FIG6WY6XqexZtPGOw",
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
