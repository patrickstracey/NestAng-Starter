import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { PageComponent } from './page/page.component';
import { LoaderComponent } from './loader/loader.component';
import { NoResultsComponent } from './no-results/no-results.component';
import { PipesModule } from '../../utility/pipes/pipes.module';

@NgModule({
  declarations: [
    CardComponent,
    PageComponent,
    LoaderComponent,
    NoResultsComponent,
  ],
  imports: [CommonModule, PipesModule],
  exports: [
    CardComponent,
    PageComponent,
    LoaderComponent,
    NoResultsComponent,
    PipesModule,
  ],
})
export class UiModule {}
