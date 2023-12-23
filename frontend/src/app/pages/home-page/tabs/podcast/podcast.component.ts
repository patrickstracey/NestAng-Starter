import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { FlexLayoutModule } from "@angular/flex-layout"
import { Observable } from "rxjs";
import { PodcastService } from "src/app/services/podcast.service";
import { MaterialModule } from "src/material.module"
import { Podcast } from "../../../../../../../shared/interfaces/podcast.interface";

@Component({
    selector: 'podcast',
    templateUrl: './podcast.component.html',
    styleUrls: ['./podcast.component.scss'],
    standalone: true,
    imports: [CommonModule, MaterialModule, FlexLayoutModule],
  })
  export class PodcastComponent implements OnInit {
    gridColumns = 3;
    $podcasts!: Observable<Podcast[]>
    constructor(private podcastService: PodcastService){

    }

    ngOnInit(): void {
        this.$podcasts = this.podcastService.getPodcasts()
    }
  }