import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Post } from '../../models/post';
import { PostComment } from '../../models/comment';
import { PostService } from '../../services/post.service';
import { StatServices } from '../../services/stat-services.service';
import { NotificationService } from '../../services/notification.service';
import { PostForm } from '../post-form/post-form';
import { CommentForm } from '../comment-form/comment-form';
import { PostTable } from '../post-table/post-table';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, PostForm, CommentForm, PostTable, Modal],
  templateUrl: './post-list.html',
  styleUrls: ['./post-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostList implements OnInit {
  posts$!: Observable<Post[]>;
  showComments$!: Observable<{ [key: number]: boolean }>;
  modal$!: Observable<{
    isOpen: boolean;
    type: 'post' | 'comment' | null;
    data: Post | PostComment | null;
    postId?: number;
  }>;

  constructor(
    private postService: PostService,
    private postStateService: StatServices,
    private notificationService: NotificationService
  ) {
    this.posts$ = this.postStateService.posts$;
    this.showComments$ = this.postStateService.showComments$;
    this.modal$ = this.postStateService.modal$;
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  isPostModal(modal: {
    isOpen: boolean;
    type: 'post' | 'comment' | null;
    data: Post | PostComment | null;
    postId?: number;
  }): modal is { isOpen: boolean; type: 'post'; data: Post | null; postId?: number } {
    return modal.type === 'post';
  }

  isCommentModal(modal: {
    isOpen: boolean;
    type: 'post' | 'comment' | null;
    data: Post | PostComment | null;
    postId?: number;
  }): modal is { isOpen: boolean; type: 'comment'; data: PostComment | null; postId?: number } {
    return modal.type === 'comment';
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (posts) => this.postStateService.setPosts(posts),
      error: () => this.notificationService.showError('Erro ao carregar posts.'),
    });
  }

  openCreateModal(): void {
    this.postStateService.openModal('post');
  }

  openEditModal(post: Post): void {
    this.postStateService.openModal('post', { ...post });
  }

  savePost(post: Post): void {
    const operation = post.id ? this.postService.updatePost(post) : this.postService.createPost(post);
    operation.subscribe({
      next: (updatedPost) => {
        this.postStateService.updatePost(updatedPost);
        this.notificationService.showSuccess(`Post ${post.id ? 'atualizado' : 'criado'}!`);
        this.postStateService.closeModal();
      },
      error: () => this.notificationService.showError(`Erro ao ${post.id ? 'atualizar' : 'criar'} post.`),
    });
  }

  deletePost(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    this.postStateService.removePost(id);
    this.postService.deletePost(id).subscribe({
      next: () => this.notificationService.showSuccess('Post excluído!'),
      error: () => {
        this.loadPosts();
        this.notificationService.showError('Erro ao excluir post.');
      },
    });
  }

  toggleComments(postId: number): void {
    this.postStateService.toggleComments(postId);
    this.postStateService.showComments$.subscribe((showComments) => {
      if (showComments[postId]) {
        this.postService.getComments(postId).subscribe({
          next: (comments) => {
            this.postStateService.updateComments(postId, comments);
          },
          error: () => this.notificationService.showError('Erro ao carregar comentários.'),
        });
      }
    });
  }

  openCommentModal(postId: number): void {
    this.postStateService.openModal('comment', null, postId);
  }

  openEditCommentModal({ comment, postId }: { comment: PostComment; postId: number }): void {
    this.postStateService.openModal('comment', { ...comment }, postId);
  }

  saveComment(comment: PostComment): void {
    const operation = comment.id ? this.postService.updateComment(comment) : this.postService.createComment(comment);
    operation.subscribe({
      next: (updatedComment) => {
        this.postStateService.updateComment(comment.postId, updatedComment);
        this.notificationService.showSuccess(`Comentário ${comment.id ? 'atualizado' : 'criado'}!`);
        this.postStateService.closeModal();
      },
      error: () => this.notificationService.showError(`Erro ao ${comment.id ? 'atualizar' : 'criar'} comentário.`),
    });
  }

  deleteComment({ commentId, postId }: { commentId: number; postId: number }): void {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) return;
    this.postStateService.removeComment(postId, commentId);
    this.postService.deleteComment(commentId, postId).subscribe({
      next: () => this.notificationService.showSuccess('Comentário excluído!'),
      error: () => {
        this.loadPosts();
        this.notificationService.showError('Erro ao excluir comentário.');
      },
    });
  }

  closeModal(): void {
    this.postStateService.closeModal();
  }
}
