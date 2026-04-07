import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image, Plus, X, Tag } from 'lucide-react';

type ImageItem = {
  url: string;
  caption: string;
  category: string;
  reference: string;
};

type Props = {
  data: any;
  onUpdate: (field: string, value: any) => void;
};

const categories = [
  { value: 'product', label: 'Product' },
  { value: 'defect', label: 'Defect' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'shipping_mark', label: 'Shipping Mark' },
  { value: 'test', label: 'Test' },
  { value: 'uncategorized', label: 'Uncategorized' },
];

const catColors: Record<string, string> = {
  product: 'bg-primary/10 text-primary',
  defect: 'bg-destructive/10 text-destructive',
  packaging: 'bg-warning/10 text-warning',
  shipping_mark: 'bg-accent text-accent-foreground',
  test: 'bg-success/10 text-success',
  uncategorized: 'bg-muted text-muted-foreground',
};

export default function ImageReviewSection({ data, onUpdate }: Props) {
  const images: ImageItem[] = data.images || [];

  const updateImage = (i: number, field: string, val: string) => {
    const updated = [...images];
    updated[i] = { ...updated[i], [field]: val };
    onUpdate('images', updated);
  };

  const addImage = () => {
    onUpdate('images', [...images, { url: '', caption: '', category: 'uncategorized', reference: '' }]);
  };

  const removeImage = (i: number) => {
    onUpdate('images', images.filter((_, idx) => idx !== i));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Image className="w-4 h-4 text-primary" /> Images ({images.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={addImage}>
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {images.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No images extracted. Add images manually or they will be extracted from the document.
          </p>
        )}
        {images.map((img, i) => (
          <div key={i} className="p-3 rounded-lg border border-border space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <select
                className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium"
                value={img.category || 'uncategorized'}
                onChange={(e) => updateImage(i, 'category', e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <Badge variant="outline" className={catColors[img.category] || catColors.uncategorized}>
                {img.category}
              </Badge>
              <div className="flex-1" />
              <Button variant="ghost" size="icon" className="shrink-0 h-7 w-7" onClick={() => removeImage(i)}>
                <X className="w-3 h-3" />
              </Button>
            </div>

            {img.url && (
              <div className="rounded-md overflow-hidden border border-border bg-muted/30 max-h-40 flex items-center justify-center">
                <img
                  src={img.url}
                  alt={img.caption || `Image ${i + 1}`}
                  className="max-h-40 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">Caption</Label>
                <Input
                  value={img.caption || ''}
                  onChange={(e) => updateImage(i, 'caption', e.target.value)}
                  placeholder="Describe this image..."
                  className="mt-0.5 h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Reference / Page</Label>
                <Input
                  value={img.reference || ''}
                  onChange={(e) => updateImage(i, 'reference', e.target.value)}
                  placeholder="e.g. Page 3, Fig 2"
                  className="mt-0.5 h-8 text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground">Image URL</Label>
              <Input
                value={img.url || ''}
                onChange={(e) => updateImage(i, 'url', e.target.value)}
                placeholder="https://..."
                className="mt-0.5 h-8 text-sm"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
