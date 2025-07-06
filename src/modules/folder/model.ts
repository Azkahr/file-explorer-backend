import { t } from 'elysia'

export type Folder = {
  id: number
  name: string
  parentId: number | null
  children?: Folder[]
}

export const folderInput = t.Object({
  name: t.String(),
  parentId: t.Nullable(t.Integer())
})

export const renameInput = t.Object({
  id: t.Number(),
  name: t.String()
})

export const deleteInput = t.Object({
  id: t.Number()
})

export type FolderInput = typeof folderInput.static
export type RenameInput = typeof renameInput.static
export type DeleteInput = typeof deleteInput.static