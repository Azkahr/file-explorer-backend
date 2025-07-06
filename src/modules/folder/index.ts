import { Elysia } from "elysia";
import { buildFolderTree, createFolder, deleteFolder, renameFolder, searchFolders } from "./service";
import { deleteInput, folderInput, renameInput } from "./model";

export const folderModule = new Elysia({ prefix: '/v1/folders' })
    .get('/tree', async() => {
        return await buildFolderTree()
    })
    .get('/search/:query', async({ params }) => {
        return await searchFolders(params.query)
    })
    .post('/create', async({ body }) => {
        return await createFolder(body);
    }, {
        body: folderInput
    })
    .post('/rename', async ({ body }) => {
        return await renameFolder(body.id, body.name);
    }, {
        body: renameInput
    })
    .delete('/delete', async ({ body }) => {
        console.log(body);
        
        return await deleteFolder(body.id)
    }, {
        body: deleteInput
    })