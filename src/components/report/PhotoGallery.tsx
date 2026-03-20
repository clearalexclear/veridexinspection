import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import type { PhotoItem } from '@/data/reportData';
import { cn } from '@/lib/utils';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'product', label: 'Product' },
  { key: 'defect', label: 'Defects' },
  { key: 'packaging', label: 'Packaging' },
  { key: 'carton', label: 'Cartons' },
  { key: 'labeling', label: 'Labeling' },
  { key: 'factory', label: 'Factory' },
] as const;

export function PhotoGallery({ photos }: { photos: PhotoItem[] }) {
  const [filter, setFilter] = useState<string>('all');
  const [lightbox, setLightbox] = useState<PhotoItem | null>(null);

  const filtered = filter === 'all' ? photos : photos.filter(p => p.category === filter);

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(c => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.97]',
              filter === c.key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(photo => (
          <button
            key={photo.id}
            onClick={() => setLightbox(photo)}
            className="group report-card overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-card opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
              {photo.defectRef && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger text-danger-foreground">
                  {photo.defectRef}
                </span>
              )}
            </div>
            <p className="px-3 py-2.5 text-xs text-muted-foreground leading-relaxed text-left">{photo.caption}</p>
          </button>
        ))}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-foreground/80 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl w-full fade-in" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-12 right-0 p-2 text-card hover:text-card/80 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={lightbox.url} alt={lightbox.caption} className="w-full rounded-xl shadow-2xl" />
            <p className="mt-3 text-sm text-card/80 text-center">{lightbox.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}
