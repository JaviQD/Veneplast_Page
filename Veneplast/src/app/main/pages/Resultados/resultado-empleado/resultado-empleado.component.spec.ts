import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoEmpleadoComponent } from './resultado-empleado.component';

describe('ResultadoEmpleadoComponent', () => {
  let component: ResultadoEmpleadoComponent;
  let fixture: ComponentFixture<ResultadoEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoEmpleadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultadoEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
