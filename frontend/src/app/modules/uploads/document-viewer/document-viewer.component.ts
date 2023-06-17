import { Component, Input } from '@angular/core';
import { DocumentInterface } from '../../../../../../shared/interfaces';
import { UploadsService } from '../../../services';

@Component({
  selector: 'document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
})
export class DocumentViewerComponent {
  @Input() documents: [string, DocumentInterface][] = [];
  saving: boolean = false;

  constructor(private _uploads: UploadsService) {}

  deleteDocument(displayName: string, fileName: string) {
    this.saving = true;
    this._uploads.deleteDocument(fileName).subscribe({
      next: () => {
        this.documents = this.documents.filter((doc) => doc[0] != displayName);
        this.saving = false;
      },
      error: () => {
        this.saving = false;
      },
    });
  }

  navigateToDocument(fileName: string) {
    this._uploads.getAuthedDocumentUrl(fileName).subscribe((res) => {
      window.open(res.url, '_blank');
    });
  }
}
