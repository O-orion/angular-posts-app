import { CommonModule } from '@angular/common';
import { Component, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Input } from '@angular/core';
import { Post } from '../../models/post';
import { EventEmitter } from '@angular/core';
import { Init } from 'v8';

@Component({
  selector: 'app-post-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './post-form.html',
  styleUrl: './post-form.scss'
})
export class PostForm implements OnInit {

  @Input() post: Post| null = null;
  @Output() save = new EventEmitter<Post>();
  @Output() cancel = new EventEmitter<void>();

  postData: Post = {
    title: '',
    body: '',
    comments: []
  }

  errors: {
    title?: string, body?: string
  } = {};

  ngOnInit(): void {
      if(this.post) {
        this.postData = {...this.post};
      }
  }

  validate(): boolean {
    this.errors = {};
    if (!this.postData.title.trim()) {
      this.errors.title = 'Título é obrigatório';
    }
    if (!this.postData.body.trim()) {
      this.errors.body = 'Corpo é obrigatório';
    }
    return Object.keys(this.errors).length === 0;
  }

  onSubmit(): void {
    if(this.validate()) {
      this.save.emit(this.postData);
    }
  }

  canceled(): void {
    this.cancel.emit();
  }

}
