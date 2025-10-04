import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface AddItemFormProps {
  onAdd: (name: string, quantity: number) => Promise<void>;
}

export const AddItemForm = ({ onAdd }: AddItemFormProps) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await onAdd(name.trim(), parseInt(quantity) || 1);
      setName('');
      setQuantity('1');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 bg-gradient-card shadow-custom-md">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="text"
          placeholder="Item name (e.g., Milk)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
          disabled={isLoading}
        />
        <Input
          type="number"
          placeholder="Qty"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          className="w-20"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !name.trim()}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </form>
    </Card>
  );
};
