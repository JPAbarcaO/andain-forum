import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPost } from 'src/app/models/post.model';
import { IComment } from 'src/app/models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private apiUrl = 'http://localhost:3000/api'; // Cambia esto si es necesario

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getPosts(): Observable<IPost[]> {
    return this.http.get<IPost[]>(`${this.apiUrl}/posts`, {
      headers: this.getAuthHeaders(),
      withCredentials: true, // Asegurar que el navegador envíe el token correctamente
    });
  }


  createPost(
    title: string,
    content: string,
    author_id: number
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/posts`,
      { title, content, author_id },
      {
        headers: this.getAuthHeaders(),
        withCredentials: true, // Importante para enviar el token correctamente
      }
    );
  }

  /**
   * Actualiza un post existente (título y contenido)
   */
  updatePost(
    postId: number,
    title: string,
    content: string,
    userId: number
  ): Observable<IPost> {
    console.log('postId', postId); // ❌ Aquí debería ser el ID del post
    console.log('title', title);
    console.log('content', content);
    console.log('userId', userId);
    return this.http.put<IPost>(
      `${this.apiUrl}/posts/${postId}`, // ✅ Ahora usa el ID correctamente
      { title, content, userId },
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Elimina un post del foro
   */
  deletePost(postId: number, userId: number, role: string): Observable<any> {
    return this.http.request('DELETE', `${this.apiUrl}/posts/${postId}`, {
      body: { userId: userId, role: role }, // Enviar `user_id` y `role` en el cuerpo
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Obtiene todos los comentarios de la API
   */
  getComments(): Observable<IComment[]> {
    return this.http.get<IComment[]>(`${this.apiUrl}/comments`, {
      headers: this.getAuthHeaders(),
      withCredentials: true,
    });
  }

  /**
   * Crea un nuevo comentario en un post
   */
  createComment(
    content: string,
    post_id: number,
    author_id: number
  ): Observable<IComment> {
    return this.http.post<IComment>(
      `${this.apiUrl}/comments`,
      { content, post_id, author_id },
      {
        headers: this.getAuthHeaders(),
        withCredentials: true,
      }
    );
  }

  /**
   * Elimina un comentario de la API
   */
  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comments/${commentId}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true,
    });
  }
}
