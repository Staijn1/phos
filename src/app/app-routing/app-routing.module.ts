import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SegmentsComponent} from '../components/segments/segments.component';
import {VisualizerComponent} from '../components/visualizer/visualizer.component';
import {SettingsComponent} from '../components/settings/settings.component';
import {ModeComponent} from '../components/mode/mode.component';
import {VisualizerTestComponent} from '../components/visualizer-test/visualizer-test.component'; // CLI imports router

const routes: Routes = [
    {path: '', component: ModeComponent},
    {path: 'segments', component: SegmentsComponent},
    // {path: 'visualizer', component: VisualizerComponent},
    {path: 'visualizer', component: VisualizerTestComponent},
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
