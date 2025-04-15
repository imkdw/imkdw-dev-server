import { MemoFolder } from "@/memo/domain/memo-folder/memo-folder";
import { isUUID } from "../../../utils/uuid.util";

describe("새로운 메모 폴더를 만드는 경우", () => {
  it("UUID 형식의 아이디가 할당된다", () => {
    const sut = MemoFolder.create("test", null);
    expect(isUUID(sut.id)).toBe(true);
  });
});

describe("메모 폴더의 부모가 주어지고", () => {
  const parent = MemoFolder.create("parent", null);
  describe("새로운 메모 폴더를 만드는 경우", () => {
    it("문자열 형식의 경로가 생성된다", () => {
      const sut = MemoFolder.create("test", parent);
      expect(sut.path).toBe("/parent/test");
    });
  });
});
