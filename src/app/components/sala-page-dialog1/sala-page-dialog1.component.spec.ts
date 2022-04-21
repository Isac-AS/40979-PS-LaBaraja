import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaPageDialog1Component } from './sala-page-dialog1.component';

describe('SalaPageDialog1Component', () => {
  let component: SalaPageDialog1Component;
  let fixture: ComponentFixture<SalaPageDialog1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaPageDialog1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaPageDialog1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
