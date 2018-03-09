import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DianziComponent } from './dianzi.component';

describe('DianziComponent', () => {
  let component: DianziComponent;
  let fixture: ComponentFixture<DianziComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DianziComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DianziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
