import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {HomePageComponent} from './home-page.component'
import {RouterModule, Routes} from '@angular/router'


const routerConfig: Routes = [
  {path: '', component: HomePageComponent}
]

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    RouterModule.forChild(routerConfig),
    CommonModule
  ],
  exports: [RouterModule]
})
export class HomePageModule {
}
