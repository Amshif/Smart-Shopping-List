import axios from 'axios';
import type { 
  ShoppingList, 
  GroceryItem, 
  CreateListRequest, 
  CreateItemRequest, 
  UpdateItemRequest 
} from '@/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Shopping List APIs
export const createList = async (data: CreateListRequest): Promise<ShoppingList> => {
  const response = await api.post<ShoppingList>('/api/list', data);
  return response.data;
};

export const getListByShareCode = async (shareCode: string): Promise<ShoppingList> => {
  const response = await api.get<ShoppingList>(`/api/list/${shareCode}`);
  return response.data;
};

// Grocery Items APIs
export const createItem = async (data: CreateItemRequest): Promise<GroceryItem> => {
  const response = await api.post<GroceryItem>('/api/items', data);
  return response.data;
};

export const getItems = async (listId: string): Promise<GroceryItem[]> => {
  const response = await api.get<GroceryItem[]>('/api/items', {
    params: { list_id: listId },
  });
  return response.data;
};

export const updateItem = async (
  itemId: number, 
  data: UpdateItemRequest
): Promise<GroceryItem> => {
  const response = await api.put<GroceryItem>(`/api/items/${itemId}`, data);
  return response.data;
};

export const deleteItem = async (itemId: number): Promise<void> => {
  await api.delete(`/api/items/${itemId}`);
};

export default api;
