import axios from 'axios';

const API_URL = 'http://localhost:3001/items'; // Certifique-se de que esta URL corresponde à porta do seu backend NestJS

export interface Item {
  id: string;
  name: string;
  description: string;
}

export interface CreateItemDto {
  name: string;
  description: string;
}

export interface UpdateItemDto {
  name?: string;
  description?: string;
}

const itemService = {
  getAllItems: async (): Promise<Item[]> => {
    const response = await axios.get<Item[]>(API_URL);
    return response.data;
  },

  getItemById: async (id: string): Promise<Item> => {
    const response = await axios.get<Item>(`${API_URL}/${id}`);
    return response.data;
  },

  createItem: async (item: CreateItemDto): Promise<Item> => {
    const response = await axios.post<Item>(API_URL, item);
    return response.data;
  },

  updateItem: async (id: string, item: UpdateItemDto): Promise<Item> => {
    const response = await axios.patch<Item>(`${API_URL}/${id}`, item);
    return response.data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};

export default itemService;