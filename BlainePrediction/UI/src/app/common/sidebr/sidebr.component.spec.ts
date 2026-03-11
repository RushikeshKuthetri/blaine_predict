import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebrComponent } from './sidebr.component';

describe('SidebrComponent', () => {
  let component: SidebrComponent;
  let fixture: ComponentFixture<SidebrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
