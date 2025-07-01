import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';

const ITEMS_FILE_PATH = path.join(__dirname, '..', '..', 'data', 'items.json');

@Injectable()
export class ItemsService {
  private async readItemsFile(): Promise<Item[]> {
    try {
      const data = await fs.readFile(ITEMS_FILE_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  private async writeItemsFile(items: Item[]): Promise<void> {
    await fs.writeFile(ITEMS_FILE_PATH, JSON.stringify(items, null, 2), 'utf8');
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const items = await this.readItemsFile();
    const newItem: Item = {
      id: randomUUID(),
      name: createItemDto.name,
      description: createItemDto.description,
    };
    items.push(newItem);
    await this.writeItemsFile(items);
    return newItem;
  }

  findAll(): Promise<Item[]> {
    return this.readItemsFile();
  }

  findOne(id: string): Promise<Item | undefined> {
    return this.readItemsFile().then(items => items.find(item => item.id === id));
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item | null> {
    const items = await this.readItemsFile();
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex > -1) {
      items[itemIndex] = { ...items[itemIndex], ...updateItemDto };
      await this.writeItemsFile(items);
      return items[itemIndex];
    }
    return null;
  }

  async remove(id: string): Promise<boolean> {
    const items = await this.readItemsFile();
    const initialLength = items.length;
    const filteredItems = items.filter(item => item.id !== id);
    if (filteredItems.length < initialLength) {
      await this.writeItemsFile(filteredItems);
      return true;
    }
    return false;
  }
}