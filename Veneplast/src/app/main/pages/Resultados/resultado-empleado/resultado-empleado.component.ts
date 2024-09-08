import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-resultado-empleado',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './resultado-empleado.component.html',
  styleUrl: './resultado-empleado.component.css'
})
export class ResultadoEmpleadoComponent implements OnInit {

  pedidos: any[] = [];
  Api_pdf = environment.RutaApi.Apis.Pdf.Api;
  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const pedidosData = localStorage.getItem('pedidosData');
      if (pedidosData) {
        this.pedidos = JSON.parse(pedidosData);      
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "La información de pedidos no se encuentra disponible. Por favor, intente nuevamente."
      });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "localStorage no está disponible"
      });
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
    this.router.navigateByUrl('/main/consulta-empleado');
  }

  DescargarPdf(pedido: any) {
    this.ObtenerPDFBase64(pedido.nombre).then(Pdf => {
      this.DescargarArchivo(Pdf, `pedido_${pedido.nombre}.pdf`, 'application/pdf');
    }).catch(error => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo descargar el PDF. Por favor, intente nuevamente."
      });
    });
  }

  ObtenerPDFBase64(pedido: string): Promise<string>{
    return this.http.get(this.Api_pdf,{
      responseType: 'text' 
    }).toPromise().then(PdfBase64 => {
      return PdfBase64 ?? '';
    });
  }

  DescargarArchivo(base64: string, nombreArchivo: string, tipoMime: string){
    const LinkSource = `data:${tipoMime};base64,${base64}`;
    const downloadLink = document.createElement("a");
    const fileName = nombreArchivo;

    downloadLink.href = LinkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

}
