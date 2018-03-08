import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaipiaoComponent } from './caipiao.component';

describe('CaipiaoComponent', () => {
  let component: CaipiaoComponent;
  let fixture: ComponentFixture<CaipiaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaipiaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaipiaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
