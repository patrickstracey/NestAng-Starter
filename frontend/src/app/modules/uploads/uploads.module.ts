import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { UploaderComponent } from './uploader/uploader.component';
import { DocumentViewerComponent } from './document-viewer/document-viewer.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ImageViewerComponent,
    UploaderComponent,
    DocumentViewerComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [ImageViewerComponent, DocumentViewerComponent, UploaderComponent],
})
export class UploadsModule {}
