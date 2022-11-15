import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule, Routes} from '@angular/router'
import {GradientEditorPageComponent} from './gradient-editor-page.component'
import {SharedModule} from '../../shared/shared.module'
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap'


const routerConfig: Routes = [
  {path: '', component: GradientEditorPageComponent}
]

@NgModule({
  declarations: [GradientEditorPageComponent],
  imports: [
    SharedModule,
    FontAwesomeModule,
    NgbCollapseModule,
    RouterModule.forChild(routerConfig),
    CommonModule
  ],
  exports: [RouterModule]
})
export class GradientEditorModule {
}
