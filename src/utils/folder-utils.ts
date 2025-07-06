import type { Folder } from "../modules/folder/model"

export const collectFolderIds = (id: number, all: Folder[]): number[] => {
  const ids: number[] = [id]
  const stack = [id]

  while (stack.length) {
    const currentId = stack.pop()!
    const children = all.filter((f) => f.parentId === currentId)
    for (const child of children) {
      ids.push(child.id)
      stack.push(child.id)
    }
  }

  return ids
}
