import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import * as jwt_decode from 'jwt-decode';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const mockToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NDAxMjM0NTYsImV4cCI6MTY0MDEyNzA1Nn0.XYZ123';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    sessionStorage.clear();
    httpMock.verify();
  });

  /** ✅ 1. Test: Debería crearse el servicio correctamente */
  it('debería crearse AuthService', () => {
    expect(service).toBeTruthy();
  });

  /** ✅ 2. Test: Login debe enviar una petición POST */
  it('debería realizar un login y obtener un token', () => {
    const mockResponse = { token: mockToken };

    service.login('test@example.com', 'password123').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'test@example.com',
      password: 'password123',
    });

    req.flush(mockResponse);
  });

  /** ✅ 3. Test: Guardar token en sessionStorage */
  it('debería guardar el token en sessionStorage', () => {
    service.setToken(mockToken);
    expect(sessionStorage.getItem('jwt_token')).toBe(mockToken);
  });

  /** ✅ 4. Test: Obtener token desde sessionStorage */
  it('debería obtener el token desde sessionStorage', () => {
    sessionStorage.setItem('jwt_token', mockToken);
    expect(service.getToken()).toBe(mockToken);
  });

  /** ✅ 5. Test: Obtener userId desde el token */
  it('debería obtener userId del token decodificado', () => {
    sessionStorage.setItem('jwt_token', mockToken);
    const userId = service.getUserId();
    expect(userId).toBe(10);
  });

  /** ✅ 6. Test: Devolver null si no hay token */
  it('debería retornar null si no hay token', () => {
    sessionStorage.removeItem('jwt_token');
    expect(service.getUserId()).toBeNull();
  });

  /** ✅ 7. Test: Verificar si el usuario está autenticado */
  it('debería verificar si el usuario está autenticado', () => {
    sessionStorage.setItem('jwt_token', mockToken);
    expect(service.isAuthenticated()).toBeTrue();

    sessionStorage.removeItem('jwt_token');
    expect(service.isAuthenticated()).toBeFalse();
  });

  /** ✅ 8. Test: Logout debe eliminar el token */
  it('debería eliminar el token en el logout', () => {
    sessionStorage.setItem('jwt_token', mockToken);
    service.logout();
    expect(sessionStorage.getItem('jwt_token')).toBeNull();
  });
});
