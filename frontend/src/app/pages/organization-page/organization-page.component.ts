import { CommonModule } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { UiModule } from '@ui';
import { OrganizationService } from '@services';

@Component({
  selector: 'page-organization',
  templateUrl: './organization-page.component.html',
  styleUrls: ['./organization-page.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiModule],
})
export class OrganizationPageComponent implements OnInit {
  nameEdit: boolean = false;
  name = new FormControl<string | null>(null, Validators.required);
  organization = this.orgService.organization;

  constructor(private orgService: OrganizationService) {}

  ngOnInit() {
    this.name.patchValue(this.organization()?.name ? this.organization()!.name : '');
  }

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
