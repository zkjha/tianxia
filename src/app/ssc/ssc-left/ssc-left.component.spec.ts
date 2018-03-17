import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SscLeftComponent } from './ssc-left.component';

describe('SscLeftComponent', () => {
  let component: SscLeftComponent;
  let fixture: ComponentFixture<SscLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SscLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SscLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
