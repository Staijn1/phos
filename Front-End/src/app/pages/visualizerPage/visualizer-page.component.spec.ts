import {ComponentFixture, TestBed} from '@angular/core/testing'

import {VisualizerPageComponent} from './visualizer-page.component'

describe('VisualizerComponent', () => {
    let component: VisualizerPageComponent
    let fixture: ComponentFixture<VisualizerPageComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VisualizerPageComponent]
        })
            .compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(VisualizerPageComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    // it('should create', () => {
    //     expect(component).toBeTruthy();
    // });
})
