import { db, folders } from "../db"; // langsung dari db/index.ts
import { eq } from "drizzle-orm";

const seedData = [
  { id: 1, name: "var", parentId: null },
  { id: 2, name: "www", parentId: 1 },
  { id: 3, name: "html", parentId: 2 },
  { id: 4, name: "etc", parentId: null },
  { id: 5, name: "apache2", parentId: 4 },
  { id: 6, name: "infokes", parentId: 2 },
  { id: 7, name: "nginx", parentId: 38 },
  { id: 8, name: "sites-avalaible", parentId: 5 },
  { id: 9, name: "system", parentId: null },
];

async function seedFolders() {
  console.log("seeding folders table");

  await db.delete(folders);

  const now = new Date();

  await Promise.all(
    seedData.map((data) =>
      db.insert(folders).values({
        id: data.id,
        name: data.name,
        parentId: data.parentId,
        createdAt: now,
        updatedAt: now,
      })
    )
  );

  console.log("folders table seeded!");
  process.exit(0);
}

seedFolders().catch((err) => {
  console.error("seeder failed:", err);
  process.exit(1);
});
