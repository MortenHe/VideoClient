import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebuginspectorComponent } from './debuginspector.component';

describe('DebuginspectorComponent', () => {
  let component: DebuginspectorComponent;
  let fixture: ComponentFixture<DebuginspectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebuginspectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebuginspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
