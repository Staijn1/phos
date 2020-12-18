import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModeComponent} from './mode.component';
import {SerialConnectionService} from '../../services/serial/serial-connection.service';

describe('ModeComponent', () => {
    let sut: ModeComponent;
    let fixture: ComponentFixture<ModeComponent>;
    let serialService: SerialConnectionService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModeComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModeComponent);
        sut = fixture.componentInstance;
        serialService = TestBed.inject(SerialConnectionService);
        fixture.detectChanges();
    });

    // it('should create', () => {
    //     expect(sut).toBeTruthy();
    // });
});
