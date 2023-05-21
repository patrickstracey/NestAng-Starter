import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardComponent} from "./card/card.component";
import {PageComponent} from "./page/page.component";
import {LoaderComponent} from "./loader/loader.component";
import {NoResultsComponent} from "./no-results/no-results.component";


@NgModule({
  declarations: [CardComponent, PageComponent, LoaderComponent, NoResultsComponent],
  imports: [
    CommonModule
  ],
  exports: [CardComponent, PageComponent, LoaderComponent, NoResultsComponent]
})
export class UiModule { }
