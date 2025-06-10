import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Post } from '../models/post';
import { PostComment } from '../models/comment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';
  private posts: Post[] = [];

  constructor(private http: HttpClient) {
    this.loadPosts();
  }

  private loadPosts(): void {
    this.http.get<Post[]>(`${this.apiUrl}/posts`).subscribe({
      next: (posts) => {
        this.posts = posts.map((post) => ({ ...post, comments: [] }));
      },
      error: (error) => console.error('Erro ao carregar posts:', error),
    });
  }

  getPosts(): Observable<Post[]> {
    return of(this.posts);
  }

  getPost(id: number): Observable<Post | undefined> {
    return of(this.posts.find((post) => post.id === id));
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, post).pipe(
      tap((newPost) => {
        this.posts.push({ ...newPost, comments: [] });
      }),
      catchError((error) => {
        console.error('Erro ao criar post:', error);
        throw error;
      })
    );
  }

  updatePost(post: Post): Observable<Post> {
    if (!post.id) {
      throw new Error('Post sem ID não pode ser atualizado');
    }
    return this.http.put<Post>(`${this.apiUrl}/posts/${post.id}`, post).pipe(
      tap((updatedPost) => {
        const index = this.posts.findIndex((p) => p.id === updatedPost.id);
        if (index !== -1) {
          this.posts[index] = { ...updatedPost, comments: this.posts[index].comments };
        }
      }),
      catchError((error) => {
        console.error('Erro ao atualizar post:', error);
        throw error;
      })
    );
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`).pipe(
      tap(() => {
        this.posts = this.posts.filter((post) => post.id !== id);
      }),
      catchError((error) => {
        console.error('Erro ao excluir post:', error);
        throw error;
      })
    );
  }

  getComments(postId: number): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(`${this.apiUrl}/posts/${postId}/comments`).pipe(
      tap((comments) => {
        const post = this.posts.find((p) => p.id === postId);
        if (post) {
          post.comments = comments || [];
        }
      }),
      catchError((error) => {
        console.error('Erro ao carregar comentários:', error);
        return of([]);
      })
    );
  }

  createComment(comment: PostComment): Observable<PostComment> {
    return this.http.post<PostComment>(`${this.apiUrl}/comments`, comment).pipe(
      tap((newComment) => {
        const post = this.posts.find((p) => p.id === comment.postId);
        if (post) {
          post.comments = [...post.comments, newComment];
        }
      }),
      catchError((error) => {
        console.error('Erro ao criar comentário:', error);
        throw error;
      })
    );
  }

  updateComment(comment: PostComment): Observable<PostComment> {
    if (!comment.id) {
      throw new Error('Comentário sem ID não pode ser atualizado');
    }
    return this.http.put<PostComment>(`${this.apiUrl}/comments/${comment.id}`, comment).pipe(
      tap((updatedComment) => {
        const post = this.posts.find((p) => p.id === comment.postId);
        if (post) {
          const index = post.comments.findIndex((c: PostComment) => c.id === updatedComment.id);
          if (index !== -1) {
            post.comments[index] = updatedComment;
          } else {
            console.warn(`Comentário com ID ${updatedComment.id} não encontrado`);
          }
        }
      }),
      catchError((error) => {
        console.error('Erro ao atualizar comentário:', error);
        throw error;
      })
    );
  }

  deleteComment(commentId: number, postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${commentId}`).pipe(
      tap(() => {
        const post = this.posts.find((p) => p.id === postId);
        if (post) {
          post.comments = post.comments.filter((c: PostComment) => c.id !== commentId);
        }
      }),
      catchError((error) => {
        console.error('Erro ao excluir comentário:', error);
        throw error;
      })
    );
  }
}
