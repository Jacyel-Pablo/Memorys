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
import { console, url } from "inspector"

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
    
    storage(["image/jpeg", "image/png", "image/jpg", "image/gif"], "/config/files/foto_de_perfil").single("foto"),

    validar(z.object({
        body: z.object({
            nome: z.string().min(3),
            email: z.string().email().min(3),
            senha: z.string().min(3)
        })
    })),
    
    async (req, res) => {

    let { nome, email, senha } = req.body

    email = email.toLowerCase()

    try {
        senha = await bcrypt.hash(senha, Number(process.env.PULO))

        let foto = ""

        if (req.file == undefined) {
            foto = null

        } else {
            foto = req.file.path
        }

        await prisma.memorys_Usuario.create({
            data: {
                foto_de_perfil: foto,
                nome: nome,
                email: email,
                senha: senha,
                ativo: false
            }
        })

        const dados = await prisma.memorys_Usuario.findUnique({
            where: {
                email: email
            }
        })

        enviar_email(email, "Ativação da sua conta do Memorys", `É necessario ativa sua conta em https://memorys.onrender.com/ativar__conta?id=${dados.id}`, `<p>É necessario ativa sua conta em <a href="https://memorys.onrender.com/ativar__conta?id=${dados.id}">click aqui</p>`)

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
        await prisma.memorys_Usuario.update({
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
        const usuario = await prisma.memorys_Usuario.findUnique({
            where: {
                email: email
            }
        })

        if (await bcrypt.compare(senha, usuario.senha) && usuario.ativo == true) {
            const token = await criar_token(email)

            enviar_email(email, "Novo acesso a sua conta do Memorys", `Sua conta foi acessada por um dispositivo`, `<p>Sua conta foi acessada por um dispositivo</p>`)

            res.status(201).send([true, token, usuario.id])

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
            token: z.string().min(5)
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

app.post("/enviar__mensagem",
    storage(["image/jpeg", "image/png", "image/jpg", "image/gif"], "/config/files/fotos").fields([{name: "fotos"}, {name: "videos"}]),

    validar(z.object({
        body: z.object({
            id: z.string().cuid().min(5),
            texto: z.string().min(5)
        })
    })),

    // storage(["video/mp4", "video/x-matroska"], "/config/files/videos").array("videos"),

    async (req, res) => {

    let { id, texto } = req.body

    try {
        const usuario = await prisma.memorys_Usuario.findUnique({
            where: {
                id: id
            }
        })

        const mensagem = await prisma.memorys_Mensagem.create({
            data: {
                id_usuario: id,
                foto_de_perfil: usuario.foto_de_perfil,
                nome: usuario.nome,
                texto_da_mensagem: texto,
            }
        })

        try {
            for (let i = 0; i < req.files.fotos.length; i++) {
                await prisma.memorys_Foto.create({
                    data: {
                        id_mensagem: mensagem.id,
                        fotos: req.files.fotos[i].path,
                        nome_user: usuario.nome
                    }
                })
            }

        } catch (e) {}

        try {
            for (let i = 0; i < req.files.videos.length; i++) {
                await prisma.memorys_Video.create({
                    data: {
                        id_mensagem: mensagem.id,
                        videos: req.files.videos[i].path,
                        nome_user: usuario.nome
                    }
                })
            }
            
        } catch (e) {}

        res.status(201).send([true, mensagem.id, usuario.foto_de_perfil])

    } catch (e) {
        console.log(e)
        res.status(404).send(false)
    }
})

app.get("/pegar__mensagens__compartilhada", async (req, res) => {
    const { id_user, id_msg } = req.query

    try {
        let msg = await prisma.memorys_mensagem.findUnique({
            where: {
                id: id_msg
            }
        })

        msg = [msg]

        if (msg[0].id_usuario === id_user) {
            msg[0]["usuario"] = true

        } else {
            msg[0]["usuario"] = false
        }

        delete msg[0].id_usuario

        const likes = await prisma.memorys_likes.count({
            where: {
                id_mensagem: msg[0].id
            }
        })

        msg[0]["likes"] = likes                

        const deslikes = await prisma.memorys_deslikes.count({
            where: {
                id_mensagem: msg[0].id
            }
        })

        msg[0]["deslikes"] = deslikes

        const likes_user = await prisma.memorys_likes.count({
            where: {
                id_mensagem: msg[0].id,
                id_usuario: id_user
            }
        })

        if (likes_user > 0) {
            msg[0]["likes_user"] = true

        } else {
            msg[0]["likes_user"] = false
        }

        const deslikes_user = await prisma.memorys_deslikes.count({
            where: {
                id_mensagem: msg[0].id,
                id_usuario: id_user
            }
        })

        if (deslikes_user > 0) {
            msg[0]["deslikes_user"] = true

        } else {
            msg[0]["deslikes_user"] = false
        }

        res.status(200).send(msg)

    } catch (e) {
        console.log(e)
        res.status(404).send(false)
    }
})

app.post("/curtir__mensagem",
    validar(z.object({
        body: z.object({
            id_msg: z.string().cuid().min(5),
            id_user: z.string().cuid().min(5)
        })

    })), async ( req, res ) => {
        
    const { id_msg, id_user } = req.body

    try {
        // Verifica se o usuário já curtiu a mensagem
        const usuario_like = await prisma.memorys_Likes.findFirst({
            where: {
                id_mensagem: id_msg,
                id_usuario: id_user
            }
        })

        // Verifica se o usuário não curtiu a mensagem
        const usuario_deslike = await prisma.memorys_Deslikes.findFirst({
            where: {
                id_mensagem: id_msg,
                id_usuario: id_user
            }
        })

        if (usuario_like == null && usuario_deslike == null) {
            await prisma.memorys_Likes.create({
                data: {
                    id_mensagem: id_msg,
                    id_usuario: id_user
                }
            })

            // Número de likes da postagem
            let numero_likes = await prisma.memorys_Likes.count({
                where: {
                    id_mensagem: id_msg
                }
            })

            res.status(201).send([true, "like", numero_likes])

        } else if (usuario_like == null && usuario_deslike != null) {
            
            // Número de likes da postagem
            let numero_likes = await prisma.memorys_Likes.count({
                where: {
                    id_mensagem: id_msg
                }
            })

            // Número de deslikes da postagem
            let numero_deslikes = await prisma.memorys_Deslikes.count({
                where: {
                    id_mensagem: id_msg
                }
            })

            numero_likes += 1
            numero_deslikes -= 1

            await prisma.memorys_Deslikes.deleteMany({
                where: {
                    id_mensagem: id_msg,
                    id_usuario: id_user
                }
            })

            await prisma.memorys_Likes.create({
                data: {
                    id_mensagem: id_msg,
                    id_usuario: id_user
                }
            })

            res.status(201).send([true, "deslike", numero_likes, numero_deslikes])

        } else {
            await prisma.memorys_Likes.deleteMany({
                where: {
                    id_mensagem: id_msg,
                    id_usuario: id_user
                }
            })

            // Número de likes da postagem
            let numero_likes = await prisma.memorys_Likes.count({
                where: {
                    id_mensagem: id_msg
                }
            })

            res.status(201).send([true, "rm_like", numero_likes])
        }

    } catch (e) {
        console.log(e)
        res.status(404).send(false)
    }
})

app.post("/nao__gostei__mensagem", 
    validar(z.object({
        body: z.object({
            id_msg: z.string().cuid().min(5),
            id_user: z.string().cuid().min(5)
        })

    })), async ( req, res ) => {

    const { id_msg, id_user } = req.body

    try {
        // Verifica se o usuário já colocou um não gostei na mensagem
        const usuario_deslike = await prisma.memorys_Deslikes.findFirst({
            where: {
                id_mensagem: id_msg,
                id_usuario: id_user
            }
        })

        const usuario_like = await prisma.memorys_Likes.findFirst({
            where: {
                id_mensagem: id_msg,
                id_usuario: id_user
            }
        })

        if (usuario_like == null && usuario_deslike == null) {
            await prisma.memorys_Deslikes.create({
                data: {
                    id_mensagem: id_msg,
                    id_usuario: id_user
                }
            })

            // Número de deslikes da postagem
            let numero_deslikes = await prisma.memorys_Deslikes.count({
                where: {
                    id_mensagem: id_msg
                }
            })

            res.status(201).send([true, "deslike", numero_deslikes])

        } else if (usuario_like != null && usuario_deslike == null) {
            
            // Número de likes da postagem
            let numero_likes = await prisma.memorys_Likes.count({
                where: {
                    id_mensagem: id_msg
                }
            })

            // Número de deslikes da postagem
            let numero_deslikes = await prisma.memorys_Deslikes.count({
                where: {
                    id_mensagem: id_msg
                }
            })

            numero_deslikes += 1
            numero_likes -= 1

            await prisma.memorys_Likes.deleteMany({
                where: {
                    id_mensagem: id_msg,
                    id_usuario: id_user
                }
            })

            await prisma.memorys_Deslikes.create({
                data: {
                    id_mensagem: id_msg,
                    id_usuario: id_user
                }
            })

            res.status(201).send([true, "like", numero_deslikes, numero_likes])

        } else {
            await prisma.memorys_Deslikes.deleteMany({
                where: {
                    id_mensagem: id_msg,
                    id_usuario: id_user
                }
            })

            // Número de deslikes da postagem
            let numero_deslikes = await prisma.memorys_Deslikes.count({
                where: {
                    id_mensagem: id_msg
                }
            })

            res.status(201).send([true, "rm_deslike", numero_deslikes])
        }

    } catch (e) {
        console.log(e)
        res.status(404).send(false)
    }
})

app.delete("/deletar__mensagem",
    validar(z.object({
        body: z.object({
            id_msg: z.string().cuid().min(5),
            id_user: z.string().cuid().min(5)
        })

    })), async ( req, res ) => {

    const { id_msg, id_user } = req.body

    try {
        const msg = await prisma.memorys_Mensagem.findFirst({
            where: {
                id: id_msg
            }
        })

        // Apagando comentarios
        await prisma.memorys_Comentarios.deleteMany({
            where: {
                id_mensagem: msg.id
            }
        })

        // Verificando se o usuário é o dono da mensagem
        if (msg.id_usuario === id_user) {
            // Deletando as fotos
            const fotos = await prisma.memorys_Foto.findMany({
                where: {
                    id_mensagem: id_msg
                }
            })

            for (let i = 0; i < fotos.length; i++) {
                unlink(fotos[i].fotos)
            }

            await prisma.memorys_Foto.deleteMany({
                where: {
                    id_mensagem: id_msg
                }
            })

            // Deletando as vidéos
            const video = await prisma.memorys_Video.findMany({
                where: {
                    id_mensagem: id_msg
                }
            })

            for (let i = 0; i < video.length; i++) {
                unlink(video[i].videos)
            }

            await prisma.memorys_Video.deleteMany({
                where: {
                    id_mensagem: id_msg
                }
            })

            // Deletando os likes
            await prisma.memorys_Likes.deleteMany({
                where: {
                    id_mensagem: id_msg
                }
            })

            // Deletando os deslikes
            await prisma.memorys_Deslikes.deleteMany({
                where: {
                    id_mensagem: id_msg
                }
            })

            // Deletando a mensagem
            await prisma.memorys_Mensagem.deleteMany({
                where: {
                    id: id_msg,
                    id_usuario: id_user
                }
            })

            res.status(201).send(true)

        } else {
            res.status(404).send(false)

        }

    } catch (e) {
        console.log(e)
        res.status(404).send(false)

    } 
})

app.get("/pegar__mensagens", 
    validar(z.object({
        query: z.object({
            id_user: z.string().cuid().min(5)
        })

    }))
    
    , async (req, res) => {
        
    const { id_user } = req.query

    try {
        const msg = await prisma.memorys_Mensagem.findMany()

        for (let i = 0; i < msg.length; i++) {

            if (msg[i].id_usuario === id_user) {
                msg[i]["usuario"] = true

            } else {
                msg[i]["usuario"] = false
            }

            delete msg[i].id_usuario

            const likes = await prisma.memorys_Likes.count({
                where: {
                    id_mensagem: msg[i].id
                }
            })

            msg[i]["likes"] = likes                

            const deslikes = await prisma.memorys_Deslikes.count({
                where: {
                    id_mensagem: msg[i].id
                }
            })

            msg[i]["deslikes"] = deslikes

            const likes_user = await prisma.memorys_Likes.count({
                where: {
                    id_mensagem: msg[i].id,
                    id_usuario: id_user
                }
            })

            if (likes_user > 0) {
                msg[i]["likes_user"] = true

            } else {
                msg[i]["likes_user"] = false
            }

            const deslikes_user = await prisma.memorys_Deslikes.count({
                where: {
                    id_mensagem: msg[i].id,
                    id_usuario: id_user
                }
            })

            if (deslikes_user > 0) {
                msg[i]["deslikes_user"] = true

            } else {
                msg[i]["deslikes_user"] = false
            }
        }

        res.status(200).send(msg)

    } catch (e) {
        console.log(e)
        res.status(404).send(false)
    }
})

// app.get("/pegar__midia__mensagens", 
//     validar(z.object({
//         query: z.object({
//             id: z.string().cuid().min(5)
//         })

//     }))
    
//     , async (req, res) => {

//     const { id } = req.query

//     try {
//         let lista_midias = []

//         // Tentando pegar fotos das mensagens
//         let midias = await prisma.memorys_Foto.findMany({
//             where: {
//                 id_mensagem: id
//             }
//         })

//         let fotos = []

//         for (let i = 0; i < midias.length; i++) {
//             fotos.push(midias[i].fotos)
//         }

//         lista_midias.push({"fotos": fotos})

//         // Tentando pegar vidéos das mensagens
//         midias = await prisma.memorys_Video.findMany({
//             where: {
//                 id_mensagem: id
//             }
//         })

//         let videos = []

//         for (let i = 0; i < midias.length; i++) {
//             videos.push(midias[i].videos)
//         }

//         lista_midias.push({"videos": videos})

//         // Enviando mensagem para o cliente
//         if (lista_midias.length == 0) {
//             res.status(404).send(false)

//         } else {
//             res.status(200).send(lista_midias)

//         }

//     } catch (e) {
//         console.log(e)
//         res.status(404).send(false)
//     }
// })

// app.get("/pegar__fotos__videos__mensagens",
//     validar(z.object({
//         query: z.object({
//             tipo: z.string().min(3),
//             url: z.string().min(3)
//         })

//     }))
    
//     , (req, res) => {

//     let { tipo, url } = req.query

//     try {
//         switch (tipo) {
//             case "foto":
//                 res.status(200).sendFile(url)
//                 break

//             case "video":
//                 res.status(200).sendFile(url)
//                 break

//             default:
//                 res.status(404).send(false)
//         }

//     } catch (e) {
//         console.log(e)
//         res.status(404).send(false)
//     }
// })

app.post("/enviar_comentarios", async ( req, res ) => {

    try {
        const { id_mensagem, email, texto } = req.body

        await prisma.memorys_Comentarios.create({
            data: {
                id_mensagem: id_mensagem,
                email_do_usuário: email,
                texto_da_mensagem: texto
            }
        })

        res.status(200).send(true)

    } catch (e) {
        res.status(404).send(e)
    }
})

app.get("/pegar_comentarios", async ( req, res ) => {

    try{
        // O id_msg e o id da mensagem
        const { id_msg } = req.query

        let comentarios_msg = await prisma.memorys_Comentarios.findMany({
            where: {
                id_mensagem: id_msg
            }
        })

        res.status(200).send(comentarios_msg)

    } catch (e) {
        res.status(404).send(false)
        
    }
})

app.get("/encontrar__usuario",
    validar(z.object({
        query: z.object({
            nome: z.string().min(3)
        })
    }))
    , async (req, res) => {

    let { nome } = req.query

    nome += "%"

    try {
        const user_names = await prisma.$queryRaw`SELECT id, foto_de_perfil, nome FROM Memorys_Usuario WHERE LOWER(nome) LIKE LOWER(${nome}) AND ativo LIKE true`

        res.status(200).send(user_names)

    } catch (e) {
        console.log(e)
        res.status(404).send(false)
    }
})

app.get("/pegar__foto", 
    validar(z.object({
        query: z.object({
            id: z.string().cuid().min(3)
        })
    })),
    
    async (req, res) => {
    
    let { id } = req.query

    try {
        const usuario = await prisma.memorys_Usuario.findUnique({
            where: {
                id: id
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

// app.get("/pegar__fotos__perfil",

//     validar(z.object({
//         query: z.object({
//             link: z.string().min(3)
//         })
//     })),
//     (req, res) => {

//     let { link } = req.query

//     try {

//         if (link != "null") {
//             res.status(200).sendFile(link)

//         } else {
//             res.status(200).sendFile(path.resolve(path.dirname("")) + "/config/files/foto_de_perfil/Default.png")
//         }

//     } catch (e) {
//         console.log(e)
//         res.status(404).send(false)
//     }
// })

// app.put("/alterar__foto",

//     storage(["image/jpeg", "image/png", "image/jpg", "image/gif"], "/config/files/foto_de_perfil").single("foto"), 
    
//     validar(z.object({
//         body: z.object({
//             id: z.string().cuid().min(3)
//         })
//     })),

//     async (req, res) => {

//     let { id } = req.body

//     try {
//         const usuario = await prisma.memorys_Usuario.findUnique({
//             where: {
//                 id: id
//             }
//         })

//         if (usuario.foto_de_perfil != null) {
//             unlink(usuario.foto_de_perfil)
//         }

//         let foto = ""

//         if (req.file == undefined) {
//             foto = null

//         } else {
//             foto = req.file.path
//         }

//         await prisma.memorys_Usuario.update({
//             where: {
//                 id: id
//             },
//             data: {
//                 foto_de_perfil: foto
//             }
//         })

//         res.status(201).send(true)

//     } catch (e) {
//         console.log(e)

//         res.status(404).send(false)
//     }
// })

app.get("/pegar__nome", 
    validar(z.object({
        query: z.object({
            id: z.string().cuid().min(3)
        })
    })),
    
    async (req, res) => {

    let { id } = req.query

    try {
        const usuario = await prisma.memorys_Usuario.findUnique({
            where: {
                id: id
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
            id: z.string().cuid().min(3),
            nome: z.string().min(3)
        })
    })),

    async (req, res) => {

    let { id, nome } = req.query

    try {
        await prisma.memorys_Usuario.update({
            where: {
                id: id
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
            id: z.string().cuid().min(3)
        })
    })), 

    async (req, res) => {

    let { id } = req.query

    try {
        const usuario = await prisma.memorys_Usuario.findUnique({
            where: {
                id: id
            }
        })

        // Deletando as fotos postadas pelo usuário
        const fotos = await prisma.memorys_Foto.findMany({
            where: {
                nome_user: usuario.nome
            }
        })

        for (let i = 0; i < fotos.length; i++) {
            unlink(fotos[i].fotos)
        }

        await prisma.memorys_Foto.deleteMany({
            where: {
                nome_user: usuario.nome
            }
        })

        // Deletando os videos postadas pelo usuário
        const videos = await prisma.memorys_Video.findMany({
            where: {
                nome_user: usuario.nome
            }
        })

        for (let i = 0; i < videos.length; i++) {
            unlink(videos[i].videos)
        }

        await prisma.memorys_Video.deleteMany({
            where: {
                nome_user: usuario.nome
            }
        })

        if (usuario.foto_de_perfil != null) {
            unlink(usuario.foto_de_perfil)
        }

        await prisma.memorys_Comentarios.deleteMany({
            where: {
                email_do_usuário: usuario.email
            }
        })

        await prisma.memorys_Mensagem.deleteMany({
            where: {
                nome: usuario.nome
            }
        })

        await prisma.memorys_Usuario.delete({
            where: {
                id: id
            }
        })

        res.status(201).send(true)

    } catch (e) {
        res.status(404).send(false)
    }
})

process.on("SIGINT", async() => {
    await prisma.$disconnect()
    process.exit(0)
})

process.on("SIGTERM", async() => {
    await prisma.$disconnect()
    process.exit(0)
})

export default app

app.listen(3000, "0.0.0.0", () => console.log("Servidor rodando na porta3000"))