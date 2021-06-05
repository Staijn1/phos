import {TestBed} from '@angular/core/testing';

import {WebsocketService} from './websocket.service';
import {iroColorObject} from '../../shared/types/types';

describe('WebsocketService', () => {
    let service: WebsocketService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WebsocketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have a filled array of URLs', () => {
        expect(service.websocketUrl).toBeTruthy();
    });

    it('should call send', () => {
        // @ts-ignore
        spyOn(service, 'send').and.callFake(() => {
        });
        const color: iroColorObject = {
            alpha: 0,
            blue: 0,
            green: 0,
            hex8String: '',
            hexString: '#FF00FF',
            hsl: undefined,
            hslString: '',
            hsla: undefined,
            hslaString: '',
            hsv: undefined,
            hsva: undefined,
            hue: 0,
            kelvin: 0,
            red: 0,
            rgb: undefined,
            rgbString: '',
            rgba: undefined,
            rgbaString: '',
            saturation: 0,
            value: 0
        };
        const colors: iroColorObject[] = [color, color, color];
        service.setColor(colors);
        expect(service.send).toHaveBeenCalledOnceWith('c FF00FF,FF00FF,FF00FF');
    });
});
