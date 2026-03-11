import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeComponents } from './gauge.component';

describe('GaugeComponent', () => {
  let component: GaugeComponents;
  let fixture: ComponentFixture<GaugeComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GaugeComponents ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaugeComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
