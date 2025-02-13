import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ForumComponent } from './pages/forum/forum.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Redirige la ruta vacía a '/login'
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forum', component: ForumComponent, canActivate: [AuthGuard] },
  // Puedes agregar una ruta wildcard para páginas no encontradas, si lo deseas
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
