import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsPageComponent} from '../pages/settingsPage/settings-page.component';
import {ModePageComponent} from '../pages/modePage/mode-page.component';
import {VisualizerPageComponent} from '../pages/visualizerPage/visualizer-page.component';
import {HomePageComponent} from '../pages/homePage/home-page.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: HomePageComponent},
  {path: 'visualizer', component: VisualizerPageComponent},
  {path: 'mode', component: ModePageComponent},
  {path: 'settings', component: SettingsPageComponent}
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
