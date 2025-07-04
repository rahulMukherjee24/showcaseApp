import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureHighlightComponent } from './feature-highlight.component';

describe('FeatureHighlightComponent', () => {
  let component: FeatureHighlightComponent;
  let fixture: ComponentFixture<FeatureHighlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureHighlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
