import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZhenrenComponent } from './zhenren.component';

describe('ZhenrenComponent', () => {
  let component: ZhenrenComponent;
  let fixture: ComponentFixture<ZhenrenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZhenrenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZhenrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
