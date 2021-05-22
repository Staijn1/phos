import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from '../components/settings/settings.component';
import {ModeComponent} from '../components/mode/mode.component';
import {VisualizerComponent} from '../components/visualizer/visualizer.component';
import {HomeComponent} from '../components/home/home.component';


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
