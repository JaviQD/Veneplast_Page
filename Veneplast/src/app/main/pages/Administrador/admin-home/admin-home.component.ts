import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-home',
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
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit{

  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);

  ordenActual: string = 'fechaRegistro';
  ordenAscendente: boolean = true;
  MaximoUsuario_Pagina = 5;
  UrlUsuarios = environment.RutaApi.Apis.Auth.Api.Usuarios;
  UrlEliminar = environment.RutaApi.Apis.Auth.Api.Eliminar;
  Cargando: boolean = false;
  TodoSeleccionado = false;
  Empleados: Empleado[] = [];
  PaginaActual = 1;
  TamañoPagina = 5;

  ngOnInit(): void{
    this.Cargando = true;
    this.ObtenerUsuarios();
  }

   ObtenerUsuarios(): void{
    this.Cargando = true;
    this.http.get<any[]>(this.UrlUsuarios, {headers: {'accept': '*/*'}})
    .subscribe(
      (data) => {
        this.Cargando = false;
        this.Empleados = data.map(usuario => ({
          identificacion: usuario.identificacion,
          rol: usuario.rol,
          fechaCreacion: this.Formatearfecha(usuario.fechaRegistro),
          selected: false
        }));
      }, (error) => {
        this.Cargando = false;
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  Formatearfecha(fecha: string) : string{
    const meses = ["Enero", "Febrero", "Marzo", "Abril", 
                   "Mayo", "Junio", "Julio", "Agosto", 
                   "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const Fecha = new Date(fecha);
    const Dia = Fecha.getDate();
    const Mes = meses[Fecha.getMonth()];
    const Año = Fecha.getFullYear();
    let Horas = Fecha.getHours();
    const Minutos = Fecha.getMinutes().toString().padStart(2, '0');
    const AmPm = Horas > 12 ? 'PM' : 'AM';

    Horas = Horas % 12 || 12;

    return `${Dia} ${Mes} ${Año}, ${Horas}:${Minutos} ${AmPm}`;	
  }

  Registrar(): void{
    this.router.navigateByUrl('/main/registro-administrador');
  }

  RecargarLista(): void{
    this.ObtenerUsuarios();
  }

  OrdernarPor(columna: keyof Empleado): void{
    if(this.ordenActual === columna){
      this.ordenAscendente = !this.ordenAscendente;
    }else{
      this.ordenActual = columna;
      this.ordenAscendente = true;
    }

    this.Empleados.sort((a, b) =>{
      let ValorA = a[columna] as string | number;
      let ValorB = b[columna] as string | number;

      if(ValorA < ValorB) return this.ordenAscendente ? -1 : 1;
      if(ValorA > ValorB) return this.ordenAscendente ? 1 : -1;
      return 0;
    })

  }

  ListUsuarios() : Observable<any[]>{
    return this.http.get<any[]>(this.UrlUsuarios);
  }

  CerrarSesion() {
    localStorage.clear();
    this.router.navigateByUrl(''); 
  }

  ObtenerPaginado(): Empleado[]{
    const startIndex = (this.PaginaActual - 1) * this.MaximoUsuario_Pagina;
    const endIndex = startIndex + this.MaximoUsuario_Pagina;

    return this.Empleados.slice(startIndex, endIndex);
  }

  ObtenerTotalPaginas(): number{
    return Math.ceil(this.Empleados.length / this.TamañoPagina);
  }

  PaginaAnterior() : void {
    if (this.PaginaActual > 1) {
      this.PaginaActual--;
    }
  }

  SiguientePagina() : void {
    if (this.PaginaActual < this.ObtenerTotalPaginas()) {
      this.PaginaActual++;
    }
  }

  SeleccionarTodos(): void{
    this.TodoSeleccionado = !this.TodoSeleccionado;
    this.ObtenerPaginado().forEach(item => item.selected = this.TodoSeleccionado);
  }

  HaySeleccionado() : boolean {
    return this.ObtenerPaginado().some(item => item.selected);
  }

  EliminarSeleccionado() : void{

    const usuariosEliminar = this.ObtenerPaginado().filter(item => item.selected);

    usuariosEliminar.forEach(usuario => {
      this.EliminarUsuario(usuario.identificacion, usuario.rol);
    });

    this.Empleados = this.Empleados.filter(item =>!item.selected);
    if(this.PaginaActual > this.ObtenerTotalPaginas()){
      this.PaginaActual = this.ObtenerTotalPaginas();
    }
  }

  EliminarUsuario(identificacion: string, rol: string) : void{

    this.Cargando = true;

    const ApiEliminar = `${this.UrlEliminar}?identificacion=${encodeURIComponent(identificacion)}&rol=${encodeURIComponent(rol)}`;
    this.http.delete<{ success: boolean; mensaje: string }>(ApiEliminar,  {headers: {'accept': '*/*'}})
      .subscribe(
        (data) =>{

          this.Cargando = false;

          if(data.success){
            Mensajes('eliminado');
            this.Empleados = this.Empleados.filter(item => !(item.identificacion === identificacion && item.rol === rol));
            this.RecargarLista();
          }
          else{
            Mensajes('error', data);
          }             
      }, error => {
        this.Cargando = false;
        Mensajes('default', error);
        this.RecargarLista();
      })
  }

}

interface Empleado {
  identificacion: string;
  rol: string;
  fechaCreacion: string;
  selected?: boolean;  
}

function Mensajes(orden:string, data:any = {}, error:any = {}){
  switch(orden){
    case 'error':
      Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ha ocurrido un error inesperado. Por favor, intente nuevamente.\n" + data.message
      });
      break;
    case 'eliminado': 
      Swal.fire({
          icon: "success",
          title: "Registro eliminado",
          text: `Registro eliminado con exito`
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
          text: "Ha ocurrido un error inesperado. Por favor, intente nuevamente.\n" + error.mensaje

      });
  }

}