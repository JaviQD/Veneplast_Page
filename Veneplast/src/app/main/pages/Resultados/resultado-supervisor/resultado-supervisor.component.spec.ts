import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoSupervisorComponent } from './resultado-supervisor.component';

describe('ResultadoSupervisorComponent', () => {
  let component: ResultadoSupervisorComponent;
  let fixture: ComponentFixture<ResultadoSupervisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoSupervisorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultadoSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
