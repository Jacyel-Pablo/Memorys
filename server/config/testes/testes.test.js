import dotenv from "dotenv"
import { describe, it } from "node:test"
import request from "supertest"
import app from "../server.js"
import assert from "node:assert"
import path from "path"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

var token = ""

describe("Aqui estão os testes para ver se as rotas estão funcionado", () => {
    it("Deve criar um usuário validor", async () => {
        const response = await request(app).post("/criar__conta").send(`foto=foto&nome=nome&email=teste@gmail.com&senha=senha`)

        assert.strictEqual(response.status, 201)
    })

    it("Deve ativar um usuário", async () => {
        const usu = await prisma.usuario.findUnique({
            where: {
                email: "teste@gmail.com"
            }
        })

        const response = await request(app).put(`/ativar__conta?id=${usu.id}`)

        assert.strictEqual(response.status, 201)
    })

    it("Deve fazer login", async () => {
        await request(app).get("/login?email=teste@gmail.com&senha=senha").then(dados => {
            token = dados.text[1]

            assert.strictEqual(dados.status, 201)
        })
    })

    it("Verificar token", async () => {
        const response = await request(app).get(`/verificar__token?token=${token}`)

        assert.strictEqual(response.status, 200)
    })

    it("Pegando foto de perfil", async () => {
        const response = await request(app).get("/pegar__foto?email=teste@gmail.com")

        assert.strictEqual(response.status, 200)
    })

    it("Alterando foto de perfil", async () => {
        const response = await request(app).put("/alterar__foto").field({"email": "teste@gmail.com"}).attach("foto", "../server/config/files/foto_de_perfil/Default.png")

        assert.strictEqual(response.status, 201)
    })

    it("Pegar nome de usuário", async () => {
        const response = await request(app).get("/pegar__nome?email=teste@gmail.com")

        assert.strictEqual(response.status, 200)
    })

    it("alterar nome do usuário", async () => {
        const response = await request(app).put("/alterar__nome?email=teste@gmail.com&nome=teste123")

        assert.strictEqual(response.status, 201)
    })

    it("deletar conta do usuário", async () => {
        const response = await request(app).delete("/deletar__conta?email=teste@gmail.com")

        assert.strictEqual(response.status, 201)
    })
})