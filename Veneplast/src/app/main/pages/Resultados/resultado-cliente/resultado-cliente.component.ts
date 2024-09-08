import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { error } from 'console';

@Component({
  selector: 'app-resultado-cliente',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './resultado-cliente.component.html',
  styleUrl: './resultado-cliente.component.css'
})
export class ResultadoClienteComponent implements OnInit {

  pedidos: any[] = [];
  Api_pdf = environment.RutaApi.Apis.Pdf.Api;
  Cargando: boolean = false;
  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const pedidosData = localStorage.getItem('pedidosData');
      if (pedidosData) {
        this.pedidos = JSON.parse(pedidosData);        
      } else {
        Mensajes('no-disponible');
      }
    } else {
      Mensajes('');
    }
  }

  ObtenerPedidos(estados: { [key: string]: boolean }) {
    return Object.keys(estados).map(key => ({
      nombre: key.charAt(0).toUpperCase() + key.slice(1),
      activo: estados[key]
    }));
  }

  Retroceder(){
    localStorage.removeItem('pedidosData');
    this.router.navigateByUrl('/main/consulta-cliente');
  }

  DescargarPdf(pedido: any) {
    const documentoPrueba = '50130FE38724';
    this.Cargando = true;
    const RutaPdf = `${this.Api_pdf}/${documentoPrueba}`
    this.http.get(RutaPdf, {responseType: 'blob'})
      .subscribe(
        (data: Blob) => {
          this.Cargando = false;
          Mensajes('prueba');
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${documentoPrueba}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url); 
        }, error => {
          this.Cargando = false;
          if(error.status === 404){
            return Mensajes('noexiste', pedido.nombre);
          }          
          Mensajes('error');
        }
      );
  }

  EsEntregadoActivo(pedido: any): boolean{
    const estados = this.ObtenerPedidos(pedido.estados);
    const entregado = estados.find(estado => estado.nombre === 'Entregado');
    return entregado ? entregado.activo : false;
  }

}

function Mensajes(order: string, pedido: string = '',data: any = {}) {
  switch(order){
    case 'error':
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo descargar el PDF. Por favor, intente nuevamente."
      });
      break;
    case 'no-disponible':
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La información de pedidos no se encuentra disponible. Por favor, intente nuevamente."
      });
    break;
    case 'noexiste':
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `El documento a descargar (${pedido}) no existe. consulte con el administrador para mas detalles`
      });
    break;
    case 'prueba':
      Swal.fire({
        icon: "info",
        title: "Prueba",
        text: `El documento que se descargará sera un documento de prueba, debido a que la ubicación de los documentos no se ha definido.`
      });
    break;
    default:
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Algo ocurrió que ha obstruido el proceso de los pedidos"
      });
      break;
  }
}
