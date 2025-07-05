import { Injectable } from '@nestjs/common';
import OpenAI from "openai";

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      baseURL:  process.env.OPENROUTER_URL,
      apiKey: process.env.OPENROUTER_API_KEY, // Using environment variable
    });
  }

  async getAiResponse(message: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create(
        {
          model: "deepseek/deepseek-r1-0528-qwen3-8b:free", // Updated model
          messages: [
            {
              "role": "user",
              "content": [
                {
                  "type": "text",
                  "text": "responda em portuges: "+ message
                }
              ]
            }
          ],
        }
      );

      return completion.choices[0].message.content || "";
    } catch (error) {
      console.error("Error calling OpenRouter AI:", error);
      throw new Error(String(error.message));
    }
  }
} 