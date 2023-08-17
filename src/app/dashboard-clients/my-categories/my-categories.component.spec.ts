import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCategoriesComponent } from './my-categories.component';

describe('MyCategoriesComponent', () => {
  let component: MyCategoriesComponent;
  let fixture: ComponentFixture<MyCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCategoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
