import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { IAiDomainService } from '../domain/services/ai-domain.service';

@Injectable()
export class OpenAIAdapter implements IAiDomainService {
  private openai: OpenAI;

  constructor() {
    if(!process.env.OPENROUTER_URL){
      throw new Error("enviroment variable: OPENROUTER_URL can not be empty")
    }
    if(!process.env.OPENROUTER_API_KEY){
      throw new Error("enviroment variable: OPENROUTER_URL can not be empty")
    }
    this.openai = new OpenAI({
      baseURL: process.env.OPENROUTER_URL,
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  }

  async getAiResponse(message: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "responda em portuges: " + message,
              },
            ],
          },
        ],
      });

      return completion.choices[0].message.content || "";
    } catch (error) {
      console.error("Error calling OpenRouter AI:", error);
      throw new Error(String(error.message));
    }
  }
} 