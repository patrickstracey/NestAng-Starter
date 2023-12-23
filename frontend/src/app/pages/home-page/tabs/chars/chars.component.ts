import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { FlexLayoutModule } from "@angular/flex-layout"
import { MaterialModule } from "src/material.module"

@Component({
    selector: 'chars',
    templateUrl: './chars.component.html',
    styleUrls: ['./chars.component.scss'],
    standalone: true,
    imports: [CommonModule, MaterialModule, FlexLayoutModule],
  })
  export class CharsComponent implements OnInit {
    ngOnInit(): void {}
  }