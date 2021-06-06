import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradientEditorPageComponent } from './gradient-editor-page.component';

describe('GradientEditorPageComponent', () => {
  let component: GradientEditorPageComponent;
  let fixture: ComponentFixture<GradientEditorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradientEditorPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradientEditorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
