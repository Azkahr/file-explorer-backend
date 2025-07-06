import { asc, desc, eq } from "drizzle-orm";
import { db, folders } from "../../db";
import { FolderInput } from "./model";

export const getAllFolders = () => db.select().from(folders).orderBy(asc(folders.name))

export const getFolderById = async (id: number) => {
  const [folder] = await db.select().from(folders).where(eq(folders.id, id));
  return folder;
};

export const insertFolder = async (data: FolderInput) => {
    db.insert(folders).values({
        name: data.name,
        parentId: data.parentId ?? null
    })
}