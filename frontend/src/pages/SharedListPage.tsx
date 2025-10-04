import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryGroup } from '@/components/CategoryGroup';
import { getListByShareCode, getItems, updateItem, deleteItem } from '@/services/api';
import { groupItemsByCategory } from '@/utils/categories';
import type { GroceryItem, ShoppingList } from '@/types';
import { toast } from 'react-hot-toast';

const SharedListPage = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  const navigate = useNavigate();
  const [list, setList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!shareCode) return;

    try {
      const listData = await getListByShareCode(shareCode);
      setList(listData);
      const itemsData = await getItems(listData.id);
      setItems(itemsData);
    } catch (error) {
      toast.error('Failed to load shared list');
      console.error('Error fetching shared list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [shareCode]);

  const handleToggleBought = async (itemId: number, bought: boolean) => {
    try {
      const updatedItem = await updateItem(itemId, { bought });
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? updatedItem : item))
      );
      toast.success(bought ? 'Item marked as bought!' : 'Item unmarked');
    } catch (error) {
      toast.error('Failed to update item');
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      await deleteItem(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success('Item deleted');
    } catch (error) {
      toast.error('Failed to delete item');
      console.error('Error deleting item:', error);
    }
  };

  const groupedItems = groupItemsByCategory(items);
  const boughtCount = items.filter((item) => item.bought).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading shared list...</p>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-xl text-muted-foreground">List not found</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Button>
          </div>

          {/* Shared Banner */}
          <div className="bg-primary/10 border-2 border-primary/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Share2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-primary">Shared List</p>
                <p className="text-sm text-muted-foreground">
                  You're viewing a shared shopping list
                </p>
              </div>
            </div>
          </div>

          {/* List Title & Stats */}
          <div className="bg-gradient-card rounded-2xl p-6 shadow-custom-lg">
            <h1 className="text-3xl font-bold mb-2">{list.name}</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{items.length} total items</span>
              <span>•</span>
              <span>{boughtCount} bought</span>
              <span>•</span>
              <span>{items.length - boughtCount} remaining</span>
            </div>
          </div>

          {/* Items by Category */}
          <div className="space-y-8">
            {Object.keys(groupedItems).length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  No items in this list yet
                </p>
              </div>
            ) : (
              Object.entries(groupedItems).map(([category, categoryItems]) => (
                <CategoryGroup
                  key={category}
                  category={category}
                  items={categoryItems}
                  onToggleBought={handleToggleBought}
                  onDelete={handleDeleteItem}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedListPage;
