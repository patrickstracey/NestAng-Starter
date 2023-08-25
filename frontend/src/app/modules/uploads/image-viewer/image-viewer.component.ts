import { Component, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent {
  imageUrl = environment.IMAGE_URL;
  @Input() images: string[] = [];
  currentImage: string | null = null;
  imageIndex: number = 0;

  viewImage(index: number) {
    this.imageIndex = index;
    this.currentImage = this.images[index];
  }

  closeOverlay() {
    this.currentImage = null;
  }

  cycleImage(newIndex: number) {
    let nextImage: number = newIndex;
    if (newIndex < 0) {
      nextImage = this.images.length - 1;
    } else if (newIndex >= this.images.length) {
      nextImage = 0;
    }
    this.imageIndex = nextImage;
    this.currentImage = this.images[nextImage];
  }
}
