import dotenv from "dotenv"
import express from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import cors from "cors"
import { unlink } from "fs/promises"
import { storage, validar } from "./middlewares.js"
import path from "path"
import { criar_token, verificar_token, enviar_email } from "./config__server.js"
import z from "zod"

const app = express()
const prisma = new PrismaClient()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))

app.post("/criar__conta",
    
    storage(["image/jpeg", "image/png", "image/jpg", "image/gif"]).single("foto"),

    validar(z.object({
        body: z.object({
            nome: z.string().min(3),
            email: z.string().email().min(3),
            senha: z.string().min(3)
        })
    })),
    
    async (req, res) => {

    let { nome, email, senha } = req.body

    try {
        senha = await bcrypt.hash(senha, Number(process.env.PULO))

        let foto = ""

        if (req.file == undefined) {
            foto = null

        } else {
            foto = req.file.path
        }

        await prisma.usuario.create({
            data: {
                foto_de_perfil: foto,
                nome: nome,
                email: email,
                senha: senha,
                ativo: false
            }
        })

        const dados = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        })

        enviar_email(email, "Ativação da sua conta do Memorys", `É necessario ativa sua conta em http://localhost:5173/ativar__conta?id=${dados.id}`, `<p>É necessario ativa sua conta em <a href="http://localhost:5173/ativar__conta?id=${dados.id}">click aqui</p>`)

        res.status(201).send(true)

    } catch (e) {
        console.log(e)

        res.status(404).send(false)
    }
})

app.put("/ativar__conta",
    validar(z.object({
        query: z.object({
            id: z.string().cuid().min(5)
        })
    })),
    
    async (req, res) => {

    let { id } = req.query

    try {
        await prisma.usuario.update({
            where: {
                id: id
            },
            data: {
                ativo: true
            }
        })

        res.status(201).send(true)

    } catch (e) {
        console.log(e)
        res.status(404).send(false)
    }
})

app.get("/login",
    validar(z.object({
        query: z.object({
            email: z.string().email().min(3),
            senha: z.string().min(3)
        })
    })),

    async (req, res) => {

    let { email, senha } = req.query

    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        })

        if (await bcrypt.compare(senha, usuario.senha) && usuario.ativo == true) {
            const token = await criar_token(email)

            enviar_email(email, "Novo acesso a sua conta do Memorys", `Sua conta foi acessada por um dispositivo`, `<p>Sua conta foi acessada por um dispositivo</p>`)

            res.status(201).send([true, token])

        } else {
            res.status(404).send(false)
        }

    } catch (e) {
        console.log(e)
        res.status(404).send(false)
    }
})

app.get("/verificar__token",
    validar(z.object({
        query: z.object({
            token: z.string().min(1)
        })
    })),
    
    async (req, res) => {

    let { token } = req.query

    try {
        const vali_token = await verificar_token(token)

        res.status(200).send(vali_token)

    } catch (e) {
        res.status(404).send(false)
    }
})

app.get("/pegar__foto", 
    validar(z.object({
        query: z.object({
            email: z.string().email().min(3)
        })
    })),
    
    async (req, res) => {

    let { email } = req.query

    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        })

        if (usuario.foto_de_perfil != null) {
            res.status(200).sendFile(usuario.foto_de_perfil)

        } else {
            res.status(200).sendFile(path.resolve(path.dirname("")) + "/config/files/foto_de_perfil/Default.png")
        }

    } catch (e) {
        res.status(404).send(false)
    }
})

app.put("/alterar__foto",

    storage(["image/jpeg", "image/png", "image/jpg", "image/gif"]).single("foto"), 
    
    validar(z.object({
        body: z.object({
            email: z.string().email().min(3)
        })
    })),

    async (req, res) => {

    let { email } = req.body

    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        })

        if (usuario.foto_de_perfil != null) {
            unlink(usuario.foto_de_perfil)
        }

        let foto = ""

        if (req.file == undefined) {
            foto = null

        } else {
            foto = req.file.path
        }

        await prisma.usuario.update({
            where: {
                email: email
            },
            data: {
                foto_de_perfil: foto
            }
        })

        res.status(201).send(true)

    } catch (e) {
        console.log(e)
        res.status(404).send(false)
    }
})

app.get("/pegar__nome", 
    validar(z.object({
        query: z.object({
            email: z.string().email().min(3)
        })
    })),
    
    async (req, res) => {

    let { email } = req.query

    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        })

        res.status(200).send({nome: usuario.nome})

    } catch (e) {
        res.status(404).send("")
    }
})

app.put("/alterar__nome", 
    validar(z.object({
        query: z.object({
            email: z.string().email().min(3),
            nome: z.string().min(3)
        })
    })),

    async (req, res) => {

    let { email, nome } = req.query

    try {
        await prisma.usuario.update({
            where: {
                email: email
            },
            data: {
                nome: nome
            }
        })

        res.status(201).send({valor: true})

    } catch (e) {
        res.status(404).send({valor: false})
    }
})

app.delete("/deletar__conta",
    validar(z.object({
        query: z.object({
            email: z.string().email().min(3)
        })
    })), 

    async (req, res) => {

    let { email } = req.query

    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        })

        if (usuario.foto_de_perfil != null) {
            unlink(usuario.foto_de_perfil)
        }

        await prisma.usuario.delete({
            where: {
                email: email
            }
        })

        res.status(201).send(true)

    } catch (e) {
        console.log(e)
        res.status(404).send(false)
    }
})

export default app

app.listen(3000, () => console.log("Servidor rodando em https://localhost:3000"))