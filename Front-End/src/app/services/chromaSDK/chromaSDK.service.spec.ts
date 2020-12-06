import {TestBed} from '@angular/core/testing';

import {ChromaSDKService} from './chromaSDK.service';

describe('ChromaSDKService', () => {
    let service: ChromaSDKService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChromaSDKService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
