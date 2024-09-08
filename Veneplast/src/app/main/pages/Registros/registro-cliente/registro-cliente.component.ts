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
  selector: 'app-registro-cliente',
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
  templateUrl: './registro-cliente.component.html',
  styleUrl: './registro-cliente.component.css'
})
export class RegistroClienteComponent {

  form: FormGroup;
  Apellido_soloLectura: boolean = false;
  Placeholder: string = 'Nombre';
  Cargando: boolean = false;

  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);

  private Registro_Endpoint = environment.RutaApi.Apis.Auth.Api.RegistroCliente;

  constructor() {
    this.form = this.fb.group({
      TipoPersona: ['', Validators.required],
      Rol: ['', Validators.required],
      Nombre: ['', Validators.required],
      Apellido: ['', Validators.required],
      Identificacion: ['', [Validators.required, Validators.maxLength(10)]],
      Telefono: ['', [Validators.required, Validators.maxLength(10)]],
      Correo: ['', [Validators.required, Validators.email]],
      Contraseña: ['', Validators.required],
      Contraseña2: ['', Validators.required]
    });
  }

  LimpiarTodo() {
    this.form.reset();
  }

  Retroceder(){
    this.router.navigateByUrl('');
  }

  TipoPersonaOnChange(tipopersona: string){
    if(tipopersona === 'Juridica'){
      this.form.get('Apellido')?.setValue('');
      this.form.get('Apellido')?.clearValidators(),
      this.form.get('Apellido')?.updateValueAndValidity(),
      this.Apellido_soloLectura = true;
      this.Placeholder = 'Razón social';
    }
    else{
      this.form.get('Apellido')?.setValidators(Validators.required),
      this.form.get('Apellido')?.updateValueAndValidity(),
      this.Apellido_soloLectura = false;
      this.Placeholder = 'Nombre';
    }
  }

  RegistrarUsuario(){

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Mensajes('obligatorio');
      return;
    }

    const {Rol, TipoPersona, Nombre, Identificacion, Telefono, Correo, Contraseña, Contraseña2 } = this.form.value;

    if(Contraseña != Contraseña2){
      Mensajes('clave');
      return;
    }

    const body = {
      Rol: Rol,
      TipoPersona: TipoPersona,
      Nombre: Nombre,
      Identificacion: Identificacion,
      Telefono: Telefono,
      Correo: Correo,
      Contraseña: Contraseña
    };

    this.Cargando = true;
  
    this.http.post(this.Registro_Endpoint, body, {headers: {'accept': '*/*'}})
    .subscribe(
      (data: any) => { 
        this.Cargando = false;
        if(data.success) {
          Mensajes('success', Identificacion, data);
          this.LimpiarTodo();
          this.router.navigateByUrl('');
        }
        else{Mensajes('error', Identificacion, data); }
      },
      (error: any) =>{
        this.Cargando = false;
        let errorMessage = 'Error desconocido';

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
