import { Component, Inject, OnInit } from '@angular/core';
import { IPost } from 'src/app/models/post.model';
import { IComment } from 'src/app/models/comment.model';
import Swal from 'sweetalert2';
import { ForumService } from 'src/app/services/forum/forum.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
})
export class ForumComponent implements OnInit {
  posts: IPost[] = [];
  comments: IComment[] = [];
  paginatedPosts: IPost[] = [];
  newPostTitle: string = '';
  newPostContent: string = '';
  newComment: string = '';
  isLoading = true;
  errorMessage = '';
  token: any = '';
  userId: number | null = null;
  userRole: string = '';

  // Variables para edición de posts
  editingPostId: number | null = null;
  editedTitle: string = '';
  editedContent: string = '';

  // 🔹 Variables de Paginación
  currentPage: number = 0;
  pageSize: number = 10; // Mostrar 10 posts por página
  totalPosts: number = 0;

  constructor(
    @Inject(ForumService) private forumService: ForumService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = sessionStorage.getItem('jwt_token');

    if (token) {
      this.token = this.obtenerValoresJwt(token);
      this.userId = this.token.userId;
      this.userRole = this.token.role;
    } else {
      this.token = null;
      this.userId = null;
    }
    this.getPosts();
  }

  obtenerValoresJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  // Obtener todos los posts
  getPosts() {
    this.isLoading = true;
    this.forumService.getPosts().subscribe({
      next: (data: IPost[]) => {
        this.posts = data;
        this.totalPosts = this.posts.length;
        this.isLoading = false;
        this.updatePaginatedPosts();
      },
      error: (error: any) => {
        console.error('Error al obtener posts:', error);
        this.errorMessage = 'Error al cargar los posts. Intenta de nuevo.';
        this.isLoading = false;
      },
    });
  }

  updatePaginatedPosts() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedPosts = this.posts.slice(start, end);
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.updatePaginatedPosts();
  }
  // Crear un nuevo post
  createPost() {
    if (!this.newPostTitle.trim() || !this.newPostContent.trim()) {
      Swal.fire(
        'Error',
        'El título y el contenido no pueden estar vacíos',
        'error'
      );
      return;
    }

    if (!this.userId) {
      Swal.fire('Error', 'No se pudo identificar al usuario', 'error');
      return;
    }

    this.forumService
      .createPost(this.newPostTitle, this.newPostContent, this.userId)
      .subscribe({
        next: (response) => {
          Swal.fire('Éxito', 'Post creado correctamente', 'success');
          console.log('Post creado:', response);
          this.newPostTitle = '';
          this.newPostContent = '';
          this.getPosts();
        },
        error: (error) => {
          Swal.fire('Error', 'No se pudo crear el post', 'error');
          console.error('Error al crear post:', error);
        },
      });
  }

  editPost(post: IPost) {
    this.editingPostId = post.id;
    this.editedTitle = post.title;
    this.editedContent = post.content;
  }

  saveEdit(postId: number) {
    this.forumService
      .updatePost(
        postId,
        this.editedTitle,
        this.editedContent,
        Number(this.userId)
      )
      .subscribe({
        next: () => {
          Swal.fire('Éxito', 'Post actualizado correctamente', 'success');
          this.editingPostId = null;
          this.getPosts();
        },
        error: (error) => {
          Swal.fire('Error', 'No se pudo actualizar el post', 'error');
          console.error('Error al actualizar post:', error);
        },
      });
  }

  cancelEdit() {
    this.editingPostId = null;
  }

  // Eliminar un post
  deletePost(postId: number) {
    Swal.fire({
      title: '¿Eliminar este post?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.forumService
          .deletePost(postId, Number(this.userId), this.userRole)
          .subscribe({
            next: () => {
              this.posts = this.posts.filter((post) => post.id !== postId);
              Swal.fire('Eliminado', 'El post ha sido eliminado', 'success');
              this.getPosts();
            },
            error: (error: any) => {
              console.error('Error al eliminar post:', error);
              Swal.fire('Error', 'No se pudo eliminar el post', 'error');
            },
          });
      }
    });
  }

  // Crear un comentario
  createComment(postId: number) {
    if (!this.newComment.trim()) {
      Swal.fire('Error', 'El comentario no puede estar vacío', 'error');
      return;
    }

    const authorId = Number(sessionStorage.getItem('userId')); // Obtener userId desde sessionStorage

    this.forumService
      .createComment(this.newComment, postId, authorId)
      .subscribe({
        next: (comment: IComment) => {
          this.comments.push(comment);
          this.newComment = '';
          Swal.fire('Éxito', 'Comentario agregado', 'success');
        },
        error: (error: any) => {
          console.error('Error al agregar comentario:', error);
          Swal.fire('Error', 'No se pudo agregar el comentario', 'error');
        },
      });
  }

  // Eliminar un comentario
  deleteComment(commentId: number) {
    Swal.fire({
      title: '¿Eliminar comentario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.forumService.deleteComment(commentId).subscribe({
          next: () => {
            this.comments = this.comments.filter(
              (comment) => comment.id !== commentId
            );
            Swal.fire('Eliminado', 'Comentario eliminado', 'success');
          },
          error: (error: any) => {
            console.error('Error al eliminar comentario:', error);
            Swal.fire('Error', 'No se pudo eliminar el comentario', 'error');
          },
        });
      }
    });
  }
  // Método para cerrar sesión
  logout() {
    Swal.fire({
      title: 'Cerrar sesión',
      text: '¿Seguro que quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }
}
