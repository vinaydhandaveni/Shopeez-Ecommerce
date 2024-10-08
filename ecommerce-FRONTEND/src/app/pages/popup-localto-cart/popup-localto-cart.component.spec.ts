import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupLocaltoCartComponent } from './popup-localto-cart.component';

describe('PopupLocaltoCartComponent', () => {
  let component: PopupLocaltoCartComponent;
  let fixture: ComponentFixture<PopupLocaltoCartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupLocaltoCartComponent]
    });
    fixture = TestBed.createComponent(PopupLocaltoCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
