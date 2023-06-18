import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import {
  BaseInterface,
  DocumentInterface,
  SuccessMessageInterface,
} from '../../../../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UploadsService {
  constructor(private http: HttpClient) {}

  baseUrl = 'api/uploads';

  uploadImages(
    attached_to: BaseInterface,
    images: FormData
  ): Observable<string[]> {
    if (images.get('image')) {
      return this.http.post<string[]>(
        `${this.baseUrl}/${attached_to.type}/${attached_to._id}/images`,
        images
      );
    } else {
      return new Observable<string[]>((subscriber) => subscriber.next([])).pipe(
        take(1)
      );
    }
  }

  uploadDocument(
    attached_to: BaseInterface,
    form: FormData
  ): Observable<DocumentInterface> {
    if (form.get('file') && form.get('displayName')) {
      return this.http.post<DocumentInterface>(
        `${this.baseUrl}/${attached_to.type}/${attached_to._id}/document`,
        form
      );
    }
    throw 'invalid form input';
  }

  getAuthedDocumentUrl(fileName: string): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.baseUrl}/document/url`, {
      fileName: fileName,
    });
  }

  deleteUpload(
    fileName: string,
    typeString: 'document' | 'image'
  ): Observable<SuccessMessageInterface> {
    return this.http.delete<SuccessMessageInterface>(
      `${this.baseUrl}/${typeString}`,
      {
        body: { filename: fileName },
      }
    );
  }
}
