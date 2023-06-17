import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { UploaderComponent } from './uploader/uploader.component';

@NgModule({
  declarations: [ImageViewerComponent, UploaderComponent],
  imports: [CommonModule],
  exports: [ImageViewerComponent, UploaderComponent],
})
export class UploadsModule {}
