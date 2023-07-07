import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Pages } from "./shared/types/Pages";
import { HomeComponent } from "./pages/home/home.component";

const routes: Routes = [
  {
    path: Pages.HOME,
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
