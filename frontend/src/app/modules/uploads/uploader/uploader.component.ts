import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

interface UploaderConfigInterface {
  string: 'image' | 'file';
  sizeLimit: number;
  accept: 'image/*' | 'application/pdf';
  uploadType: string;
}

const imageConfigs: UploaderConfigInterface = {
  string: 'image',
  sizeLimit: 3000000,
  accept: 'image/*',
  uploadType: 'image (.jpg or .png)',
};

const fileConfigs: UploaderConfigInterface = {
  string: 'file',
  sizeLimit: 5000000,
  accept: 'application/pdf',
  uploadType: 'file (.pdf)',
};

@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent implements OnInit {
  selectedFiles?: FileList;
  previews: any[] = [];
  fileNames: string[] = [];
  fileErrors: string[] = [];
  uploadedImages = new FormData();
  readableImageString: string = 'images';
  configs: UploaderConfigInterface = imageConfigs;

  @Input() uploaderType: 'file' | 'image' = 'image';
  @Input() limit: number = 15;
  @Output() imagesUpdated = new EventEmitter<FormData>();

  constructor() {}

  ngOnInit(): void {
    if (this.uploaderType == 'file') {
      this.configs = fileConfigs;
    }

    if (this.limit > 1) {
      this.readableImageString = this.configs.string + 's';
    } else {
      this.readableImageString = this.configs.string;
    }
  }

  onFileSelected(event: any) {
    this.selectedFiles = <FileList>event.target.files;
    if (this.selectedFiles?.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        if (this.selectedFiles[i].size < this.configs.sizeLimit) {
          //3MB (3000000) - avg iphone image
          this.uploadedImages.append(
            this.configs.string,
            this.selectedFiles[i],
            this.selectedFiles[i].name
          );
          this.fileNames.push(this.selectedFiles[i].name);
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.previews.push(e.target.result);
          };
          reader.readAsDataURL(this.selectedFiles[i]);
        } else {
          const size = (this.selectedFiles[i].size / 1000000).toFixed(3);
          this.fileErrors.push(
            `The ${this.configs.string} ${this.selectedFiles[i].name} is too large (${size} MB).`
          );
        }
      }
      this.emitFormData();
    }
  }

  removeImages() {
    this.uploadedImages = new FormData();
    this.previews = [];
    this.fileNames = [];
    this.fileErrors = [];
    this.emitFormData();
  }

  emitFormData() {
    this.imagesUpdated.emit(this.uploadedImages);
  }
}
