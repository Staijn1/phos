import {ModeComponent} from './mode.component';
import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';
import {SerialConnectionService} from '../../services/serial/serial-connection.service';

describe('ModeComponent', () => {
    let component: ModeComponent;
    let fixture: ComponentFixture<ModeComponent>;
    let serialConnectionServiceStub: Partial<SerialConnectionService>;
    let h1: HTMLElement;

    beforeEach(() => {
        serialConnectionServiceStub = {};
        TestBed.configureTestingModule({
            declarations: [ModeComponent],
            providers: [{provide: ComponentFixtureAutoDetect, useValue: true},
                {provide: SerialConnectionService, useValue: serialConnectionServiceStub}]
        });
        fixture = TestBed.createComponent(ModeComponent);
        component = fixture.componentInstance;

        const serialConnectionService = TestBed.inject(SerialConnectionService);

        h1 = fixture.nativeElement.querySelector('#hero');
    });

    it('should display original title', () => {
        expect(h1).toBeTruthy();
    });
});
