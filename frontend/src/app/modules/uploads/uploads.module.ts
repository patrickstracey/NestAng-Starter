import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { UploaderComponent } from './uploader/uploader.component';
import { DocumentViewerComponent } from './document-viewer/document-viewer.component';

@NgModule({
  declarations: [
    ImageViewerComponent,
    UploaderComponent,
    DocumentViewerComponent,
  ],
  imports: [CommonModule],
  exports: [ImageViewerComponent, DocumentViewerComponent, UploaderComponent],
})
export class UploadsModule {}
