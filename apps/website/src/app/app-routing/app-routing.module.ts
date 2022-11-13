import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {SettingsPageComponent} from '../pages/settingsPage/settings-page.component'
import {ModePageComponent} from '../pages/modePage/mode-page.component'
import {VisualizerPageComponent} from '../pages/visualizerPage/visualizer-page.component'
import {VisualizerPage3DComponent} from '../pages/visualizer-page3-d/visualizer-page3-d.component'


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', loadChildren: () => import('../pages/homePage/home-page.module').then(m => m.HomePageModule)},
  {path: 'visualizer', component: VisualizerPageComponent},
  {path: 'mode', component: ModePageComponent},
  {
    path: 'gradients-editor',
    loadChildren: () => import('../pages/gradientEditorPage/gradient-editor.module').then(m => m.GradientEditorModule)
  },
  {path: 'settings', component: SettingsPageComponent},
  {path: 'visualizer3d', component: VisualizerPage3DComponent}
] // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
