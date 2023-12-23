import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { FlexLayoutModule } from "@angular/flex-layout"
import { MaterialModule } from "src/material.module"

@Component({
    selector: 'podcast',
    templateUrl: './podcast.component.html',
    styleUrls: ['./podcast.component.scss'],
    standalone: true,
    imports: [CommonModule, MaterialModule, FlexLayoutModule],
  })
  export class PodcastComponent implements OnInit {
    gridColumns = 3;
    ngOnInit(): void {}
  }