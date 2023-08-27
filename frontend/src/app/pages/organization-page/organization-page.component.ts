import { Component } from '@angular/core';
import { OrganizationService } from '../../services';
import { FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs';

@Component({
  selector: 'page-organization',
  templateUrl: './organization-page.component.html',
  styleUrls: ['./organization-page.component.scss'],
})
export class OrganizationPageComponent {
  nameEdit: boolean = false;
  name = new FormControl<string | null>(null, Validators.required);
  organization$ = this.orgService
    .getOrganization()
    .pipe(tap((res) => this.name.patchValue(res!.name)));

  constructor(private orgService: OrganizationService) {}

  editName() {
    if (this.nameEdit) {
      this.nameEdit = false;
      if (this.name.value?.trim() != '') {
        this.orgService.patchOrganization({ name: this.name.value! });
      }
    } else {
      this.nameEdit = true;
    }
  }
}
