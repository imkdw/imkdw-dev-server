# ERD

- ERD used `prisma-markdown^2` packages

### Comment Rule

- @namespace <name>: Both ERD and markdown content
- @erd <name>: Only ERD
- @describe <name>: Only markdown content
- @hidden: Neither ERD nor markdown content
- @minItems 1: Mandatory relationship when 1: N (||---|{)

### example

```prisma
/// @namespace Memo
///
/// @describe Save contents of memo
/// @erd Memo
model Memo {
  /// Primary key
  ///
  /// @format uuid
  id String @id

  /// Title of memo
  title String

  /// Content of memo
  content String

  /// Identifier of folder that memo belongs to
  folderId String @map("folder_id")

  /// Path of folder that memo belongs to
  folderPath String @map("folder_path")

  /// Created time of memo
  createdAt DateTime @default(now())

  /// Updated time of memo
  updatedAt DateTime @updatedAt

  /// Folder that memo belongs to
  folder Folder @relation(fields: [folderId], references: [id])
}
```

# Convention

- prisma schema field name is camelCase
- database field name is snake_case
- database table name is snake_case
