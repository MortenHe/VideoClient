import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentplayedplaylistinspectorComponent } from './currentplayedplaylistinspector.component';

describe('CurrentplayedplaylistinspectorComponent', () => {
  let component: CurrentplayedplaylistinspectorComponent;
  let fixture: ComponentFixture<CurrentplayedplaylistinspectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentplayedplaylistinspectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentplayedplaylistinspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
