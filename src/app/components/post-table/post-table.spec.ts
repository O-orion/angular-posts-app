import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTable } from './post-table';

describe('PostTable', () => {
  let component: PostTable;
  let fixture: ComponentFixture<PostTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
