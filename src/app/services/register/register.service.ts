import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'http://localhost:3000/api/auth/register';

  constructor(private http: HttpClient) {}

  // 🔹 Método para registrar un usuario
  register(userData: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userData);
  }
}
