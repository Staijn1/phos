import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {SegmentsComponent} from '../components/segments/segments.component';
import {SerialportronComponent} from '../components/serialportron/serialportron.component';
import {VisualizerComponent} from '../components/visualizer/visualizer.component'; // CLI imports router

const routes: Routes = [
    {path: 'segments', component: SegmentsComponent},
    {path: '', component: SegmentsComponent},
    {path: 'visualizer', component: VisualizerComponent}
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
    imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
