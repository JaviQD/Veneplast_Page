export const environment = {
    production: true,
    RutaApi:{
        Host : 'http://181.48.208.212:9091/',
        Apis : {
            Consultas: {
                Base: 'api/Veneplast/consulta/',
                Endpoints:{
                    Test: 'Test',
                    Cliente: 'PedidosClientes',
                    Empleado: 'PedidosEmpleados',
                    Supervisor: 'PedidosSupervisor'
                },
                Api: {
                    Test: '',
                    Cliente: '',
                    Empleado: '',
                    Supervisor: ''
                }
            },
            Auth:{
                Base: 'api/Veneplast/auth/',
                Endpoints:{
                    Login: 'Login',
                    RegistroCliente: 'Registrar-cliente',
                    RegistroEmpleado: 'Registrar-empleado',
                    Editar: 'Editar',
                    Eliminar: 'Eliminar',
                    Usuarios: 'Usuarios'
                },
                Api: {
                    Login: '',
                    RegistroCliente: '',
                    RegistroEmpleado: '',
                    Editar: '',
                    Eliminar: '',
                    Usuarios: ''
                }
            },
            Pdf: {
                Base: 'api/Veneplast/consulta/',
                Endpoints: 'DescargarPDF',
                Api: ''
            }
        }
    } 
};

//#region Consultas

//Test
environment.RutaApi.Apis.Consultas.Api.Test = `${environment.RutaApi.Host}${environment.RutaApi.Apis.Consultas.Base}${environment.RutaApi.Apis.Consultas.Endpoints.Test}`;

//Cliente
environment.RutaApi.Apis.Consultas.Api.Cliente = `${environment.RutaApi.Host}${environment.RutaApi.Apis.Consultas.Base}${environment.RutaApi.Apis.Consultas.Endpoints.Cliente}`;

//Empleado
environment.RutaApi.Apis.Consultas.Api.Empleado = `${environment.RutaApi.Host}${environment.RutaApi.Apis.Consultas.Base}${environment.RutaApi.Apis.Consultas.Endpoints.Empleado}`;

//Supervisor
environment.RutaApi.Apis.Consultas.Api.Supervisor = `${environment.RutaApi.Host}${environment.RutaApi.Apis.Consultas.Base}${environment.RutaApi.Apis.Consultas.Endpoints.Supervisor}`;

//#endregion

//#region Auth

//Login
environment.RutaApi.Apis.Auth.Api.Login = `${environment.RutaApi.Host}${environment.RutaApi.Apis.Auth.Base}${environment.RutaApi.Apis.Auth.Endpoints.Login}`;

//Registro Cliente
environment.RutaApi.Apis.Auth.Api.RegistroCliente = `${environment.RutaApi.Host}${environment.RutaApi.Apis.Auth.Base}${environment.RutaApi.Apis.Auth.Endpoints.RegistroCliente}`;

//Registro Empleado
environment.RutaApi.Apis.Auth.Api.RegistroEmpleado = `${environment.RutaApi.Host}${environment.RutaApi.Apis.Auth.Base}${environment.RutaApi.Apis.Auth.Endpoints.RegistroEmpleado}`;

//Editar
environment.RutaApi.Apis.Auth.Api.Editar = `${environment.RutaApi.Host}${environment.RutaApi.Apis.Auth.Base}${environment.RutaApi.Apis.Auth.Endpoints.Editar}`;

//Eliminar
environment.RutaApi.Apis.Auth.Api.Eliminar = `${environment.RutaApi.Host}${environment.RutaApi.Apis.Auth.Base}${environment.RutaApi.Apis.Auth.Endpoints.Eliminar}`;

//Usuarios
environment.RutaApi.Apis.Auth.Api.Usuarios = `${environment.RutaApi.Host}${environment.RutaApi.Apis.Auth.Base}${environment.RutaApi.Apis.Auth.Endpoints.Usuarios}`;

//#endregion

//#region Pdf

environment.RutaApi.Apis.Pdf.Api = `${environment.RutaApi.Host}${environment.RutaApi.Apis.Pdf.Base}${environment.RutaApi.Apis.Pdf.Endpoints}`;

//#endregion