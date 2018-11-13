import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First Post', content: 'This is the first post\'s content'},
  //   {title: 'Second Post', content: 'This is the second post\'s content'},
  //   {title: 'Third Post', content: 'This is the third post\'s content'},

  // ];

  posts: Post[] = [];
  isLoading = false; // for mat-spinner
  totalPosts = 0; // for mat-paginator
  postsPerPage = 2; // for mat-paginator
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10]; // for mat-paginator
  private postsSub: Subscription;
  // postsService: PostsService;

  constructor(public postsService: PostsService) {
    // this.postsService = postsService;
  }

  ngOnInit() {
    this.isLoading = true; // for mat-spinner
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostsUpdateListner()
    .subscribe((postData: { posts: Post[], postCount: number }) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
  }

  onChangedPage (pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
