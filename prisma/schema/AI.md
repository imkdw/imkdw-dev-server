# ERD

- ERD used `prisma-markdown^2` packages

### Comment Rule

- @namespace <name>: ERD 및 마크다운을 생성하는 경우
- @erd <name>: ERD만 생성하는 경우
- @describe <name>: 마크다운만 생성하는 경우
- @hidden: ERD 및 마크다운 생성을 모두 안하는 경우
- @minItems 1: 최소 1개 이상의 1:N 관계가 필요한 경우

### example

```prisma
/// @namespace 메모
///
/// @describe 메모의 폴더
/// @erd Folder
model MemoFolder {
  /// PK
  ///
  /// @format uuid
  id String @id

  /// 폴더 이름
  name String

  /// 부모 폴더 아이디
  parentId String? @map("parent_id")

  /// 폴더 경로
  path String

  /// 생성 시간
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz

  /// 수정 시간
  updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz

  /// 삭제 시간
  deletedAt DateTime? @map("deleted_at") @db.Timestamptz

  /// 폴더 내 메모목록
  memos Memo[]

  /// 부모 폴더
  parent MemoFolder? @relation("FolderToFolder", fields: [parentId], references: [id])

  /// 자식 폴더
  children MemoFolder[] @relation("FolderToFolder")

  @@index([parentId, name])
  @@map("memo_folder")
}
```

# 컨벤션

- prisma schema의 모든 모델(테이블) 이름은 PascalCase로 작성해줘
  - ex) MemoFolder, ArticleCategory
- prisma schema의 모든 필드 이름은 camelCase로 작성해줘 
  - ex) folderName, createdAt
- 데이터베이스에 저장되는 컬럼명은 snake_case로 작성해줘
  - ex) folder_name, created_at
- 데이터베이스에 저장되는 테이블명은 snake_case로 작성해줘
  - ex) memo_folder, article_category
