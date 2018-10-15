import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultlistinspectorComponent } from './resultlistinspector.component';

describe('ResultlistinspectorComponent', () => {
  let component: ResultlistinspectorComponent;
  let fixture: ComponentFixture<ResultlistinspectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultlistinspectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultlistinspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
