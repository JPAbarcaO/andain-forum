import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RegisterService } from 'src/app/services/register/register.service';
import { errorToast, successToast } from '../../validators/controlToast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  activeTabIndex: number = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private registerService: RegisterService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Método para iniciar sesión con JWT
  onLogin() {
    if (this.loginForm.valid) {
      this.authService
        .login(
          this.loginForm.get('email')?.value,
          this.loginForm.get('password')?.value
        )
        .subscribe({
          next: (response) => {
            // Almacena el token recibido
            this.authService.setToken(response.token);
            // Redirige al forum
            this.router.navigate(['/forum']);
            successToast('Inicio de sesión exitoso');
          },
          error: (error) => {
            console.error('Error en login:', error);
            errorToast('Credenciales incorrectas');
          },
        });
    } else {
      errorToast('Por favor, completa todos los campos correctamente');
    }
  }

  // Método para registrarse
  onRegister() {
    if (this.registerForm.valid) {
      this.registerService.register(this.registerForm.value).subscribe({
        next: () => {
          successToast('Usuario registrado correctamente');
          this.activeTabIndex = 0;
        },
        error: (error) => {
          console.error('Error en registro:', error);
          const errorMessage =
            error.error?.message || 'No se pudo registrar el usuario';
          errorToast(errorMessage);
        },
      });
    }
  }
}
