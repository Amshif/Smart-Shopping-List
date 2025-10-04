export interface ShoppingList {
  id: string;
  name: string;
  share_code: string;
  created_at: string;
}

export interface GroceryItem {
  id: number;
  list_id: string;
  name: string;
  quantity: number;
  category: string;
  bought: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateListRequest {
  name: string;
}

export interface CreateItemRequest {
  list_id: string;
  name: string;
  quantity: number;
}

export interface UpdateItemRequest {
  name?: string;
  quantity?: number;
  bought?: boolean;
}

export type CategoryType = 
  | 'Dairy' 
  | 'Fruits' 
  | 'Vegetables' 
  | 'Protein' 
  | 'Grains' 
  | 'Snacks' 
  | 'Other';
