import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from '../pages/settings/settings.component';
import {ModeComponent} from '../pages/mode/mode.component';
import {VisualizerComponent} from '../pages/visualizer/visualizer.component';
import {HomeComponent} from '../pages/home/home.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: HomeComponent},
  {path: 'visualizer', component: VisualizerComponent},
  {path: 'mode', component: ModeComponent},
  {path: 'settings', component: SettingsComponent}
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
