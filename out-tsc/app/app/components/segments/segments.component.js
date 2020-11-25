"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SegmentsComponent = void 0;
var core_1 = require("@angular/core");
var $ = require("jquery");
var serial_connection_service_1 = require("../../services/serial/serial-connection.service");
var color_service_1 = require("../../services/color/color.service");
var SegmentsComponent = /** @class */ (function () {
    function SegmentsComponent(serialService, colorService) {
        this.serialService = serialService;
        this.colorService = colorService;
        this.segments = [
            { start: 0, stop: 9, mode: 0, speed: 1000, options: 0, colors: [16711680, 65280, 255] }
        ];
        this.segmentIndex = 0;
        this.numPixels = 30;
        this.rangeSlider = [this.segments[this.segmentIndex].start, this.segments[this.segmentIndex].stop];
        this.rangeSliderConfig = {
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
        this.speedSlider = 1000;
        this.speedSliderConfig = {
            start: this.speedSlider,
            connect: [true, false],
            step: 10,
            range: {
                'min': [20, 1],
                '25%': [100, 10],
                '50%': [1000, 100],
                '75%': [10000, 500],
                'max': [30000]
            },
            format: {
                to: function (value) {
                    return value.toFixed(0);
                },
                from: function (value) {
                    return parseInt(value, 10);
                }
            }
        };
        this.loadModes();
    }
    SegmentsComponent.prototype.ngOnInit = function () {
    };
    SegmentsComponent.prototype.loadModes = function () {
        this.modes = JSON.parse('[{"modeName":"Static","modeNumber":0},{"modeName":"Blink","modeNumber":1},{"modeName":"Breath","modeNumber":2},{"modeName":"Color Wipe","modeNumber":3},{"modeName":"Color Wipe Inverse","modeNumber":4},{"modeName":"Color Wipe Reverse","modeNumber":5},{"modeName":"Color Wipe Reverse Inverse","modeNumber":6},{"modeName":"Color Wipe Random","modeNumber":7},{"modeName":"Random Color","modeNumber":8},{"modeName":"Single Dynamic","modeNumber":9},{"modeName":"Multi Dynamic","modeNumber":10},{"modeName":"Rainbow","modeNumber":11},{"modeName":"Rainbow Cycle","modeNumber":12},{"modeName":"Scan","modeNumber":13},{"modeName":"Dual Scan","modeNumber":14},{"modeName":"Fade","modeNumber":15},{"modeName":"Theater Chase","modeNumber":16},{"modeName":"Theater Chase Rainbow","modeNumber":17},{"modeName":"Running Lights","modeNumber":18},{"modeName":"Running Lights","modeNumber":18},{"modeName":"Running Lights","modeNumber":18},{"modeName":"Running Lights","modeNumber":18},{"modeName":"Twinkle Fade Random","modeNumber":22},{"modeName":"Sparkle","modeNumber":23},{"modeName":"Flash Sparkle","modeNumber":24},{"modeName":"Hyper Sparkle","modeNumber":25},{"modeName":"Strobe","modeNumber":26},{"modeName":"Strobe Rainbow","modeNumber":27},{"modeName":"Multi Strobe","modeNumber":28},{"modeName":"Blink Rainbow","modeNumber":29},{"modeName":"Chase White","modeNumber":30},{"modeName":"Chase Color","modeNumber":31},{"modeName":"Chase Random","modeNumber":32},{"modeName":"Chase Rainbow","modeNumber":33},{"modeName":"Chase Flash","modeNumber":34},{"modeName":"Chase Flash Random","modeNumber":35},{"modeName":"Chase Rainbow White","modeNumber":36},{"modeName":"Chase Blackout","modeNumber":37},{"modeName":"Chase Blackout Rainbow","modeNumber":38},{"modeName":"Color Sweep Random","modeNumber":39},{"modeName":"Running Color","modeNumber":40},{"modeName":"Running Red Blue","modeNumber":41},{"modeName":"Running Random","modeNumber":42},{"modeName":"Larson Scanner","modeNumber":43},{"modeName":"Comet","modeNumber":44},{"modeName":"Fireworks","modeNumber":45},{"modeName":"Fireworks Random","modeNumber":46},{"modeName":"Merry Christmas","modeNumber":47},{"modeName":"Fire Flicker","modeNumber":48},{"modeName":"Fire Flicker (soft)","modeNumber":49},{"modeName":"Fire Flicker (intense)","modeNumber":50},{"modeName":"Circus Combustus","modeNumber":51},{"modeName":"Halloween","modeNumber":52},{"modeName":"Bicolor Chase","modeNumber":53},{"modeName":"Tricolor Chase","modeNumber":54},{"modeName":"VuMeter","modeNumber":55},{"modeName":"Custom 1","modeNumber":56},{"modeName":"Custom 2","modeNumber":57},{"modeName":"Custom 3","modeNumber":58},{"modeName":"Custom 4","modeNumber":59},{"modeName":"Custom 5","modeNumber":60},{"modeName":"Custom 6","modeNumber":61}]');
    };
    SegmentsComponent.prototype.getModeName = function (indexToLookFor) {
        var e_1, _a;
        var name = '404 mode not found';
        try {
            for (var _b = __values(this.modes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var mode = _c.value;
                // tslint:disable-next-line:triple-equals
                if (mode.modeNumber == indexToLookFor) {
                    name = mode.modeName;
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return name;
    };
    SegmentsComponent.prototype.onAddSegment = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.segments.length > 9) {
            return;
        } // Max 10 segments
        // Calculate new segments starting led by adding one to the maximum stop led
        var start = 0;
        for (var i = 0; i < this.segments.length; i++) {
            if (this.segments[i].stop >= start) {
                start = this.segments[i].stop + 1;
            }
        }
        if (start > this.numPixels - 1) {
            start = this.numPixels - 1;
        }
        this.segments.push({
            start: start,
            stop: this.numPixels - 1,
            mode: $('#modes').val(),
            speed: 1000,
            options: 0,
            colors: [16711680, 65280, 255]
        });
        this.segmentIndex = this.segments.length - 1;
        this.updateWidgets();
    };
    SegmentsComponent.prototype.onDeleteSegment = function (event, index) {
        event.preventDefault();
        event.stopPropagation();
        this.segments.splice(index, 1);
        if (this.segmentIndex >= this.segments.length) {
            this.segmentIndex = this.segments.length - 1;
        }
        this.updateWidgets();
    };
    SegmentsComponent.prototype.onChangeSegment = function (event) {
        var element = $(event.currentTarget);
        element.addClass('active').siblings().removeClass('active');
        this.segmentIndex = element.index();
        this.updateWidgets();
    };
    SegmentsComponent.prototype.updateSegment = function () {
        (this.segments)[this.segmentIndex].start = this.rangeSlider[0];
        (this.segments)[this.segmentIndex].stop = this.rangeSlider[1];
        (this.segments)[this.segmentIndex].speed = this.speedSlider;
        (this.segments)[this.segmentIndex].mode = $('#modes').val();
        (this.segments)[this.segmentIndex].options = $('#reverse').prop('checked') ? 0x80 : 0;
        (this.segments)[this.segmentIndex].options |= $('#gamma').prop('checked') ? 0x08 : 0;
        (this.segments)[this.segmentIndex].options |= $('#fade').val() ? $('#fade').val() << 4 : 0;
        (this.segments)[this.segmentIndex].options |= $('#size').val() ? $('#size').val() << 1 : 0;
        // Todo This needs to be replaced with colorpicker values later on!!
        // (this.segments)[segmentIndex].colors[0] = this.colorService.pickerOne._color.//$('#color0').val();
        // (this.segments)[this.segmentIndex].colors[1] = //$('#color1').val();
        // (this.segments)[this.segmentIndex].colors[2] = //$('#color2').val();
        this.updateWidgets();
    };
    SegmentsComponent.prototype.updateWidgets = function () {
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
    };
    SegmentsComponent.prototype.changeRangeSlider = function (min, max) {
        this.rangeSlider = [min, max];
    };
    SegmentsComponent.prototype.changeSpeedSlider = function (value) {
        this.speedSlider = value;
    };
    SegmentsComponent.prototype.onSave = function () {
        // const json = `{"segments":[${JSON.stringify(this.segments)}]}`;
        var _this = this;
        // console.log(JSON.stringify(json))
        // this.serialService.setSegment(JSON.stringify(json));
        var json = '{';
        json += '"segments":[';
        $.each(this.segments, function (i, item) {
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
                parseInt(_this.colorService.getFirstColorString.replace('#', ''), 16) + ',' +
                parseInt(_this.colorService.getSecondColorString.replace('#', ''), 16) + ',' +
                parseInt(_this.colorService.getThirdColorString.replace('#', ''), 16) + ']';
            json += '}';
        });
        json += ']}';
        console.log(json);
        console.log(JSON.stringify(json));
        this.serialService.setSegment(JSON.stringify(json));
    };
    SegmentsComponent.prototype.onPause = function () {
    };
    SegmentsComponent.prototype.onResume = function () {
    };
    SegmentsComponent.prototype.onStart = function () {
    };
    SegmentsComponent.prototype.onStop = function () {
    };
    SegmentsComponent = __decorate([
        core_1.Component({
            selector: 'app-segments',
            templateUrl: './segments.component.html',
            styleUrls: ['./segments.component.scss']
        }),
        __metadata("design:paramtypes", [serial_connection_service_1.SerialConnectionService, color_service_1.ColorService])
    ], SegmentsComponent);
    return SegmentsComponent;
}());
exports.SegmentsComponent = SegmentsComponent;
//# sourceMappingURL=segments.component.js.map