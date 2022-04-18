import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMessagePopupComponent } from './info-message-popup.component';

describe('InfoMessagePopupComponent', () => {
  let component: InfoMessagePopupComponent;
  let fixture: ComponentFixture<InfoMessagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoMessagePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoMessagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
