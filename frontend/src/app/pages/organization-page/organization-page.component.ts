import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../services';
import { FormControl, Validators } from '@angular/forms';
import { OrganizationInterface } from '../../../../../shared/interfaces';

@Component({
  selector: 'page-organization',
  templateUrl: './organization-page.component.html',
  styleUrls: ['./organization-page.component.scss'],
})
export class OrganizationPageComponent implements OnInit {
  nameEdit: boolean = false;
  name = new FormControl<string | null>(null, Validators.required);
  organization: OrganizationInterface | null = null;
  loading: boolean = true;

  constructor(private orgService: OrganizationService) {}

  ngOnInit() {
    this.loadOrganization();
  }

  async loadOrganization() {
    this.orgService.getOrganization().subscribe({
      next: (res) => {
        this.organization = res;
        this.name.patchValue(res.name);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  editName() {
    if (this.nameEdit) {
      this.nameEdit = false;
      if (this.name.value && this.name.value != this.organization?.name) {
        this.orgService
          .patchOrganization({ name: this.name.value! })
          .subscribe((res) => (this.organization = res));
      }
    } else {
      this.nameEdit = true;
    }
  }
}
