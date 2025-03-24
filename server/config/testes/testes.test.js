import dotenv from "dotenv"
import { describe, it } from "node:test"
import request from "supertest"
import app from "../server.js"
import assert from "node:assert"
import path from "path"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

var token
var id
var lista_dados

describe("Aqui estão os testes para ver se as rotas estão funcionado", () => {
    it("Deve criar um usuário validor", async () => {
        const response = await request(app).post("/criar__conta").send(`foto=foto&nome=nome&email=teste@gmail.com&senha=senha`)

        // Criando usuário que será usado na rota de achar usuários
        await request(app).post("/criar__conta").send(`foto=foto&nome=nome1&email=teste1@gmail.com&senha=senha`)

        assert.strictEqual(response.status, 201)
    })

    it("Deve ativar um usuário", async () => {
        const usu = await prisma.usuario.findUnique({
            where: {
                email: "teste@gmail.com"
            }
        })

        const usu1 = await prisma.usuario.findUnique({
            where: {
                email: "teste1@gmail.com"
            }
        })

        const response = await request(app).put(`/ativar__conta?id=${usu.id}`)

        // Ativando usuário que será usando para a rota de achar usuários
        await request(app).put(`/ativar__conta?id=${usu1.id}`)

        assert.strictEqual(response.status, 201)
    })

    it("Deve fazer login", async () => {
        await request(app).get("/login?email=teste@gmail.com&senha=senha").then(dados => {
            lista_dados = dados.text.split(",")
            lista_dados[1] = lista_dados[1].replace('"', "").replace('"', "")
            lista_dados[2] = lista_dados[2].replace('"', "").replace('"', "").replace("]", "")

            token = lista_dados[1]
            id = lista_dados[2]

            assert.strictEqual(dados.status, 201)
        })
    })

    it("Verificar token", async () => {
        const response = await request(app).get(`/verificar__token?token=${token}`)

        assert.strictEqual(response.status, 200)
    })

    it("Encontrar usuário", async () => {
        const response = await request(app).get(`/encontrar__usuario?nome=nome`)

        assert.strictEqual(response.status, 200)
    })

    it("Pegando foto de perfil", async () => {
        const response = await request(app).get(`/pegar__foto?id=${id}`)

        assert.strictEqual(response.status, 200)
    })

    it("Pegar fotos de qualque usuário perfil", async () => {
        const response = await request(app).get(`/pegar__fotos__perfil?link=null`)

        assert.strictEqual(response.status, 200)
    })

    it("Alterando foto de perfil", async () => {
        const response = await request(app).put("/alterar__foto").field({"id": id}).attach("foto", "../server/config/files/foto_de_perfil/Default.png")

        assert.strictEqual(response.status, 201)
    })

    it("Pegar nome de usuário", async () => {
        const response = await request(app).get(`/pegar__nome?id=${id}`)

        assert.strictEqual(response.status, 200)
    })

    it("alterar nome do usuário", async () => {
        const response = await request(app).put(`/alterar__nome?id=${id}&nome=teste123`)

        assert.strictEqual(response.status, 201)
    })

    it("deletar conta do usuário", async () => {
        const usu1 = await prisma.usuario.findUnique({
            where: {
                email: "teste1@gmail.com"
            }
        })

        const response = await request(app).delete(`/deletar__conta?id=${id}`)
        
        // Deletando o usuário 2
        await request(app).delete(`/deletar__conta?id=${usu1.id}`)

        assert.strictEqual(response.status, 201)
    })
})