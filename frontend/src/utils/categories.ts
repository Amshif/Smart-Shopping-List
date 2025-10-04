import type { CategoryType } from '@/types';
import { 
  Milk, 
  Apple, 
  Carrot, 
  Beef, 
  Wheat, 
  Cookie,
  Package,
  ShoppingBasket
} from 'lucide-react';

export const getCategoryColor = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'Dairy': 'category-dairy',
    'Fruits': 'category-fruits',
    'Vegetables': 'category-vegetables',
    'Protein': 'category-protein',
    'Grains': 'category-grains',
    'Snacks': 'category-snacks',
    'Other': 'category-other',
  };
  return categoryMap[category] || 'category-other';
};

export const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    'Dairy': Milk,
    'Fruits': Apple,
    'Vegetables': Carrot,
    'Protein': Beef,
    'Grains': Wheat,
    'Snacks': Cookie,
    'Other': Package,
  };
  // Always return an icon - fallback to ShoppingBasket if category not found
  return iconMap[category] || ShoppingBasket;
};

export const groupItemsByCategory = (items: any[]) => {
  const grouped = items.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  // Sort categories in preferred order
  const order: CategoryType[] = ['Dairy', 'Fruits', 'Vegetables', 'Protein', 'Grains', 'Snacks', 'Other'];
  const sorted: Record<string, any[]> = {};
  
  // Add categories in preferred order
  order.forEach(cat => {
    if (grouped[cat]) {
      sorted[cat] = grouped[cat];
    }
  });
  
  // Add any remaining categories that aren't in the preferred order
  Object.keys(grouped).forEach(cat => {
    if (!sorted[cat]) {
      sorted[cat] = grouped[cat];
    }
  });

  return sorted;
};