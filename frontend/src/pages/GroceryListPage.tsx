import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddItemForm } from '@/components/AddItemForm';
import { CategoryGroup } from '@/components/CategoryGroup';
import { ShareModal } from '@/components/ShareModal';
import { getItems, createItem, updateItem, deleteItem } from '@/services/api';
import { groupItemsByCategory } from '@/utils/categories';
import type { GroceryItem, ShoppingList } from '@/types';
import { toast } from 'react-hot-toast';

const GroceryListPage = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [listInfo, setListInfo] = useState<ShoppingList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const fetchItems = async (showRefreshingState = false) => {
    if (!listId) return;
    
    if (showRefreshingState) {
      setIsRefreshing(true);
    }
    
    try {
      const data = await getItems(listId);
      setItems(data);
      // Set mock list info for sharing - in production you'd fetch this separately
      if (!listInfo) {
        setListInfo({
          id: listId,
          name: 'My Grocery List',
          share_code: listId.slice(0, 8), // Use first 8 chars of listId as share code
          created_at: new Date().toISOString(),
        });
      }
      if (showRefreshingState) {
        toast.success('List refreshed!');
      }
    } catch (error) {
      toast.error('Failed to load items');
      console.error('Error fetching items:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // Removed automatic polling - now manual refresh only!
  }, [listId]);

  const handleRefresh = () => {
    fetchItems(true);
  };

  const handleAddItem = async (name: string, quantity: number) => {
    if (!listId) return;
    
    try {
      const newItem = await createItem({ list_id: listId, name, quantity });
      setItems((prev) => [...prev, newItem]);
      toast.success(`${name} added!`);
    } catch (error) {
      toast.error('Failed to add item');
      console.error('Error adding item:', error);
    }
  };

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
          <p className="text-muted-foreground">Loading your list...</p>
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
              Back
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => setIsShareModalOpen(true)}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Share2 className="h-4 w-4" />
                Share List
              </Button>
            </div>
          </div>

          {/* List Title & Stats */}
          <div className="bg-gradient-card rounded-2xl p-6 shadow-custom-lg">
            <h1 className="text-3xl font-bold mb-2">My Grocery List</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{items.length} total items</span>
              <span>•</span>
              <span>{boughtCount} bought</span>
              <span>•</span>
              <span>{items.length - boughtCount} remaining</span>
            </div>
          </div>

          {/* Add Item Form */}
          <AddItemForm onAdd={handleAddItem} />

          {/* Items by Category */}
          <div className="space-y-8">
            {Object.keys(groupedItems).length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  No items yet. Add your first item above!
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

      {/* Share Modal */}
      {listInfo && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          shareCode={listInfo.share_code}
          listName={listInfo.name}
        />
      )}
    </div>
  );
};

export default GroceryListPage;