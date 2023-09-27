import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NotFoundPageComponent } from "./not-found-page.component";


@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: NotFoundPageComponent
      }
    ]),
    CommonModule
  ]
})
export class NotFoundPageModule {
}
