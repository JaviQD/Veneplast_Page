import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  ObtenerToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  EsTokenValido(token: string): boolean {
    const payload = this.DecodificarToken(token);
    if (!payload) {
      return false;
    }
    return !this.EsTokenExpirado(payload);
  }

  StringRole(token: string): string {
    const payload = this.DecodificarToken(token);

    return payload?.Role
  }


  private EsTokenExpirado(payload: any): boolean {
    const exp = payload.exp;
    if (!exp) {
      return true;
    }
    const expiryDate = new Date(exp * 1000);
    return expiryDate < new Date();
  }

  DecodificarToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  ObtenerClaims(token: string, claimKey: string): string {
    const decodedToken = this.DecodificarToken(token);
    return decodedToken ? decodedToken[claimKey] : null;
  }
}
