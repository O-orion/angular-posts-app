import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../models/post';
import { PostComment } from '../../models/comment';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-post-table',
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './post-table.html',
  styleUrl: './post-table.scss'
})
export class PostTable {
  @Input() posts: Post[] = [];
  @Input() showComments: { [key: number]: boolean } = {};
  @Output() editPost = new EventEmitter<Post>();
  @Output() deletePost = new EventEmitter<number>();
  @Output() toggleComments = new EventEmitter<number>();
  @Output() openCommentModal = new EventEmitter<number>();
  @Output() editComment = new EventEmitter<{ comment: PostComment; postId: number }>();
  @Output() deleteComment = new EventEmitter<{ commentId: number; postId: number }>();

  constructor() {}
}
