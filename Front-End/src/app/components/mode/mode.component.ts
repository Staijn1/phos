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
        {mode: 13, name: 'Moving dot'},
        {mode: 14, name: 'Double moving dot'},
        {mode: 15, name: 'Fade in/out'},
        {mode: 16, name: 'Theater Chase'},
        {mode: 17, name: 'Theater Chase Rainbow'},
        {mode: 18, name: 'Running Lights'},
        {mode: 19, name: 'Twinkle'},
        {mode: 20, name: 'Twinkle Random'},
        {mode: 21, name: 'Twinkle Fade'},
        {mode: 22, name: 'Thunder'},
        {mode: 23, name: 'Thunderstorm Rainbow'},
        {mode: 24, name: 'Thunderstorm Multi'},
        // 25 is lelijk
        {mode: 26, name: 'Short Blink'},
        {mode: 28, name: 'Strobo'},
        {mode: 29, name: 'Rainbow Strobo'},
        {mode: 27, name: 'Rainbow Strobo 2'},
        {mode: 30, name: 'Colored Dot'},
        {mode: 31, name: 'Scroll Dot'},
        {mode: 32, name: 'Scroll Dot Random'},
        {mode: 33, name: 'Rainbow White Dot'},
        {mode: 34, name: 'Flashing Dot'},
        {mode: 35, name: 'Flashing Scroll Random'},
        {mode: 36, name: 'Rainbow Dot'},
        {mode: 37, name: 'Scroll'},
        {mode: 38, name: 'Rainbow Wipe'},
        {mode: 39, name: 'Wipe Back And Forth'},
        {mode: 40, name: 'White Chase'},
        {mode: 41, name: 'Purple/Pink Chase'},
        {mode: 42, name: 'Rainbow Chase'},
        {mode: 43, name: 'KITT'},
        {mode: 44, name: 'Comet'},
        {mode: 45, name: 'Fireworks'},
        {mode: 46, name: 'Fireworks Random'},
        {mode: 47, name: 'Red/Green chase'},
        {mode: 48, name: 'Fire Flicker'},
        {mode: 49, name: 'Fire Flicker (soft)'},
        {mode: 50, name: 'Fire Flicker (intense)'},
    ];

    modeIndex: number;

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
