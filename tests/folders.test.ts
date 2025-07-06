// tests/folders.test.ts
import { describe, expect, it, beforeEach } from "bun:test"
import { eq } from "drizzle-orm"
import { db, folders } from "../src/db"
import { createFolder } from "../src/modules/folder/service"

describe("createFolder", () => {
  beforeEach(async () => {
    await db.delete(folders)
  })

  it("should create a root folder", async () => {
    const result = await createFolder({ name: "root folder", parentId: null })

    const body = await result.json()
    
    expect(body.data).toHaveProperty("id")
    expect(body.data.name).toBe("root folder")
    expect(body.data.parentId).toBe(null)

    const stored = await db.select().from(folders).where(eq(folders.name, "root folder"))
    expect(stored.length).toBe(1)
  })

  it("should not create if parentId does not exist", async () => {
    const res = await createFolder({ name: "children", parentId: 999 })

    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.message).toBe("ParentId not found")
  })
})
