import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesOngoingComponent } from './matches-ongoing.component';

describe('MatchesOngoingComponent', () => {
  let component: MatchesOngoingComponent;
  let fixture: ComponentFixture<MatchesOngoingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchesOngoingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchesOngoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
