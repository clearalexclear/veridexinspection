import { PhotoGallery } from './PhotoGallery';
import type { PhotoItem } from '@/data/reportData';

export function PhotosSection({ photos }: { photos: PhotoItem[] }) {
  return (
    <section id="photos" className="report-section">
      <h2 className="section-title">
        <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
        Photo Evidence Gallery
      </h2>
      <PhotoGallery photos={photos} />
    </section>
  );
}
