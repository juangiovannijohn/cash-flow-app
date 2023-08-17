import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldBudgetsComponent } from './old-budgets.component';

describe('OldBudgetsComponent', () => {
  let component: OldBudgetsComponent;
  let fixture: ComponentFixture<OldBudgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldBudgetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldBudgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
