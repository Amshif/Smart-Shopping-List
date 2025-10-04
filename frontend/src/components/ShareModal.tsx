import { QRCodeSVG } from 'qrcode.react';
import { Copy, Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareCode: string;
  listName: string;
}

export const ShareModal = ({ isOpen, onClose, shareCode, listName }: ShareModalProps) => {
  const shareUrl = `${window.location.origin}/share/${shareCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listName,
          text: `Check out my shopping list: ${listName}`,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Share List
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4 p-6 bg-muted/50 rounded-lg">
            <QRCodeSVG 
              value={shareUrl} 
              size={200}
              level="H"
              className="border-4 border-background p-2 rounded-lg"
            />
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code to access the list
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Share Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareCode}
                readOnly
                className="flex-1 px-3 py-2 bg-muted rounded-md text-center font-mono text-lg font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Share Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-muted rounded-md text-sm"
              />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCopy} variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button onClick={handleShare} className="flex-1 bg-primary">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
