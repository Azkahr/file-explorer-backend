import { db, folders } from "../../db"
import { eq, inArray, like } from "drizzle-orm"
import { Folder, FolderInput } from "./model"
import { getAllFolders, getFolderById } from "./repository"
import { collectFolderIds } from "../../utils/folder-utils"
import { jsonResponse, errorResponse } from "../../utils/response"

export const buildFolderTree = async (): Promise<Folder[]> => {
  const flat = await getAllFolders()
  const map = new Map<number, Folder>()
  const roots: Folder[] = []

  for (const folder of flat) {
    map.set(folder.id, { ...folder, children: [] })
  }

  for (const folder of flat) {
    const current = map.get(folder.id)!
    if (folder.parentId !== null) {
      const parent = map.get(folder.parentId)
      if (parent) parent.children!.push(current)
    } else {
      roots.push(current)
    }
  }

  return roots
}

export const createFolder = async (data: FolderInput) => {
  if (data.parentId !== null && data.parentId !== undefined) {
    const parent = await getFolderById(data.parentId)
    if (!parent) return errorResponse("ParentId not found", 404)
  }

  const inserted = await db.insert(folders).values({
    name: data.name,
    parentId: data.parentId ?? null,
  })

  return jsonResponse({
      message: "Folder Created",
      data: {
        id: inserted[0].insertId,
        name: data.name,
        parentId: data.parentId ?? null,
      },
    }, 201)
}

export const renameFolder = async (id: number, newName: string) => {
  await db.update(folders).set({ name: newName }).where(eq(folders.id, id))
  const [updatedFolder] = await db.select().from(folders).where(eq(folders.id, id))

  if (!updatedFolder) return errorResponse("Folder not found", 404)

  return jsonResponse({
    message: "Folder renamed",
    data: updatedFolder,
  })
}

export const deleteFolder = async (id: number) => {
  const all = await getAllFolders()
  const idsToDelete = collectFolderIds(id, all)
  await db.delete(folders).where(inArray(folders.id, idsToDelete))

  return jsonResponse({ message: "Folders deleted recursively" })
}

export const searchFolders = async (query: string) => {
  const results = await db.select().from(folders).where(like(folders.name, `%${query}%`))

  return jsonResponse({
    message: "Search result",
    data: results,
  })
}
