import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DojiComponent } from './doji.component';

describe('DojiComponent', () => {
  let component: DojiComponent;
  let fixture: ComponentFixture<DojiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DojiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DojiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
