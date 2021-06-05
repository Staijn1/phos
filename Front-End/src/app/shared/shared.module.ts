import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavigationbarComponent} from './components/navigationbar/navigationbar.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [NavigationbarComponent],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [NavigationbarComponent]
})
export class SharedModule { }
