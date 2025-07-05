import { Injectable } from '@nestjs/common';
import OpenAI from "openai";

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    // OpenAI client will be initialized in getAiResponse method
  }

  async getAiResponse(message: string): Promise<string> {
    try {
      console.log("line 17");
      // Initialize OpenAI client directly in the method
      const client = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY, // Using environment variable
      });

      const completion = await client.chat.completions.create(
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