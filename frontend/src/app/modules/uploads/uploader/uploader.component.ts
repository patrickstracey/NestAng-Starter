import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { BaseInterface } from '../../../../../../shared/interfaces';
import { UploadsService } from '../../../services';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

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

/**
 * This component takes and displays files and emits them as form data, you should call the uploads service from the component
 * that is creating the entity these will be attached to. This allows you to subscribe to a creation event and then attempt
 * to attach the files to the newly created entity via the upload service while creating the impression of a single unified
 * step for your users. If your entity already exists, you can pass `attached_to` as an `Input()` and have this component
 * handle all of the needed upload logic for that entity within the component.
 */
@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class UploaderComponent implements OnInit {
  selectedFiles?: FileList;
  previews: any[] = [];
  fileNames: string[] = [];
  fileErrors: string[] = [];
  uploadedItems = new FormData();
  readableTypeString: string = 'images';
  configs: UploaderConfigInterface = imageConfigs;
  saving: boolean = false;
  documentDisplayName: FormControl = new FormControl<string | null>(
    null,
    Validators.required
  );

  @Input() limit: number = 15;
  @Input() uploaderType: 'file' | 'image' = 'image';
  @Input() attached_to?: BaseInterface;
  @Output() uploadItemsUpdated = new EventEmitter<FormData>();

  constructor(private uploadsService: UploadsService) {}

  ngOnInit(): void {
    if (this.uploaderType == 'file') {
      this.configs = fileConfigs;
      this.limit = 1;
    }

    if (this.limit > 1) {
      this.readableTypeString = this.configs.string + 's';
    } else {
      this.readableTypeString = this.configs.string;
    }
  }

  onFileSelected(event: any) {
    this.selectedFiles = <FileList>event.target.files;
    if (this.selectedFiles?.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        if (this.selectedFiles[i].size < this.configs.sizeLimit) {
          //3MB (3000000) - avg iphone image
          this.uploadedItems.append(
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
    this.uploadedItems = new FormData();
    this.previews = [];
    this.fileNames = [];
    this.fileErrors = [];
    this.documentDisplayName.reset();
    this.emitFormData();
  }

  emitFormData() {
    this.uploadItemsUpdated.emit(this.uploadedItems);
  }

  upload() {
    if (this.attached_to && this.selectedFiles) {
      this.saving = true;
      if (this.uploaderType === 'image') {
        this.uploadsService
          .uploadImages(this.attached_to, this.uploadedItems)
          .subscribe({
            next: () => {
              this.saving = false;
              this.removeImages();
            },
            error: () => {
              this.saving = false;
            },
          });
      } else if (
        this.uploaderType === 'file' &&
        this.documentDisplayName.valid
      ) {
        this.uploadedItems.append(
          'displayName',
          this.documentDisplayName.value!
        );
        this.uploadsService
          .uploadDocument(this.attached_to, this.uploadedItems)
          .subscribe({
            next: () => {
              this.saving = false;
              this.removeImages();
            },
            error: () => {
              this.saving = false;
            },
          });
      } else {
        this.documentDisplayName.markAsTouched();
      }
    }
  }
}
