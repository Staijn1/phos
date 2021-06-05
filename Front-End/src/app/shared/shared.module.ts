import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavigationbarComponent} from './components/navigationbar/navigationbar.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {RouterModule} from '@angular/router';



@NgModule({
  declarations: [NavigationbarComponent],
  imports: [
    RouterModule,
    CommonModule,
    FontAwesomeModule
  ],
  exports: [NavigationbarComponent, RouterModule]
})
export class SharedModule { }
