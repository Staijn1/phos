import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', loadComponent: () => import('../pages/home-page/home-page.component').then(m => m.HomePageComponent)},
  { path: 'visualizer', loadComponent: () => import('../pages/visualizer-page/visualizer-page.component').then(m => m.VisualizerPageComponent)},
  { path: 'mode', loadComponent: () => import('../pages/mode-page/mode-page.component').then(m => m.ModePageComponent)},
  {
    path: 'spotify-callback',
    loadComponent: () => import('../pages/spotify-callback-page/spotify-authentication-callback.component').then(m => m.SpotifyAuthenticationCallbackComponent)
  },
  { path: 'settings', loadComponent: () => import('../pages/settings-page/settings-page.component').then(m => m.SettingsPageComponent)},
  {
    path: 'shortcut',
    loadComponent: () => import('../pages/shortcut-page/shortcut-page.component').then(m => m.ShortcutPageComponent)
  },
  {
    path: '**',
    loadComponent: () => import('../pages/not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
