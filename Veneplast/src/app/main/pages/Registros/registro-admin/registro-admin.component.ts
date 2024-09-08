import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-admin',
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
  templateUrl: './registro-admin.component.html',
  styleUrl: './registro-admin.component.css'
})
export class RegistroAdminComponent {

  form: FormGroup;
  Cargando: boolean = false;

  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);

  private Registro_Endpoint = environment.RutaApi.Apis.Auth.Api.RegistroEmpleado;

  constructor() {
    this.form = this.fb.group({
      Rol: ['', Validators.required],
      TipoPersona: ['', Validators.required],    
      Nombre: ['', Validators.required],
      Identificacion: ['', [Validators.required, Validators.maxLength(10)]],
      Contraseña: ['', Validators.required],
      Contraseña2: ['', Validators.required]
    });
  }

  LimpiarTodo() {
    this.form.reset();
  }

  Retroceder(){
    this.router.navigateByUrl('/main/administrador-home');
  }

  RegistrarUsuario(){

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Mensajes('obligatorio');
      return;
    }

    const {Rol, Identificacion, Contraseña, Contraseña2 } = this.form.value;

    if(Contraseña != Contraseña2){
      Mensajes('clave');
      return;
    }

    const body = {
      Rol: Rol,
      Identificacion: Identificacion,
      Contraseña: Contraseña
    }

    this.Cargando = true;

    this.http.post(this.Registro_Endpoint, body, {headers: {'accept': '*/*'}})
    .subscribe(
      (data: any) => { 
        this.Cargando = false;
        if(data.success) {
          Mensajes('success', Identificacion, data);
          this.LimpiarTodo();
          this.Retroceder();
        }
        else{Mensajes('error', Identificacion, data); }
      },
      (error: any) =>{
        this.Cargando = false;
        let errorMessage = 'Error desconocido'; // Mensaje predeterminado

        if (error.error && error.error.mensaje) {
          errorMessage = error.error.mensaje;
        } else if (error.message) {
          errorMessage = error.message;
        }

        // Verifica si el mensaje es el que esperas
        if (errorMessage === 'Ya se encuentra registrado') {
          Mensajes('error', Identificacion, { mensaje: errorMessage });
        } else {
          Mensajes('default', Identificacion, { mensaje: errorMessage });
        }
      }
    );

  }

}

function Mensajes(orden: string, usuario = '', data: any = {}) {
  let mensaje = data.mensaje ? data.mensaje : "Información no disponible";
  
  switch (orden) {
    case 'error':
      Swal.fire({
        icon: "error",
        title: "Existente",
        text: `Ha ocurrido un error controlado.\nEl usuario con identificación: ${usuario}, ${mensaje}`
      });
      break;
    case 'success':
      Swal.fire({
        icon: "success",
        title: "Creado",
        text: mensaje
      });
      break;
    case 'obligatorio':
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: "Todos los campos son obligatorios.",
      });
      break;
    case 'clave':
      Swal.fire({
        icon: "error",
        title: "Verificar",
        text: "Las contraseñas no coinciden",
      });
      break;
    case 'default':
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Ha ocurrido un error inesperado.\nPor favor intente nuevamente.\n${mensaje}`
      });
      break;
  }
}
