import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardViewPageComponent } from './user-card-view-page.component';

describe('UserCardViewPageComponent', () => {
  let component: UserCardViewPageComponent;
  let fixture: ComponentFixture<UserCardViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCardViewPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCardViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
