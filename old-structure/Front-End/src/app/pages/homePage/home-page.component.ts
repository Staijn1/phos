import {Component, OnInit} from '@angular/core'
import {TimelineLite} from 'gsap'
import {DeviceDetectorService} from 'ngx-device-detector'

@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  timeline: TimelineLite;

  constructor(private readonly deviceService: DeviceDetectorService) {
  }

  ngOnInit(): void {
    this.timeline = new TimelineLite()

    if (this.deviceService.isTablet() || this.deviceService.isDesktop()) {
      this.timeline.fromTo('#Light_Bulb .bulb', 4, {
        strokeDashoffset: 0
      }, {
        strokeDashoffset: 500, delay: 1, repeat: -1, yoyo: true
      })
    } else {
      this.timeline.set('#Light_Bulb .bulb', {strokeDashoffset: 'initial', strokeDasharray: 'initial'})
    }

    this.timeline.fromTo('#introcover', {background: 'black'},
      {
        duration: 1.3,
        background: 'white',
        ease: 'linear'
      }, '-=1')
    this.timeline.to('#Light_Bulb .light', {duration: 1, strokeOpacity: 1, fillOpacity: 1}, '-=1.9')
    this.timeline.to('#Light_Bulb', {duration: 0.7, y: -40, ease: 'power.out'}, '-=1.9')
    this.timeline.to('#Light_Bulb .reflection', {duration: 0.5, strokeWidth: 4}, '-=2.2')

    this.timeline.to('#text', {strokeDashoffset: 0, duration: 4}, '+=1.5')
  }
}
