import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizerPage3DComponent } from './visualizer-page3-d.component';

describe('VisualizerPage3DComponent', () => {
  let component: VisualizerPage3DComponent;
  let fixture: ComponentFixture<VisualizerPage3DComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizerPage3DComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizerPage3DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
