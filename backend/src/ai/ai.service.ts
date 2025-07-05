import { Injectable } from '@nestjs/common';
import OpenAI from "openai";

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: "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",
    });
  }

  async getAiResponse(message: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "google/gemini-2.5-flash-lite-preview-06-17",
        messages: [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": message
              }
            ]
          }
        ],
      });

      return completion.choices[0].message.content || "";
    } catch (error) {
      console.error("Error calling OpenRouter AI:", error);
      throw new Error("Erro ao processar sua solicitação com a IA.");
    }
  }
} 