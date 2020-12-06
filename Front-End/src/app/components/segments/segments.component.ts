import {Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {SerialConnectionService} from '../../services/serial/serial-connection.service';
import {ColorService} from '../../services/color/color.service';


@Component({
    selector: 'app-segments',
    templateUrl: './segments.component.html',
    styleUrls: ['./segments.component.scss']
})

export class SegmentsComponent implements OnInit {
    segments = [
        {start: 0, stop: 9, mode: 0, speed: 1000, options: 0, colors: [16711680, 65280, 255]}
    ];

    segmentIndex = 0;
    rangeSlider = [this.segments[this.segmentIndex].start, this.segments[this.segmentIndex].stop];
    speedSlider = 1000;
    speedSliderConfig = {
        start: this.speedSlider,
        connect: [true, false],
        step: 10,
        range: {
            min: [20, 1],
            '25%': [100, 10],
            '50%': [1000, 100],
            '75%': [10000, 500],
            max: [30000]
        },
        format: {
            to(value): number {
                return value.toFixed(0);
            },
            from(value): number {
                return parseInt(value, 10);
            }
        }
    };
    modes: any;
    private numPixels = 30;
    rangeSliderConfig = {
        behaviour: 'drag',
        connect: true,
        start: this.rangeSlider,
        margin: 1,
        limit: this.numPixels,
        range: {
            min: 0,
            max: this.numPixels - 1
        },
        step: 1,
    };

    constructor(public serialService: SerialConnectionService, private colorService: ColorService) {
        this.loadModes();
    }

    ngOnInit(): void {

    }

    getModeName(indexToLookFor: number): string {
        let name = '404 mode not found';
        for (const mode of this.modes) {
            // tslint:disable-next-line:triple-equals
            if (mode.modeNumber == indexToLookFor) {
                name = mode.modeName;
                break;
            }
        }
        return name;
    }

    onAddSegment(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        if (this.segments.length > 9) {
            return;
        } // Max 10 segments

        // Calculate new segments starting led by adding one to the maximum stop led
        let start = 0;

        for (const segment of this.segments) {
            if (segment.stop >= start) {
                start = segment.stop + 1;
            }
        }
        if (start > this.numPixels - 1) {
            start = this.numPixels - 1;
        }

        this.segments.push({
            start,
            stop: this.numPixels - 1,
            mode: $('#modes').val() as number,
            speed: 1000,
            options: 0,
            colors: [16711680, 65280, 255]
        });
        this.segmentIndex = this.segments.length - 1;
        this.updateWidgets();
    }

    onDeleteSegment(event: MouseEvent, index: number): void {
        event.preventDefault();
        event.stopPropagation();
        this.segments.splice(index, 1);
        if (this.segmentIndex >= this.segments.length) {
            this.segmentIndex = this.segments.length - 1;
        }
        this.updateWidgets();
    }

    onChangeSegment(event: MouseEvent): void {
        const element = $(event.currentTarget);
        element.addClass('active').siblings().removeClass('active');
        this.segmentIndex = element.index();
        this.updateWidgets();
    }

    updateSegment(): void {
        (this.segments)[this.segmentIndex].start = this.rangeSlider[0];
        (this.segments)[this.segmentIndex].stop = this.rangeSlider[1];
        (this.segments)[this.segmentIndex].speed = this.speedSlider;
        (this.segments)[this.segmentIndex].mode = ($('#modes').val() as number);

        (this.segments)[this.segmentIndex].options = $('#reverse').prop('checked') ? 0x80 : 0;
        (this.segments)[this.segmentIndex].options |= $('#gamma').prop('checked') ? 0x08 : 0;
        (this.segments)[this.segmentIndex].options |= $('#fade').val() ? ($('#fade').val() as number) << 4 : 0;
        (this.segments)[this.segmentIndex].options |= $('#size').val() ? ($('#size').val() as number) << 1 : 0;

        // Todo This needs to be replaced with colorpicker values later on!!
        // (this.segments)[segmentIndex].colors[0] = this.colorService.pickerOne._color.//$('#color0').val();
        // (this.segments)[this.segmentIndex].colors[1] = //$('#color1').val();
        // (this.segments)[this.segmentIndex].colors[2] = //$('#color2').val();

        this.updateWidgets();
    }

    onSave(): void {
        // const json = `{"segments":[${JSON.stringify(this.segments)}]}`;

        // console.log(JSON.stringify(json))
        // this.serialService.setSegment(JSON.stringify(json));


        let json = '{';
        json += '"segments":[';

        $.each(this.segments, (i, item) => {
            if (i !== 0) {
                json += ',';
            }
            json += '{';
            json += '"start":' + item.start;
            json += ',"stop":' + item.stop;
            json += ',"mode":' + item.mode;
            json += ',"speed":' + item.speed;
            json += ',"options":' + item.options;
            json += ',"colors":[' +
                // transform the color info from '#000000' format into a number
                // parseInt(colorPicker.colors[0].hexString.replace('#', ''), 16) + ',' +
                // parseInt(colorPicker.colors[1].hexString.replace('#', ''), 16) + ',' +
                // parseInt(colorPicker.colors[2].hexString.replace('#', ''), 16) + ']';
                parseInt(this.colorService.getFirstColorString.replace('#', ''), 16) + ',' +
                parseInt(this.colorService.getSecondColorString.replace('#', ''), 16) + ',' +
                parseInt(this.colorService.getThirdColorString.replace('#', ''), 16) + ']';
            json += '}';
        });
        json += ']}';

        this.serialService.setSegment(JSON.stringify(json));
    }

    onPause(): void {

    }

    onResume(): void {

    }

    onStart(): void {

    }

    onStop(): void {

    }

    private loadModes(): void {
        this.modes = JSON.parse('[{"modeName":"Static","modeNumber":0},{"modeName":"Blink","modeNumber":1},{"modeName":"Breath","modeNumber":2},{"modeName":"Color Wipe","modeNumber":3},{"modeName":"Color Wipe Inverse","modeNumber":4},{"modeName":"Color Wipe Reverse","modeNumber":5},{"modeName":"Color Wipe Reverse Inverse","modeNumber":6},{"modeName":"Color Wipe Random","modeNumber":7},{"modeName":"Random Color","modeNumber":8},{"modeName":"Single Dynamic","modeNumber":9},{"modeName":"Multi Dynamic","modeNumber":10},{"modeName":"Rainbow","modeNumber":11},{"modeName":"Rainbow Cycle","modeNumber":12},{"modeName":"Scan","modeNumber":13},{"modeName":"Dual Scan","modeNumber":14},{"modeName":"Fade","modeNumber":15},{"modeName":"Theater Chase","modeNumber":16},{"modeName":"Theater Chase Rainbow","modeNumber":17},{"modeName":"Running Lights","modeNumber":18},{"modeName":"Running Lights","modeNumber":18},{"modeName":"Running Lights","modeNumber":18},{"modeName":"Running Lights","modeNumber":18},{"modeName":"Twinkle Fade Random","modeNumber":22},{"modeName":"Sparkle","modeNumber":23},{"modeName":"Flash Sparkle","modeNumber":24},{"modeName":"Hyper Sparkle","modeNumber":25},{"modeName":"Strobe","modeNumber":26},{"modeName":"Strobe Rainbow","modeNumber":27},{"modeName":"Multi Strobe","modeNumber":28},{"modeName":"Blink Rainbow","modeNumber":29},{"modeName":"Chase White","modeNumber":30},{"modeName":"Chase Color","modeNumber":31},{"modeName":"Chase Random","modeNumber":32},{"modeName":"Chase Rainbow","modeNumber":33},{"modeName":"Chase Flash","modeNumber":34},{"modeName":"Chase Flash Random","modeNumber":35},{"modeName":"Chase Rainbow White","modeNumber":36},{"modeName":"Chase Blackout","modeNumber":37},{"modeName":"Chase Blackout Rainbow","modeNumber":38},{"modeName":"Color Sweep Random","modeNumber":39},{"modeName":"Running Color","modeNumber":40},{"modeName":"Running Red Blue","modeNumber":41},{"modeName":"Running Random","modeNumber":42},{"modeName":"Larson Scanner","modeNumber":43},{"modeName":"Comet","modeNumber":44},{"modeName":"Fireworks","modeNumber":45},{"modeName":"Fireworks Random","modeNumber":46},{"modeName":"Merry Christmas","modeNumber":47},{"modeName":"Fire Flicker","modeNumber":48},{"modeName":"Fire Flicker (soft)","modeNumber":49},{"modeName":"Fire Flicker (intense)","modeNumber":50},{"modeName":"Circus Combustus","modeNumber":51},{"modeName":"Halloween","modeNumber":52},{"modeName":"Bicolor Chase","modeNumber":53},{"modeName":"Tricolor Chase","modeNumber":54},{"modeName":"VuMeter","modeNumber":55},{"modeName":"Custom 1","modeNumber":56},{"modeName":"Custom 2","modeNumber":57},{"modeName":"Custom 3","modeNumber":58},{"modeName":"Custom 4","modeNumber":59},{"modeName":"Custom 5","modeNumber":60},{"modeName":"Custom 6","modeNumber":61}]');
    }

    private updateWidgets(): void {
        // update the UI widgets with the current segment's data
        if (this.segments.length > 0) {
            this.changeRangeSlider(this.segments[this.segmentIndex].start, this.segments[this.segmentIndex].stop);
            this.changeSpeedSlider(this.segments[this.segmentIndex].speed);

            $('#modes').val((this.segments)[this.segmentIndex].mode);
            $('#fade').val(((this.segments)[this.segmentIndex].options & 0x70) >> 4);
            $('#size').val(((this.segments)[this.segmentIndex].options & 0x06) >> 1);

            $('#reverse').prop('checked', Boolean((this.segments)[this.segmentIndex].options & 0x80));
            $('#gamma').prop('checked', Boolean((this.segments)[this.segmentIndex].options & 0x08));

            // todo change into changing value of colorpicker
            // $('#color0').val(segments[segmentIndex].colors[0]);
            // $('#color1').val(segments[segmentIndex].colors[1]);
            // $('#color2').val(segments[segmentIndex].colors[2]);
        }
    }

    private changeRangeSlider(min: number, max: number): void {
        this.rangeSlider = [min, max];
    }

    private changeSpeedSlider(value: number): void {
        this.speedSlider = value;
    }
}
