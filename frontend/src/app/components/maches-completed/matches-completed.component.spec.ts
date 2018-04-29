import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesCompletedComponent } from './matches-completed.component';

describe('MatchesCompletedComponent', () => {
  let component: MatchesCompletedComponent;
  let fixture: ComponentFixture<MatchesCompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchesCompletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchesCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
