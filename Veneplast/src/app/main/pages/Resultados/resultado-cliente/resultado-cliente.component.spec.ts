import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoClienteComponent } from './resultado-cliente.component';

describe('ResultadoClienteComponent', () => {
  let component: ResultadoClienteComponent;
  let fixture: ComponentFixture<ResultadoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultadoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
