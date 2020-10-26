import { SharedModule } from './../shared/shared.module';
import { LoadingSpinnerComponent } from './../shared/loading-spinner/loading-spinner.component';
import { AuthComponent } from './auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [ CommonModule, ReactiveFormsModule, SharedModule ],
  exports: [],
  providers: [],
})
export class AuthModule {}
