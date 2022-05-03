import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerTurnCardsComponent } from './player-turn-cards.component';

describe('PlayerTurnCardsComponent', () => {
  let component: PlayerTurnCardsComponent;
  let fixture: ComponentFixture<PlayerTurnCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerTurnCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerTurnCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
