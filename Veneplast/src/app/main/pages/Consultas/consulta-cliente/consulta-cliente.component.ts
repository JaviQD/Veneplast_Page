import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-consulta-cliente',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './consulta-cliente.component.html',
  styleUrl: './consulta-cliente.component.css'
})
export class ConsultaClienteComponent {
  form: FormGroup;

  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);
  private fb: FormBuilder = inject(FormBuilder);

  private Cliente_api = environment.RutaApi.Apis.Consultas.Api.Cliente;
  Cargando: boolean = false;

  constructor() {
    this.form = this.fb.group({
      Nit: ['', Validators.required],
    });
  }

  CerrarSesion(): void {
    localStorage.clear();
    this.router.navigateByUrl('/main/home'); 
  }
  BuscarPedidos(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.Mensajes('obligatorio');
      return;
    }

    this.Cargando = true;

    const { Nit } = this.form.value;
    const body = {
      Nit: Nit.toString()
    };

    this.http.post(this.Cliente_api, body, {headers: {'accept': '*/*'}})
    .subscribe(
      (cliente: any) => { 

        this.Cargando = false;
        
        if(cliente.statusCode === 200) {
          localStorage.setItem('pedidosData', JSON.stringify(cliente.pedidos));
          this.router.navigateByUrl('/main/resultado-cliente');
        }
        else{this.Mensajes('error', cliente); }
      },
      (error) =>{
        this.Cargando = false;
        if (error.status === 404) {
          this.Mensajes('notfound', Nit);
        }else{
          this.Mensajes('default', error);
        }     
      }
    );
  }

  LimpiarTodo() {
    this.form.reset();
  }

  Mensajes(orden:string, Nit = '', data:any = {}, error:any = {}){
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
            text: "No se encontraron resultados para el Cliente: " + Nit
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

}
