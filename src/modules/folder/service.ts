import { eq, inArray, like } from "drizzle-orm"
import { db, folders } from "../../db"
import { Folder, FolderInput } from "./model"
import { getAllFolders, getFolderById } from "./repository"

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

        if (!parent) {
            return new Response(JSON.stringify({ message: 'ParentId not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
    }

    const inserted = await db.insert(folders).values({
        name: data.name,
        parentId: data.parentId ?? null
    })

    return {
        message : 'Folder Created',
        data: {
            id: inserted[0].insertId,
            name: data.name,
            parentId: data.parentId ?? null,
        },
    }
}

export const renameFolder = async (id: number, newName: string) => {
    await db.update(folders).set({ name: newName }).where(eq(folders.id, id))

    const [updatedFolder] = await db.select().from(folders).where(eq(folders.id, id))

    return {
        message: "Folder renamed",
        data: updatedFolder
    }
}

// TODO: collect folder id that should be deleted, including the children/subfolders
const collectFolderIds = (id: number, all: any[]): number[] => {
  const ids: number[] = [id]

  const stack = [id]
  while (stack.length) {
    const currentId = stack.pop()!
    const children = all.filter(f => f.parentId === currentId)
    for (const child of children) {
      ids.push(child.id)
      stack.push(child.id)
    }
  }

  return ids
}

// TODO: delete folders also with its children
export const deleteFolder = async (id: number) => {
    const all = await getAllFolders()

    const idsToDelete = collectFolderIds(id, all)
    
    await db.delete(folders).where(inArray(folders.id, idsToDelete))

    return {
        message: 'Folders deleted recursively',
    }
}

export const searchFolders = async (query: string) => {
    return db.select().from(folders).where(like(folders.name, `%${query}%`))
}