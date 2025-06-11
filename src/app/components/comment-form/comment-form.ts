import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostComment } from '../../models/comment';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-form.html',
  styleUrls: ['./comment-form.scss'],
})
export class CommentForm implements OnInit {
  @Input() comment: PostComment | null = null;
  @Input() postId: number | null = null;
  @Output() save = new EventEmitter<PostComment>();
  @Output() cancel = new EventEmitter<void>();

  commentData: PostComment = { postId: 0, name: '', email: '', body: '' };
  errors: { name?: string; email?: string; body?: string } = {};

  ngOnInit(): void {
    if (this.comment) {
      this.commentData = { ...this.comment };
    } else if (this.postId !== null) {
      this.commentData = { postId: this.postId, name: '', email: '', body: '' };
    }
  }

  validate(): boolean {
    this.errors = {};
    if (!this.commentData.name.trim()) {
      this.errors.name = 'Nome é obrigatório';
    }
    if (!this.commentData.email.trim()) {
      this.errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(this.commentData.email)) {
      this.errors.email = 'Email inválido';
    }
    if (!this.commentData.body.trim()) {
      this.errors.body = 'Corpo é obrigatório';
    }
    return Object.keys(this.errors).length === 0;
  }

  onSubmit(): void {
    if (this.validate()) {
      this.save.emit(this.commentData);
    }
  }

  canceled(): void {
    this.cancel.emit();
  }
}
