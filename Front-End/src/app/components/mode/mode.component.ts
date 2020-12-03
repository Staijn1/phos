import {Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {SerialConnectionService} from '../../services/serial/serial-connection.service';
import {ColorService} from '../../services/color/color.service';

@Component({
    selector: 'app-mode',
    templateUrl: './mode.component.html',
    styleUrls: ['./mode.component.scss']
})
export class ModeComponent implements OnInit {
    modes = [
        {mode: 0, name: 'Static'},
        {mode: 1, name: 'Blink'},
        {mode: 2, name: 'Breath'},
        {mode: 3, name: 'Color Wipe'},
        {mode: 4, name: 'Color Wipe Inverse'},
        {mode: 5, name: 'Color Wipe Reverse'},
        {mode: 6, name: 'Color Wipe Reverse Inverse'},
        {mode: 7, name: 'Color Wipe Random'},
        {mode: 8, name: 'Random Color'},
        {mode: 9, name: 'Single Dynamic'},
        {mode: 10, name: 'Multi Dynamic'},
        {mode: 11, name: 'Rainbow'},
        {mode: 12, name: 'Rainbow Cycle'},
        {mode: 13, name: 'Scan'},
        {mode: 14, name: 'Dual scan'},
        {mode: 15, name: 'Fade in/out'},
        {mode: 16, name: 'Theater Chase'},
        {mode: 17, name: 'Theater Chase Rainbow'},
        {mode: 18, name: 'Running Lights'},
        {mode: 19, name: 'Twinkle'},
        {mode: 20, name: 'Twinkle Random'},
        {mode: 21, name: 'Twinkle Fade'},
        {mode: 22, name: 'Twinkle Fade Random'},
        {mode: 23, name: 'Sparkle'},
        {mode: 24, name: 'Flash Sparkle'},
        {mode: 25, name: 'Hyper Sparkle'},
        {mode: 26, name: 'Strobe'},
        {mode: 27, name: 'Strobe Rainbow'},
        {mode: 28, name: 'Multi Strobe'},
        {mode: 29, name: 'Blink Rainbow'},
        {mode: 30, name: 'Chase White'},
        {mode: 31, name: 'Chase Color'},
        {mode: 32, name: 'Chase Random'},
        {mode: 33, name: 'Chase Rainbow'},
        {mode: 34, name: 'Chase Flash'},
        {mode: 35, name: 'Chase Flash Random'},
        {mode: 36, name: 'Chase Rainbow White'},
        {mode: 37, name: 'Chase Blackout'},
        {mode: 38, name: 'Chase Blackout Rainbow'},
        {mode: 39, name: 'Color Sweep Random'},
        {mode: 40, name: 'Running Color'},
        {mode: 41, name: 'Running Red Blue'},
        {mode: 42, name: 'Running Random'},
        {mode: 43, name: 'Larson Scanner'},
        {mode: 44, name: 'Comet '},
        {mode: 45, name: 'Fireworks'},
        {mode: 46, name: 'Fireworks Random'},
        {mode: 47, name: 'Merry Christmas'},
        {mode: 48, name: 'Fire Flicker'},
        {mode: 49, name: 'Fire Flicker (soft)'},
        {mode: 50, name: 'Fire Flicker (intense)'},
        {mode: 51, name: 'Circus Combustus'},
    ];

    classes = ['iconbox-primary', 'iconbox-orange', 'iconbox-pink', 'iconbox-yellow', 'iconbox-red', 'iconbox-teal']
    private modeIndex: number;

    constructor(public serialService: SerialConnectionService, private colorService: ColorService) {
    }

    ngOnInit(): void {
    }


    onChangeSegment($event: MouseEvent) {

        const element = $($event.currentTarget);
        element.addClass('active').siblings().removeClass('active');
        this.modeIndex = element.index();

        const mode = element.attr('id');
        this.serialService.setMode(+mode);
    }
}