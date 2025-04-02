export class Memo {
  id: string;
  title: string;
  content: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, title: string, content: string, viewCount: number, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.viewCount = viewCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
