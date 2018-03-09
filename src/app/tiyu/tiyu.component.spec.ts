import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiyuComponent } from './tiyu.component';

describe('TiyuComponent', () => {
  let component: TiyuComponent;
  let fixture: ComponentFixture<TiyuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiyuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiyuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
