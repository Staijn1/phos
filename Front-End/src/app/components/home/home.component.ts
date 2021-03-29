import {Component, OnInit} from '@angular/core';
import {TimelineMax} from 'gsap';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    timeline: TimelineMax;

    ngOnInit(): void {
        this.timeline = new TimelineMax();

        this.timeline.fromTo('#Light_Bulb .bulb', 4, {
            strokeDashoffset: 0
        }, {strokeDashoffset: 500, delay: 2, repeat: -1, yoyo: true});
        this.timeline.to('#Light_Bulb .reflection', {duration: 0.5, strokeWidth: 4}, '-=2');
        this.timeline.to('#Light_Bulb .light', {duration: 1, strokeOpacity: 1, fillOpacity: 1}, '-=1.6');
        this.timeline.to('#introcover', {duration: 1, background: 'white'}, '-=1.6');
        this.timeline.to('#Light_Bulb', {duration: 0.7, y: -40, ease: 'power.out'}, '-=1.6');
        this.timeline.to('#text', {strokeDashoffset: 0, duration: 4}, '+=1.5');
    }
}
