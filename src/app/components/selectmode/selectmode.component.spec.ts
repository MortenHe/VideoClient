import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectvideomodeComponent } from './selectvideomode.component';

describe('SelectvideomodeComponent', () => {
  let component: SelectvideomodeComponent;
  let fixture: ComponentFixture<SelectvideomodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectvideomodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectvideomodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
