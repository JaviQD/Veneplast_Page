import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaEmpleadoComponent } from './consulta-empleado.component';

describe('ConsultaEmpleadoComponent', () => {
  let component: ConsultaEmpleadoComponent;
  let fixture: ComponentFixture<ConsultaEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaEmpleadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultaEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
