import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YouhuiComponent } from './youhui.component';

describe('YouhuiComponent', () => {
  let component: YouhuiComponent;
  let fixture: ComponentFixture<YouhuiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YouhuiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YouhuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
