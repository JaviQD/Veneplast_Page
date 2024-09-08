import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatNativeDateModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: NativeDateAdapter },
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  form: FormGroup;
  minFechaFinal: Date | null = null;
  maxFechaFinal: Date | null = null;
  Cargando: boolean = false;

  private Login_api = environment.RutaApi.Apis.Auth.Api.Login;

  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);

  constructor() {
    this.form = this.fb.group({
      Identificacion: ['', Validators.required],
      Contraseña: ['', Validators.required],
    });
  }

  IniciarSesion() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Mensajes('obligatorio');
      return;
    }

    this.Cargando = true

    const { Identificacion, Contraseña } = this.form.value;

    const body = {
      Identificacion: Identificacion,
      Clave: Contraseña
    };
  
    this.http.post(this.Login_api, body, {headers: {'accept': '*/*'}})
    .subscribe(
      (data: any) => { 

        this.Cargando = false;

        if(data.success) {
          localStorage.setItem('accessToken', JSON.stringify(data.token)); 
          localStorage.setItem('vendedor', JSON.stringify(Identificacion)); 
          
          switch(data.rol){
            case 'Administrador':
              this.router.navigateByUrl('/main/administrador-home');
              break;
            case 'Supervisor':
              this.router.navigateByUrl('/main/consulta-supervisor');
              break;
            case 'Empleado':
              this.router.navigateByUrl('/main/consulta-empleado');
              break;
            case 'Cliente':
              this.router.navigateByUrl('/main/consulta-cliente');
              break;
            default:
              Mensajes('rolInvalido');
              break;
          }
        
        }
        else{Mensajes('error', data); }
      },
      (error) =>{
        this.Cargando = false;
        if (error.status === 404) {
          Mensajes('notfound',Identificacion);
        }else{
          Mensajes('default', error);
        }     
      }
    );
  }

  LimpiarTodo() {
    this.form.reset();
  }

  Registrar(){
    this.router.navigateByUrl('/main/registro-cliente');
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
