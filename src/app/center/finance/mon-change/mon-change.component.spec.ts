import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonChangeComponent } from './mon-change.component';

describe('MonChangeComponent', () => {
  let component: MonChangeComponent;
  let fixture: ComponentFixture<MonChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
