import {Component, OnInit} from '@angular/core'
import {TimelineLite} from 'gsap'

@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  timeline!: TimelineLite;

  constructor() {
  }

  ngOnInit(): void {
    this.timeline = new TimelineLite()

    this.timeline.to('#Light_Bulb .light', {duration: 1, strokeOpacity: 1, fillOpacity: 1}, '-=1.9')
    this.timeline.to('#Light_Bulb', {duration: 0.7, y: -40, ease: 'power.out'}, '-=1.9')
    this.timeline.to('#Light_Bulb .reflection', {duration: 0.5, strokeWidth: 4}, '-=2.2')

    this.timeline.to('#ledcontroltext', {strokeDashoffset: 0, duration: 4}, '+=1.5')
  }
}
