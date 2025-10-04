import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { createList } from '@/services/api';
import { toast } from 'react-hot-toast';

const HomePage = () => {
  const [listName, setListName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim()) return;

    setIsLoading(true);
    try {
      const list = await createList({ name: listName.trim() });
      toast.success('Shopping list created!');
      navigate(`/list/${list.id}`);
    } catch (error) {
      toast.error('Failed to create list. Please try again.');
      console.error('Error creating list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <ShoppingCart className="h-16 w-16 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Smart Shopping List
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              Create, share, and manage your grocery lists with your family in real-time
            </p>
          </div>

          {/* Create List Form */}
          <Card className="p-8 shadow-custom-lg bg-gradient-card">
            <form onSubmit={handleCreateList} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="listName" className="text-lg font-medium">
                  Create Your Shopping List
                </label>
                <Input
                  id="listName"
                  type="text"
                  placeholder="e.g., Weekly Groceries, Party Shopping..."
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="text-lg py-6"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                size="lg"
                disabled={isLoading || !listName.trim()}
                className="w-full text-lg py-6 bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  'Creating...'
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Create List
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <Card className="p-6 text-center space-y-3 hover:shadow-custom-md transition-shadow">
              <div className="w-12 h-12 bg-category-dairy/10 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart className="h-6 w-6 text-category-dairy" />
              </div>
              <h3 className="font-semibold">Auto-Categorize</h3>
              <p className="text-sm text-muted-foreground">
                Items are automatically sorted by category
              </p>
            </Card>
            <Card className="p-6 text-center space-y-3 hover:shadow-custom-md transition-shadow">
              <div className="w-12 h-12 bg-category-fruits/10 rounded-full flex items-center justify-center mx-auto">
                <Plus className="h-6 w-6 text-category-fruits" />
              </div>
              <h3 className="font-semibold">Easy to Use</h3>
              <p className="text-sm text-muted-foreground">
                Add items with just a name and quantity
              </p>
            </Card>
            <Card className="p-6 text-center space-y-3 hover:shadow-custom-md transition-shadow">
              <div className="w-12 h-12 bg-category-vegetables/10 rounded-full flex items-center justify-center mx-auto">
                <ArrowRight className="h-6 w-6 text-category-vegetables" />
              </div>
              <h3 className="font-semibold">Share with QR</h3>
              <p className="text-sm text-muted-foreground">
                Share lists instantly with family members
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
