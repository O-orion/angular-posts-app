import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '../models/post';
import { PostComment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class StatServices {
  private postsSubject = new BehaviorSubject<Post[]>([]);
  private showCommentsSubject = new BehaviorSubject<{ [key: number]: boolean }>({});
  private modalSubject = new BehaviorSubject<{
    isOpen: boolean;
    type: 'post' | 'comment' | null;
    data: Post | PostComment | null;
    postId?: number;
  }>({ isOpen: false, type: null, data: null, postId: undefined });

  posts$: Observable<Post[]> = this.postsSubject.asObservable();
  showComments$: Observable<{ [key: number]: boolean }> = this.showCommentsSubject.asObservable();
  modal$: Observable<{
    isOpen: boolean;
    type: 'post' | 'comment' | null;
    data: Post | PostComment | null;
    postId?: number;
  }> = this.modalSubject.asObservable();

  setPosts(posts: Post[]): void {
    this.postsSubject.next(posts);
  }

  updatePost(updatedPost: Post): void {
    const posts = this.postsSubject.value;
    const index = posts.findIndex((p) => p.id === updatedPost.id);
    if (index >= 0) {
      posts[index] = updatedPost;
    } else {
      posts.push(updatedPost);
    }
    this.postsSubject.next([...posts]);
  }

  removePost(id: number): void {
    this.postsSubject.next(this.postsSubject.value.filter((p) => p.id !== id));
  }

  toggleComments(postId: number): void {
    const showComments = { ...this.showCommentsSubject.value, [postId]: !this.showCommentsSubject.value[postId] };
    this.showCommentsSubject.next(showComments);
  }

  openModal(type: 'post' | 'comment', data: Post | PostComment | null = null, postId?: number): void {
    this.modalSubject.next({ isOpen: true, type, data, postId });
  }

  closeModal(): void {
    this.modalSubject.next({ isOpen: false, type: null, data: null, postId: undefined });
  }

  removeComment(postId: number, commentId: number): void {
    const posts = this.postsSubject.value;
    const post = posts.find((p) => p.id === postId);
    if (post && post.comments) {
      post.comments = post.comments.filter((c) => c.id !== commentId);
      this.postsSubject.next([...posts]);
    }
  }

  updateComment(postId: number, updatedComment: PostComment): void {
    const posts = this.postsSubject.value;
    const post = posts.find((p) => p.id === postId);
    if (post) {
      post.comments = post.comments || [];
      const index = post.comments.findIndex((c) => c.id === updatedComment.id);
      if (index >= 0) {
        post.comments[index] = updatedComment;
      } else {
        post.comments.push(updatedComment);
      }
      this.postsSubject.next([...posts]);
    }
  }

  updateComments(postId: number, comments: PostComment[]): void {
    const posts = this.postsSubject.value;
    const post = posts.find((p) => p.id === postId);
    if (post) {
      post.comments = comments;
      this.postsSubject.next([...posts]);
    }
  }
}
