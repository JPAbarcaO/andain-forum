// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode'; // Asegúrate de tener instalado jwt-decode

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(
      'http://localhost:3000/api/auth/login',
      { email, password }
    );
  }

  // Guarda el token en sessionStorage
  setToken(token: string) {
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  // Método para obtener el userId decodificando el token
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const decoded: any = (jwt_decode as any)(token);
      return decoded.userId;
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    // Verifica si existe el token en sessionStorage
    return !!this.getToken();
  }

  // Método para deslogearse: elimina el token almacenado
  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }
}
