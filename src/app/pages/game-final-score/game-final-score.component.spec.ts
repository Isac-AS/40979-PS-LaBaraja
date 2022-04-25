import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameFinalScoreComponent } from './game-final-score.component';

describe('GameFinalScoreComponent', () => {
  let component: GameFinalScoreComponent;
  let fixture: ComponentFixture<GameFinalScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameFinalScoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameFinalScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
