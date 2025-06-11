import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  constructor(private postService: PostService) {

  }

  ngOnInit(): void {
    console.log("Olá")
    this.loadPosts();
  }

  loadPosts(): void {

    this.postService.getPosts().subscribe({
      next:(posts) => {
        console.log(posts)
        this.posts = posts;
      },
      error: (error) => {
        console.log("Erro ao carregar os posts " , error)
      }
    })

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
    if(confirm("Tem certeza que deseja exlcuir este post ?")) {
      this.postService.deletePost(id).subscribe({
        next: () => {
          this.loadPosts()
        },
        error: (error) => {
          console.log(`Erro ao excluir post: ${error}`)
        }
      })
    }
  }

}
