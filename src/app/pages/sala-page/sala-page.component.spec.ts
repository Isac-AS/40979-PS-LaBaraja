import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaPageComponent } from './sala-page.component';

describe('SalaPageComponent', () => {
  let component: SalaPageComponent;
  let fixture: ComponentFixture<SalaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
