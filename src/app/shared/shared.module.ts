import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    AlertComponent
  ],
  imports: [ CommonModule ],
  exports: [
    LoadingSpinnerComponent,
    AlertComponent
  ],
  providers: [],
})
export class SharedModule {}
