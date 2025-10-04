import { ItemCard } from './ItemCard';
import type { GroceryItem } from '@/types';
import { getCategoryColor, getCategoryIcon } from '@/utils/categories';
import { cn } from '@/lib/utils';

interface CategoryGroupProps {
  category: string;
  items: GroceryItem[];
  onToggleBought: (id: number, bought: boolean) => void;
  onDelete: (id: number) => void;
}

export const CategoryGroup = ({ 
  category, 
  items, 
  onToggleBought, 
  onDelete 
}: CategoryGroupProps) => {
  const CategoryIcon = getCategoryIcon(category);
  const colorClass = getCategoryColor(category);

  const getCategoryBgClass = (category: string) => {
    const map: Record<string, string> = {
      'Dairy': 'bg-category-dairy/10',
      'Fruits': 'bg-category-fruits/10',
      'Vegetables': 'bg-category-vegetables/10',
      'Protein': 'bg-category-protein/10',
      'Grains': 'bg-category-grains/10',
      'Snacks': 'bg-category-snacks/10',
      'Other': 'bg-category-other/10',
    };
    return map[category] || 'bg-category-other/10';
  };

  const getCategoryTextClass = (category: string) => {
    const map: Record<string, string> = {
      'Dairy': 'text-category-dairy',
      'Fruits': 'text-category-fruits',
      'Vegetables': 'text-category-vegetables',
      'Protein': 'text-category-protein',
      'Grains': 'text-category-grains',
      'Snacks': 'text-category-snacks',
      'Other': 'text-category-other',
    };
    return map[category] || 'text-category-other';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={cn("p-2 rounded-lg", getCategoryBgClass(category))}>
          <CategoryIcon className={cn("h-5 w-5", getCategoryTextClass(category))} />
        </div>
        <h2 className="text-xl font-semibold">{category}</h2>
        <span className="text-sm text-muted-foreground">
          ({items.length})
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onToggleBought={onToggleBought}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};
