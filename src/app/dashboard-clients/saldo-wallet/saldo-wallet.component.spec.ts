import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoWalletComponent } from './saldo-wallet.component';

describe('SaldoWalletComponent', () => {
  let component: SaldoWalletComponent;
  let fixture: ComponentFixture<SaldoWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaldoWalletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaldoWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
