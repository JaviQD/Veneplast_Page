import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-consulta-empleado',
  standalone: true,
  imports: [
    RouterModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: NativeDateAdapter }
  ],
  templateUrl: './consulta-empleado.component.html',
  styleUrl: './consulta-empleado.component.css'
})
export class ConsultaEmpleadoComponent{

  form: FormGroup;
  minFechaFinal: Date | null = null;
  maxFechaFinal: Date | null = null;
  identificador: string = localStorage.getItem('vendedor') || '';
  Cargando: boolean = false;

  private Empleado_api = environment.RutaApi.Apis.Consultas.Api.Empleado;

  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);

  constructor() {
    this.form = this.fb.group({
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required]
    });
  }

  onDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    const dateValue = event.value ? event.value : null;
    if (type === 'initial') {
      this.form.get('fechaInicial')?.setValue(dateValue);
      this.form.get('fechaFinal')?.setValue(''); // Limpia la fecha final
      this.updateDateRange();
    } else if (type === 'final') {
      this.form.get('fechaFinal')?.setValue(dateValue);
    }
  }

  ObtenerEstados() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Mensajes('obligatorio');
      return;
    }

    this.Cargando = true;

    const { fechaInicial, fechaFinal, nombre, apellido } = this.form.value;
    const body = {
      fechaInicial : fechaInicial,
      Fechafinal: fechaFinal,
      Nombre: nombre,
      Apellido: apellido,
      vendedor: this.identificador
    };

    this.http.post(this.Empleado_api, body, {headers: {'accept': '*/*'}})
    .subscribe(
      (data: any) => { 

        this.Cargando = false;

        if(data.statusCode === 200) {
          localStorage.setItem('pedidosData', JSON.stringify(data.pedidos));      
          this.router.navigateByUrl('/main/resultado-empleado');
        }
        else{Mensajes('error', data); }
      },
      (error) =>{
        this.Cargando = false;
        if (error.status === 404) {
          Mensajes('notfound', nombre, apellido);
        }else{
          Mensajes('default', error);
        }     
      }
    );
  }

  LimpiarTodo() {
    this.form.reset();
  }


  CambiarColorLectura(){

  }

  updateDateRange() {
    if (this.form.get('fechaInicial')?.value) {
      const fechaInicialDate = new Date(this.form.get('fechaInicial')?.value);
      const fechaMax = new Date(fechaInicialDate);
      fechaMax.setDate(fechaInicialDate.getDate() + 15);

      this.minFechaFinal = fechaInicialDate;
      this.maxFechaFinal = fechaMax;
    } else {
      this.minFechaFinal = null;
      this.maxFechaFinal = null;
    }
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }
    const fechaInicialDate = this.form.get('fechaInicial')?.value ? new Date(this.form.get('fechaInicial')?.value) : null;
    const minFechaFinal = fechaInicialDate ? new Date(fechaInicialDate) : null;
    const maxFechaFinal = fechaInicialDate ? new Date(fechaInicialDate) : null;
    if (minFechaFinal && maxFechaFinal) {
      maxFechaFinal.setDate(minFechaFinal.getDate() + 15);
      return date >= minFechaFinal && date <= maxFechaFinal;
    }
    return true;
  }

  formatDate(dateString: string): string {
    // Crea un objeto Date a partir de la cadena de fecha
    const date = new Date(dateString);

    // Formatea la fecha en el formato YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses son 0-indexados
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  CerrarSesion(): void {
    localStorage.clear();
    this.router.navigateByUrl('/main/home'); 
  }
}


function Mensajes(orden:string, nombre = '', apellido = '', data:any = {}, error:any = {}){
  switch(orden){
    case 'error':
      Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ha ocurrido un error inesperado. Por favor, intente nuevamente.\n" + data.message
      });
      break;
    case 'notfound': 
      Swal.fire({
          icon: "info",
          title: "Sin informacion",
          text: "No se encontraron resultados para el rango de fechas ingresados y el Cliente: " + nombre + " " + apellido
      });
      break;
    case 'obligatorio':
      Swal.fire({
          icon: "error",
          title: "Error de validación",
          text: "Todos los campos son obligatorios.",
      });
      break;
    case 'espere':
      Swal.fire("Buscando resultados...",);
      break;
    case 'default' :
      Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ha ocurrido un error inesperado. Por favor, intente nuevamente.\n" + error.message

      });
  }

}
