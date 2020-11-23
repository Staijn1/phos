import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizerTestComponent } from './visualizer-test.component';

describe('VisualizerTestComponent', () => {
  let component: VisualizerTestComponent;
  let fixture: ComponentFixture<VisualizerTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizerTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
