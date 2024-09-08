import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { rolesGuard } from '../roles.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then( c => c.LayoutComponent),
    children: [
        {
            path: 'home',
            loadComponent: () => import('./pages/Home/home.component').then( c => c.HomeComponent )
        },
        {
          path: 'registro-cliente',
          loadComponent: () => import('./pages/Registros/registro-cliente/registro-cliente.component').then( c => c.RegistroClienteComponent )
        },
        {
          path: 'consulta-cliente',
          loadComponent: () => import('./pages/Consultas/consulta-cliente/consulta-cliente.component').then( c => c.ConsultaClienteComponent ),
          canActivate: [rolesGuard],
          data: {Role: 'Cliente'}
        },
        {
          path: 'resultado-cliente',
          loadComponent: () => import('./pages/Resultados/resultado-cliente/resultado-cliente.component').then( c => c.ResultadoClienteComponent ),
          canActivate: [rolesGuard],
          data: {Role: 'Cliente'}
        },
        {
          path: 'consulta-empleado',
          loadComponent: () => import('./pages/Consultas/consulta-empleado/consulta-empleado.component').then( c => c.ConsultaEmpleadoComponent ),
          canActivate: [rolesGuard],
          data: {Role: 'Empleado'}
        },
        {
          path:'resultado-empleado',
          loadComponent: () => import('./pages/Resultados/resultado-empleado/resultado-empleado.component').then( c => c.ResultadoEmpleadoComponent ),
          canActivate: [rolesGuard],
          data: {Role: 'Empleado'}
        },
        {
          path: 'consulta-supervisor',
          loadComponent: () => import('./pages/Consultas/consulta-supervisor/consulta-supervisor.component').then( c => c.ConsultaSupervisorComponent ),
          canActivate: [rolesGuard],
          data: {Role: 'Supervisor'}
        },
        {
          path:'resultado-supervisor',
          loadComponent: () => import('./pages/Resultados/resultado-supervisor/resultado-supervisor.component').then( c => c.ResultadoSupervisorComponent ),
          canActivate: [rolesGuard],
          data: {Role: 'Supervisor'}
        },
        {
          path: 'administrador-home',
          loadComponent: () => import('./pages/Administrador/admin-home/admin-home.component').then( c => c.AdminHomeComponent ),
          canActivate: [rolesGuard],
          data: {Role: 'Administrador'}
        },
        {
          path: 'registro-administrador',
          loadComponent: () => import('./pages/Registros/registro-admin/registro-admin.component').then( c => c.RegistroAdminComponent ),
          canActivate: [rolesGuard],
          data: {Role: 'Administrador'}
        },
        {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full'
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
