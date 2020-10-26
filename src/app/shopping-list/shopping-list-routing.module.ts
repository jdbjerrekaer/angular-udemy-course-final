import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListComponent } from './shopping-list.component';

const appRoutes: Routes = [
  { path: '', component: ShoppingListComponent }
];

@NgModule({
  declarations: [],
  imports: [ CommonModule, RouterModule.forChild(appRoutes) ],
  exports: [RouterModule],
  providers: [],
})
export class ShoppingListRouterModule {}
