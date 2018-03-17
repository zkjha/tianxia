import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SscHeaderComponent } from './ssc-header.component';

describe('SscHeaderComponent', () => {
  let component: SscHeaderComponent;
  let fixture: ComponentFixture<SscHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SscHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SscHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
