import { TestBed } from '@angular/core/testing';
import { ForumService } from './forum.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IPost } from 'src/app/models/post.model';
import { IComment } from 'src/app/models/comment.model';

describe('ForumService', () => {
  let service: ForumService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api';
  const mockToken = 'mocked-jwt-token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ForumService],
    });

    service = TestBed.inject(ForumService);
    httpMock = TestBed.inject(HttpTestingController);

    // Simula la presencia del token en sessionStorage
    spyOn(sessionStorage, 'getItem').and.callFake((key) => {
      if (key === 'token') return mockToken;
      return null;
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  /** ✅ 1. Test: Debería crearse el servicio correctamente */
  it('debería crearse el servicio ForumService', () => {
    expect(service).toBeTruthy();
  });

  /** ✅ 2. Test: Obtener todos los posts */
  it('debería obtener la lista de posts', () => {
    const mockPosts: IPost[] = [
      { id: 1, title: 'Post 1', content: 'Contenido 1', authorId: 101, createdAt: new Date() },
      { id: 2, title: 'Post 2', content: 'Contenido 2', authorId: 102, createdAt: new Date() },
    ];

    service.getPosts().subscribe((posts) => {
      expect(posts.length).toBe(2);
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${apiUrl}/posts`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockPosts);
  });

  /** ✅ 3. Test: Crear un post */
  it('debería crear un nuevo post', () => {
    const newPost = { title: 'Nuevo Post', content: 'Contenido nuevo', author_id: 101 };
    const mockResponse = { message: 'Post creado correctamente' };

    service.createPost(newPost.title, newPost.content, newPost.author_id).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/posts`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(req.request.body).toEqual(newPost);
    req.flush(mockResponse);
  });

  /** ✅ 4. Test: Actualizar un post */
  it('debería actualizar un post existente', () => {
    const updatedPost = { title: 'Post Editado', content: 'Contenido editado', userId: 101 };
    const postId = 1;

    service.updatePost(postId, updatedPost.title, updatedPost.content, updatedPost.userId).subscribe((res) => {
      expect(res).toEqual({ message: 'Post actualizado correctamente' });
    });

    const req = httpMock.expectOne(`${apiUrl}/posts/${postId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(req.request.body).toEqual(updatedPost);
    req.flush({ message: 'Post actualizado correctamente' });
  });

  /** ✅ 5. Test: Eliminar un post */
  it('debería eliminar un post', () => {
    const postId = 1;
    const userId = 101;
    const role = 'admin';

    service.deletePost(postId, userId, role).subscribe((res) => {
      expect(res).toEqual({ message: 'Post eliminado' });
    });

    const req = httpMock.expectOne(`${apiUrl}/posts/${postId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(req.request.body).toEqual({ userId, role });
    req.flush({ message: 'Post eliminado' });
  });

  /** ✅ 6. Test: Obtener todos los comentarios */
  it('debería obtener la lista de comentarios', () => {
    const mockComments: IComment[] = [
      { id: 1, content: 'Comentario 1', post_id: 1, author_id: 101, created_at: new Date() },
      { id: 2, content: 'Comentario 2', post_id: 2, author_id: 102, created_at: new Date() },
    ];

    service.getComments().subscribe((comments) => {
      expect(comments.length).toBe(2);
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne(`${apiUrl}/comments`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockComments);
  });

  /** ✅ 7. Test: Crear un comentario */
  it('debería crear un comentario en un post', () => {
    const newComment = { content: 'Nuevo Comentario', post_id: 1, author_id: 101 };
    const mockResponse = { message: 'Comentario agregado correctamente' };

    service.createComment(newComment.content, newComment.post_id, newComment.author_id).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/comments`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(req.request.body).toEqual(newComment);
    req.flush(mockResponse);
  });

  /** ✅ 8. Test: Eliminar un comentario */
  it('debería eliminar un comentario', () => {
    const commentId = 1;

    service.deleteComment(commentId).subscribe((res) => {
      expect(res).toEqual({ message: 'Comentario eliminado' });
    });

    const req = httpMock.expectOne(`${apiUrl}/comments/${commentId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush({ message: 'Comentario eliminado' });
  });
});
