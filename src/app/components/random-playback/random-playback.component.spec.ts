import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomPlaybackComponent } from './random-playback.component';

describe('RandomPlaybackComponent', () => {
  let component: RandomPlaybackComponent;
  let fixture: ComponentFixture<RandomPlaybackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomPlaybackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomPlaybackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
