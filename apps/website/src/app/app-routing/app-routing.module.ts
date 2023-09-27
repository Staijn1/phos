import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SettingsPageComponent } from "../pages/settings-page/settings-page.component";
import { ModePageComponent } from "../pages/mode-page/mode-page.component";
import { VisualizerPageComponent } from "../pages/visualizer-page/visualizer-page.component";
import { ShortcutPageComponent } from "../pages/shortcut-page/shortcut-page.component";


const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "home", loadChildren: () => import("../pages/home-page/home-page.module").then(m => m.HomePageModule) },
  { path: "visualizer", component: VisualizerPageComponent },
  { path: "mode", component: ModePageComponent },
  {
    path: "spotify-callback",
    loadChildren: () => import("../pages/spotify-callback-page/spotify-callback-page.module").then(m => m.SpotifyCallbackPageModule)
  },
  { path: "settings", component: SettingsPageComponent },
  {
    path: "shortcut",
    component: ShortcutPageComponent
  },
  {
    path: "**",
    loadChildren: () => import("../pages/not-found-page/not-found-page.module").then(m => m.NotFoundPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
