import { useState } from 'react';
import { Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import type { GroceryItem } from '@/types';
import { cn } from '@/lib/utils';

interface ItemCardProps {
  item: GroceryItem;
  onToggleBought: (id: number, bought: boolean) => void;
  onDelete: (id: number) => void;
}

export const ItemCard = ({ item, onToggleBought, onDelete }: ItemCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(item.id);
  };

  return (
    <Card 
      className={cn(
        "p-4 transition-all duration-300 hover:shadow-custom-md",
        item.bought && "opacity-60 bg-muted/50"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Checkbox
            checked={item.bought}
            onCheckedChange={(checked) => onToggleBought(item.id, checked as boolean)}
            className="h-5 w-5"
          />
          <div className="flex-1">
            <h3 
              className={cn(
                "font-medium text-base transition-all",
                item.bought && "line-through text-muted-foreground"
              )}
            >
              {item.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Quantity: {item.quantity}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
