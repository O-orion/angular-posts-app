import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { PostComment } from '../../models/comment';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-list',
  imports: [CommonModule],
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss'
})
export class PostList implements OnInit {

  posts: Post[] = [];
  showModal = false;
  showComment = false;
  selectedPost: Post | null = null;
  selectedComment: PostComment | null = null;
  selectedPostId: number | null = null;
  showComments: { [key: number]: boolean } = {};

  constructor(private postService: PostService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadPosts();
  }


  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erro ao carregar posts:', error);
      },
    });
  }

  openCreateModal(): void {
    this.selectedPost = null;
    this.showModal = true;
  }

  openEditModal(post: Post): void {
    this.selectedPost = {...post};
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPost = null;
  }

  savePost(post: Post): void {
    if (post.id) {
      this.postService.updatePost(post).subscribe({
        next: () => {
          this.loadPosts()
        },
        error: (error) => {
          console.log("Erro ao atualizar Post ", error)
        }
      })
    } else {
      this.postService.createPost(post).subscribe({
        next: () => {
          this.loadPosts()
        },
        error: (error) => {
          console.log('Erro ao criar post ', error)
        }
      })
    }
    this.closeModal();
  }

  deletePost(id: number): void {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      this.postService.deletePost(id).subscribe({
        next: () => {
          this.posts = this.posts.filter((post) => post.id !== id);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Erro ao excluir post:', error);
        },
      });
    }
  }

}
