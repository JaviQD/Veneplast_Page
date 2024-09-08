import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaSupervisorComponent } from './consulta-supervisor.component';

describe('ConsultaSupervisorComponent', () => {
  let component: ConsultaSupervisorComponent;
  let fixture: ComponentFixture<ConsultaSupervisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaSupervisorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultaSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
