import {TestBed} from '@angular/core/testing';

import {ColorService} from './color.service';

describe('ColorServiceService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ColorService = TestBed.get(ColorService);
        expect(service).toBeTruthy();
    });
});
