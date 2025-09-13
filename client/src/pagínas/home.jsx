import estilos from "../css/home.module.css"
import estilos_config from "../css/configuracao conta.module.css"
import fotos from "../assets/foto icone.png"
import video from "../assets/video icone.png"
import compartilhar from "../assets/compartilhar icone.png"
import foto__default from "../assets/Default.png"
import { WhatsappIcon, WhatsappShareButton, XIcon, TwitterShareButton, EmailIcon, EmailShareButton } from "react-share"
import copy from "copy-to-clipboard"
import copiar_link from "./source/Copiar link.png"
import { useState, useEffect } from "react"

export default function Home(props)
{
    const [ dados, setDados ] = useState({
        envio__mensagens: [],
        nome: "",
        texto: "",
        // Flag para entedi o bug de duplicação de mensagens
        flag: 0,
        // lista de informações de mensagens
        msg_infor: [],

        // Flag de atualização das avaliações das mensagens
        avaliacao: [false, "like"],

        // Configurações da janela de apagar mensagem

        janela_apagar_msg: {
            alturar_largura_deleta_conta: 0,
            input__file__h_w: 0,
            font__paragrafo: {"fontSize": "0%"},
            container__apagar__mensagem: {},
            
            // Aqui vamos configura a imagem
            diretorio: "",
            largura__foto: {"width": "0%"},
        },

        // Configuração da janela de compartilhar mensagem
        janela_comparthilar_msg: {
            abrir_fechar_janela: "",
            margin_janela_compartilhar_mensagem: {
                "marginTop": "100vh"
            }
        },

        // Esse id e para que na tela de apagar a mensagem agente possa
        // Saber qual a mensagem que deve se apagada
        id_mensagem: "",
    })

    const server = props.server

    // Lista de componentes de mensagens que serão utilizados
    var lista_mensagens = []

    // Flag para ativa desativa comentarios
    var flag_comentarios = false

    // Variavel que leva a informação de se o botão responde está ativo ou desativo no momento também leva a posição dele
    var flag_infor_comentarios = ""
    
    // Variavel para conta quantas envio__mensagens existem dentro de dados
    var contado = 0

    // Essa variavel identifica se o usúario clicou no like ou no deslike
    var like_deslike = "deslike"

    // Variavel para abrir e fechar a janela de deletar mensagem
    var abrir_janela = false

    // Aqui também vamos colocar uma flag para ver se o nosso amigo
    // Que deleta a mensagem ou ele que ver uma foto melhor
    var flag_foto = false
    var caminho_foto = ""

    // Verificar se a algo no query da mensagem
    const parametos = new URLSearchParams(window.location.search).toString().split("=")

    function pegar_dados(e)
    {
        if (e.target.id.split(" ")[0] === "comentario") {
            let mensagens = dados.msg_infor

            mensagens[0][e.target.id.split(" ")[1]][0]["comentario_input"] = e.target.value
            
            setDados(copiar => ({
                ...copiar,
                msg_infor: [...mensagens],
                id_mensagem: mensagens[0][e.target.id.split(" ")[1]][0]["id_msg"]
            }))

        } else {
            setDados(copiar => ({
                ...copiar,
                [e.target.id]: e.target.value
            }))
        }
    }

    function procurar_usuario(e)
    {

        if (e.key === "Enter") {

            fetch(`http://${server}:3000/encontrar__usuario?nome=${dados.nome}`).then(dados1 => dados1.json()).then(dados1 => {
                let lista_html = []
            
                fetch(`http://${server}:3000/pegar__nome?id=${localStorage.getItem("id")}`).then(nome => nome.json()).then(nome => {

                    for (let i = 0; i < dados1.length; i++) {

                        if (dados1[i].nome != nome.nome) {
                            lista_html.push(
                                <a key={i} className={estilos.found} href="#">
                                    <img className={estilos.found__imagem} src={`http://${server}:3000/pegar__fotos__perfil?link=${dados1[i].foto_de_perfil}`} alt="Foto de perfil" />
        
                                    <h1 className={estilos.found__nomes}>{dados1[i].nome}</h1>
                                </a>
                            )
                        }

                    }

                    setDados(copiar => ({
                        ...copiar,
                        envio__mensagens: lista_html 
                    }))
                })

            })
        }
    }

    async function enviar_mensagem(e) {
        e.preventDefault()

        const form = new FormData()

        form.append("id", localStorage.getItem("id"))
        form.append("texto", e.target[0].value)

        for (let i = 0; i < e.target[2].files.length; i++) {
            form.append("fotos", e.target[2].files[i])
        }

        for (let i = 0; i < e.target[3].files.length; i++) {
            form.append("videos", e.target[3].files[i])
        }

        // form.append("videos", e.target[3].files)

        const res = await fetch(`http://${server}:3000/enviar__mensagem`, {
            method: "POST",
            body: form

        })

        fetch(`http://${server}:3000/pegar__nome?id=${localStorage.getItem("id")}`).then(nome => nome.json()).then(nome => {
            if (res.status === 201) {

                res.json().then(res => {
                    // fetch(`http://${server}:3000/pegar__midia__mensagens?id=${res[1]}`).then(arquivos => arquivos.json().then(arquivos => {             

                        let data = new Date().toISOString()
                        data = data.split("T")
    
                        data = data[0].split("-")
                        data = data.reverse()
                        data = data[0] + "/" + data[1] + "/" + data[2]

                        // ava e uma copiar de dados.avaliacao
                        // let ava = [...dados.avaliacao]

                        // Ficar assim {id_da_mensagem: [likes, deslikes]}

                        // ava.push({[res[1]]: [0, 0]})

                        // setDados(copiar => ({
                        //     ...copiar,
                        //     avaliacao: ava
                        // }))

                        // console.log(ava)

                        // Vamos usa isso para achar o index com os dados de like e deslikes
                        // let index = ava.findIndex(e => res[1] in e)

                        // console.log(index)
                        // console.log(dados.avaliacao[index])

                        // Pegar as fotos e videos da imagem
        
                        // Fotos das imagens
                        let fotos = []
        
                        // for (let i = 0; i < arquivos[0]["fotos"].length; i++) {
                        //     fotos.push(<img key={i} onClick={() => {

                        //         flag_foto = true
                        //         caminho_foto = `http://${server}:3000/pegar__fotos__videos__mensagens?tipo=foto&url=${arquivos[0]["fotos"][i]}`

                        //         abrir_janela_apagar_mensagem()

                        //     }} className={estilos.foto__mensagem} src={`http://${server}:3000/pegar__fotos__videos__mensagens?tipo=foto&url=${arquivos[0]["fotos"][i]}`}/>)
                        // }

                        let videos = []

                        // for (let k = 0; k < arquivos[1]["videos"].length; k++) {
                        //     videos.push(
                        //         <video key={k} className={estilos.videos__mensagem} controls>
                        //             <source src={`http://${server}:3000/pegar__fotos__videos__mensagens?tipo=foto&url=${arquivos[1]["videos"][k]}`}/>
                        //         </video>
                        //     )
                        // }

                        let msg = [...dados.msg_infor]

                        msg.push(
                        [
                            {
                                [dados.msg_infor.length]: {
                                    id: dados.msg_infor.length,
                                    id_msg: res[1],
                                    usuario: true,
                                    nome: nome.nome,
                                    foto_de_perfil: res[2],
                                    data_de_publicacao: data,
                                    texto_da_mensagem: e.target[0].value,
                                    fotos: [fotos],
                                    videos: [videos],
                                    likes: "0",
                                    deslikes: "0",
                                    comentario_input: "",
                                    comentario: []
                                }
                            }
                        ])
            
                        setDados(copiar => ({
                            ...copiar,
                            msg_infor: msg,
                            flag: dados.flag += 1,
                        }))
            
                        e.target.reset()
    
                    })
                // })
    
            } else {
                alert("Ocorreu um erro ao enviar sua mensagem\nTente novamente")
                e.target.reset()
    
            }
        })
    }

    // Função de enviar comentarios
    async function enviar__comentario(e, index)
    {
        e.preventDefault()

        await fetch(`http://${server}:3000/enviar_comentarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_mensagem: dados.id_mensagem,
                email: localStorage.getItem("email"),
                texto: dados.msg_infor[0][index][0]["comentario_input"]
            })

        }).then(res => res.json()).then(res => {
            
            let mensagens = dados.msg_infor

            mensagens[0][index][0]["comentario_input"] = ""
            
            setDados(copiar => ({
                ...copiar,
                msg_infor: [...mensagens]
            }))

        })
    }

    // Função de apagar mensagem
    async function apagar_mensagem(e)
    {
        e.preventDefault()

        const dados_msg = {
            "id_msg": dados.id_mensagem,
            "id_user": localStorage.getItem("id")
        }

        fetch(`http://${server}:3000/deletar__mensagem`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados_msg)

        }).then(dados1 => dados1.json()).then(dados1 => {
            console.log(dados1)
            switch (dados1) {
                case true:
                    location.href = "/home"
                    break

                case false:
                    alert("Ocorreu um erro ao tentar excluir a mensagem")
                    break
            }

        })
    }

    // Função de da zoom na imagem e de confirmar se e para apagar a conta
    function abrir_janela_apagar_mensagem()
    {
        switch (flag_foto) {
            case true:
                setDados(copiar => ({
                    ...copiar,
                    janela_apagar_msg: {
                        alturar_largura_deleta_conta: 100,
                        input__file__h_w: 0,
                        font__paragrafo: {
                            "fontSize": "0%",
                            "border": "0px solid"
                        },
                        container__apagar__mensagem: {
                            "width": "0px",
                            "border": "0px solid",
                            "margin": "0px 0px"
                        },
                        largura__foto: {},
                        diretorio: caminho_foto
                    },
                }))

                flag_foto = false

                break

            case false:

                if (abrir_janela === true) {
                    setDados(copiar => ({
                        ...copiar,
                        janela_apagar_msg: {
                            alturar_largura_deleta_conta: 100,
                            input__file__h_w: 0,
                            font__paragrafo: {
                                "fontSize": "120%"
                            },
                            container__apagar__mensagem: {},
                            largura__foto: {"width": "0%"}
                        }
                    }))
        
                } else {
                    setDados(copiar => ({
                        ...copiar,
                        janela_apagar_msg: {
                            alturar_largura_deleta_conta: 0,
                            input__file__h_w: 0,
                            font__paragrafo: {
                                "fontSize": "0%"
                            },
                            container__apagar__mensagem: {},
                            largura__foto: {"width": "0%"}
                        }
                    }))
        
                }

                break
        }
    }

    function abrir_janela_compartilhar_mensagem()
    {
        if (dados.janela_comparthilar_msg.margin_janela_compartilhar_mensagem["marginTop"] === "100vh") {
            setDados(copiar => ({
                ...copiar,
                janela_comparthilar_msg: {
                    abrir_fechar_janela: estilos.abrir__janela__compartilhar__mensagem,
                    margin_janela_compartilhar_mensagem: {
                        "marginTop": "60vh"
                    }
                }
            }))

        } else {
            setDados(copiar => ({
                ...copiar,
                janela_comparthilar_msg: {
                    abrir_fechar_janela: estilos.fechar__janela__compartilhar__mensagem,
                    margin_janela_compartilhar_mensagem: {
                        "marginTop": "100vh"
                    }
                }
            }))
        }
    }

    // Função para dar like e deslike em uma mensagem
    async function like(e, infor) {
        e.preventDefault()
        
        switch (flag_comentarios) {
            // Caso a flag comentarios seja false e para adicionar like se a flag for true abre os comentarios
            case false:
                const input_like = e.target[0]
                const input_deslike = e.target[1]

                const id_msg = input_like.id.split(",")

                let dados_msg_infor_copy = dados.msg_infor

                function select_botao(elemento, numero)
                {
                    // O index index_msg e o index da mensagem
                    let index_msg = elemento.id.split(",")[elemento.id.split(",").length - 1]

                    // Essa e uma lista com as informações do elemento
                    let lista_elemento = dados.msg_infor

                    if (elemento.value.split(": ")[0] === "Like") {
                        lista_elemento[index_msg][0][index_msg]["likes"] += 1
                        lista_elemento[index_msg][0][index_msg]["likes_user"] = true

                        setDados(copiar => ({
                            ...copiar,
                            msg_infor: lista_elemento
                        }))

                    } else {
                        lista_elemento[index_msg][0][index_msg]["deslikes"] += 1
                        lista_elemento[index_msg][0][index_msg]["deslikes_user"] = true

                        setDados(copiar => ({
                            ...copiar,
                            msg_infor: lista_elemento
                        }))
                    }

                    elemento.border = "0px solid"
                    elemento.style.backgroundColor = "blue"
                    elemento.style.color = "white"
                    elemento.style.fontSize = "120%"
                    elemento.style.borderRight = "2px solid"
                    elemento.style.borderColor = "black"
                }

                function deselect_botao(elemento, numero)
                {
                    // O index index_msg e o index da mensagem
                    let index_msg = elemento.id.split(",")[elemento.id.split(",").length - 1]

                    // Essa e uma lista com as informações do elemento
                    let lista_elemento = dados.msg_infor

                    if (elemento.value.split(": ")[0] === "Like") {
                        lista_elemento[index_msg][0][index_msg]["likes"] -= 1
                        lista_elemento[index_msg][0][index_msg]["likes_user"] = false

                        setDados(copiar => ({
                            ...copiar,
                            msg_infor: lista_elemento
                        }))

                    } else {
                        lista_elemento[index_msg][0][index_msg]["deslikes"] -= 1
                        lista_elemento[index_msg][0][index_msg]["deslikes_user"] = false

                        setDados(copiar => ({
                            ...copiar,
                            msg_infor: lista_elemento
                        }))
                    }

                    elemento.style.backgroundColor = "white"
                    elemento.style.fontSize = "120%"
                    elemento.style.border = "0px solid"
                    elemento.style.borderRight = "2px solid"
                    elemento.style.color = "black"
                }

                switch (like_deslike) {
                    case "like":
                        fetch(`http://${server}:3000/curtir__mensagem`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                id_msg: id_msg[0],
                                id_user: localStorage.getItem("id")      
                            })
            
                        }).then(dados_msg => dados_msg.json()).then(dados_msg => {
                            if (dados_msg[0] === true && dados_msg[1] === "like") {
                                select_botao(input_like, dados_msg[2])
            
                            } else if (dados_msg[0] === true && dados_msg[1] === "deslike") {
                                // Configuração do like
                                select_botao(input_like, dados_msg[2])
            
                                // Configuração do deslike
                                deselect_botao(input_deslike, dados_msg[3])

                            } else if (dados_msg[0] === true && dados_msg[1] === "rm_like") {
                                deselect_botao(input_like, dados_msg[2])
                            }
                        })
            
                        setDados(copiar => ({
                            ...copiar,
                            avaliacao: [true, "like"],
                            msg_infor: dados_msg_infor_copy
                        }))

                        break
            
                    case "deslike":
            
                        fetch(`http://${server}:3000/nao__gostei__mensagem`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                id_msg: id_msg[0],
                                id_user: localStorage.getItem("id")      
                            })
            
                        }).then(dados_msg => dados_msg.json()).then(dados_msg => {
                            if (dados_msg[0] === true && dados_msg[1] === "deslike") {
                                // Configuração do like
                                select_botao(input_deslike, dados_msg[2])
            
                            } else if (dados_msg[0] === true && dados_msg[1] === "like") {
                                // Configuração do deslike
                                select_botao(input_deslike, dados_msg[2])
            
                                // Configuração do like
                                deselect_botao(input_like, dados_msg[3])

                            } else if (dados_msg[0] === true && dados_msg[1] === "rm_deslike") {
                                deselect_botao(input_deslike, dados_msg[2])
                            }
                        })
            
                        setDados(copiar => ({
                            ...copiar,
                            avaliacao: [true, "like"],
                            msg_infor: dados_msg_infor_copy
                        }))

                        break
                }
                break

            case true:
                let div_comentarios = e.target.children[1]

                let input_enviar_comentario = e.target.children[1].children[1].children[0]

                let botao_enviar_comentario = e.target.children[1].children[1].children[1]

                if (div_comentarios.id === "fechado" || div_comentarios.id.length === 0) {
                    div_comentarios.className = estilos.box__comentarios__ativo
                    input_enviar_comentario.className = estilos.enviar__comentario__input__ativo
                    botao_enviar_comentario.className = estilos.enviar__comentario__botao__ativo
                    div_comentarios.id = "aberto"

                } else {
                    div_comentarios.className = estilos.box__comentarios__desativo
                    input_enviar_comentario.className = estilos.enviar__comentario__input__desativo
                    botao_enviar_comentario.className = estilos.enviar__comentario__botao__desativo
                    div_comentarios.id = "fechado"

                }

                // flag_comentarios = false
                break
        
            case "responde":
                let dados_botao_responde = infor.split(" ")
                console.log(dados_botao_responde, e)
                let input_mensagem = e.target[dados_botao_responde[1] - 3]
                let botao_enviar_mensagem = e.target[dados_botao_responde[1] - 2]
                let botao_cancelar = e.target[dados_botao_responde[1] - 1]
                let botao_responde = e.target[dados_botao_responde[1]]
                let botão_ver_respostas = e.target[parseInt(dados_botao_responde[1]) + 1]

                switch (dados_botao_responde[0]) {
                    case "botão_responde":
                        input_mensagem.className = estilos.comentario__box__submit__input__texto__ativo
                        botao_enviar_mensagem.className = estilos.comentario__box__submit__enviar__ativo
                        botao_cancelar.className = estilos.comentario__box__submit__cancelar__ativo
                        botao_responde.className = estilos.comentario__box__submit__ver__respostas__desativo
                        botão_ver_respostas.className = estilos.comentario__box__submit__ver__respostas__desativo
                        break
                    
                    case "botão_cancelar":
                        input_mensagem.className = estilos.comentario__box__submit__input__texto__desativo
                        botao_enviar_mensagem.className = estilos.comentario__box__submit__enviar__desativo
                        botao_cancelar.className = estilos.comentario__box__submit__enviar__desativo
                        botao_responde.className = estilos.comentario__box__submit__responde__ativo
                        botão_ver_respostas.className = `${estilos.comentario__box__submit__responde__ativo} ${estilos.comentario__box__submit__ver__respostas__ativo}`
                        break
                }
                break

            case "ver_respostas":
                // Variavel que pegar a div de respostas de comentarios
                let index_comentario = Number(infor.split(" ")[2])
                let ver_respostas_comentarios = e.target["children"][1]["children"][0]["children"][index_comentario]["children"][3]
                let botao_ver_respostas_comentarios = e.target["children"][1]["children"][0]["children"][index_comentario]["children"][2]["children"][4]

                if (infor.split(" ")[1] === "false") {
                    ver_respostas_comentarios.style.height = "0px"
                    botao_ver_respostas_comentarios.id = "botão_ver_respostas true"
                    // flag_infor_comentarios = "botão_ver_respostas true"

                } else {
                    ver_respostas_comentarios.style.height = "15em"
                    botao_ver_respostas_comentarios.id = "botão_ver_respostas false"
                    // flag_infor_comentarios = "botão_ver_respostas false"
                }

                break
            
            default:
                console.log("Erro")
                break
        }
    }

    // Pegar as mensagens do banco de dados
    useEffect(() => {

        if (parametos.length === 1) {
            fetch(`http://${server}:3000/pegar__mensagens?id_user=${localStorage.getItem("id")}`).then(dados1 => dados1.json()).then(dados1 => {
            
                if (dados.flag == 0) {
                    let index = -1
    
                    for (let i = 0; i < dados1.length; i++) {
    
                        // fetch(`http://${server}:3000/pegar__midia__mensagens?id=${dados1[i].id}`).then(arquivos => arquivos.json().then(arquivos => {             
                            fetch(`http://${server}:3000/pegar_comentarios?id_msg=${dados1[i].id}`).then(comentarios => comentarios.json()).then(comentarios => {   
                                index += 1
        
                                contado += 1
            
                                let data = dados1[i].data_de_publicacao.split("T")
            
                                data = data[0].split("-")
                                data = data.reverse()
                                data = data[0] + "/" + data[1] + "/" + data[2]
        
                                // Pegar as fotos e videos da imagem
            
                                // Fotos das imagens
                                let fotos = []
            
                                // for (let j = 0; j < arquivos[0]["fotos"].length; j++) {
                                //     fotos.push(
                                //         <img key={j} onClick={(e) => {
                                //             flag_foto = true
                                //             caminho_foto = `http://${server}:3000/pegar__fotos__videos__mensagens?tipo=foto&url=${arquivos[0]["fotos"][j]}`
        
                                //             abrir_janela_apagar_mensagem()
                                //         }} className={estilos.foto__mensagem} src={`http://${server}:3000/pegar__fotos__videos__mensagens?tipo=foto&url=${arquivos[0]["fotos"][j]}`}/>)
                                // }
        
                                let videos = []
        
                                // for (let k = 0; k < arquivos[1]["videos"].length; k++) {
                                //     videos.push(
                                //         <video key={k} className={estilos.videos__mensagem} controls>
                                //             <source src={`http://${server}:3000/pegar__fotos__videos__mensagens?tipo=foto&url=${arquivos[1]["videos"][k]}`}/>
                                //         </video>
                                //     )
                                // }

                                lista_mensagens.push(
                                [
                                    {
                                        [index]: {
                                            id: i,
                                            // id_msg e o id da mensagem
                                            id_msg: dados1[i].id,
                                            usuario: dados1[i].usuario,
                                            nome: dados1[i].nome,
                                            foto_de_perfil: dados1[i].foto_de_perfil,
                                            data_de_publicacao: data,
                                            texto_da_mensagem: dados1[i].texto_da_mensagem,
                                            fotos: [fotos],
                                            videos: [videos],
                                            likes: dados1[i].likes,
                                            likes_user: dados1[i].likes_user,
                                            deslikes: dados1[i].deslikes,
                                            deslikes_user: dados1[i].deslikes_user,
                                            comentario_input: "",
                                            comentario: comentarios
                                        }
                                    }
                                ])
        
                                if (dados1.length - 1 === i) {
                                    setDados(copiar => ({
                                        ...copiar,
                                        msg_infor: lista_mensagens,
                                    }))
                                }  
                            })
        
                        // }))
                    }
    
                    setDados(copiar => ({
                        ...copiar,
                        flag: dados.flag += 1,
                    }))
                }
            })

        } else {

            fetch(`http://${server}:3000/pegar__mensagens__compartilhada?id_user=${localStorage.getItem("id")}&id_msg=${parametos[1]}`).then(dados1 => dados1.json()).then(dados1 => {
            
                if (dados.flag == 0) {    
                    // fetch(`http://${server}:3000/pegar__midia__mensagens?id=${parametos[1]}`).then(arquivos => arquivos.json().then(arquivos => {             
                        fetch(`http://${server}:3000/pegar_comentarios?id_msg=${dados1[0].id}`).then(comentarios => comentarios.json()).then(comentarios => {
                            
                            let index = 0

                            index += 1

                            contado += 1
        
                            let data = dados1[0].data_de_publicacao.split("T")
        
                            data = data[0].split("-")
                            data = data.reverse()
                            data = data[0] + "/" + data[1] + "/" + data[2]

                            // Pegar as fotos e videos da imagem
        
                            // Fotos das imagens
                            let fotos = []
        
                            // for (let i = 0; i < arquivos[0]["fotos"].length; i++) {
                            //     fotos.push(
                            //         <img key={i} onClick={(e) => {
                            //             flag_foto = true
                            //             caminho_foto = `http://${server}:3000/pegar__fotos__videos__mensagens?tipo=foto&url=${arquivos[0]["fotos"][i]}`

                            //             abrir_janela_apagar_mensagem()
                            //         }} className={estilos.foto__mensagem} src={`http://${server}:3000/pegar__fotos__videos__mensagens?tipo=foto&url=${arquivos[0]["fotos"][i]}`}/>)
                            // }

                            let videos = []

                            // for (let i = 0; i < arquivos[1]["videos"].length; i++) {
                            //     videos.push(
                            //         <video key={i} className={estilos.videos__mensagem} controls>
                            //             <source src={`http://${server}:3000/pegar__fotos__videos__mensagens?tipo=foto&url=${arquivos[1]["videos"][i]}`}/>
                            //         </video>
                            //     )
                            // }

                            lista_mensagens = []
                            
                            lista_mensagens.push(
                            [
                                {
                                    [0]: {
                                        id: 0,
                                        // id_msg e o id da mensagem
                                        id_msg: dados1[0].id,
                                        usuario: dados1[0].usuario,
                                        nome: dados1[0].nome,
                                        foto_de_perfil: dados1[0].foto_de_perfil,
                                        data_de_publicacao: data,
                                        texto_da_mensagem: dados1[0].texto_da_mensagem,
                                        fotos: [fotos],
                                        videos: [videos],
                                        likes: dados1[0].likes,
                                        likes_user: dados1[0].likes_user,
                                        deslikes: dados1[0].deslikes,
                                        deslikes_user: dados1[0].deslikes_user,
                                        comentario_input: "",
                                        comentario: comentarios
                                    }
                                }
                            ])

                            setDados(copiar => ({
                                ...copiar,
                                msg_infor: lista_mensagens,
                                envio__mensagens: [],
                                flag: dados.flag += 1,
                            }))
                        })
    
                    // }))
                }
            })
        }

    }, [])

    useEffect(() => {
        console.log(dados.msg_infor)

    }, [dados.msg_infor])

    return (
        <div className="corpo">

            {/* Area de comparthila mensagem */}
            <div className={`${estilos.container__compartilhar__mensagem} ${dados.janela_comparthilar_msg.abrir_fechar_janela}`} style={dados.janela_comparthilar_msg.margin_janela_compartilhar_mensagem}>
                <div className={estilos.container__compartilhar__mensagem__topo}>
                    {/* botão de excluir a mensagem */}
                    <input onClick={() => {abrir_janela_compartilhar_mensagem()}} className={estilos.container__compartilhar__mensagem__botao} type="button" value="X" />
                </div>

                <div className={estilos.container__compartilhar__mensagem__corpo}>
                    <button onClick={() => {
                        copy(`http://localhost:5173/home?msg=${dados.id_mensagem}`)
                        alert("Link da mensagem copiado")
                        }} className={estilos.compartilhar__botao__com__icone__das__redes__sociais}>
                        
                        <img className={estilos.compartilhar__botao__com__icone__das__redes__sociais__icone} src={copiar_link} />
                        <p>Copiar link</p>
                    </button>

                    <WhatsappShareButton url={`http://localhost:5173/home?msg=${dados.id_mensagem}`} className={estilos.compartilhar__botao__com__icone__das__redes__sociais}>
                        <WhatsappIcon />
                        <p>Whatsapp</p>
                    </WhatsappShareButton>

                    <TwitterShareButton url={`http://localhost:5173/home?msg=${dados.id_mensagem}`} className={estilos.compartilhar__botao__com__icone__das__redes__sociais}>
                        <XIcon/>
                        <p>X</p>
                    </TwitterShareButton>

                    <EmailShareButton url={`http://localhost:5173/home?msg=${dados.id_mensagem}`} className={`${estilos.compartilhar__botao__com__icone__das__redes__sociais} ${estilos.compartilhar__botao__com__icone__das__redes__sociais__email}`}>
                        <EmailIcon/>
                        <p>Email</p>
                    </EmailShareButton>
                </div>
            </div>

            {/* Janela de deletar conta */}
            <div id="deletar" className={estilos_config.del} style={{"height": `${dados.janela_apagar_msg.alturar_largura_deleta_conta}vh`, "width": `${dados.janela_apagar_msg.alturar_largura_deleta_conta}vw`}}>

                <img onClick={() => abrir_janela_apagar_mensagem()} className={estilos.foto__mensagem__zoom} src={dados.janela_apagar_msg.diretorio} alt=" " style={dados.janela_apagar_msg.largura__foto}/>

                <div className={estilos_config.del__box} style={dados.janela_apagar_msg.container__apagar__mensagem}>
                    <div className={estilos_config.del__box__text} style={dados.janela_apagar_msg.font__paragrafo}>
                        <p className={estilos_config.del__box__paragrafo} style={{"fontSize": dados.janela_apagar_msg.font__paragrafo}}>Essa ação não podera se desfeita</p>
                    </div>

                    <div className={estilos_config.del__box__botoes}>
                        <input onClick={() => {
                            abrir_janela = false
                            abrir_janela_apagar_mensagem()}} 
                        className={estilos_config.del__box__input} style={dados.janela_apagar_msg.font__paragrafo} id="deletar" type="button" value="Cancelar" />
                        
                        <input onClick={(e) => apagar_mensagem(e)} className={`${estilos_config.del__box__input} ${estilos_config.del__box__input__apagar}`} style={dados.janela_apagar_msg.font__paragrafo} type="button" value="Apagar" />
                    </div>
                </div>
            </div>

            <nav className="menu">
                <p className="logo">Memorys</p>
                <input tabIndex={0} id="nome" onChange={(e) => pegar_dados(e)} onKeyDown={(e) => procurar_usuario(e)} className="buscar" type="search" />
                
                <a href="/perfil">
                    <img className="foto_perfil" src={`http://${server}:3000/pegar__foto?id=${localStorage.getItem("id")}`} alt="Foto de perfil" />
                </a>
            </nav>

            <div className={estilos.corpo2}>
                <div className={estilos.perfis__usuário}>
                    <p className={estilos.mensagens__seguindo_pc}>Ver lista de <a href="/">pessoas que você segue completa</a></p>

                    <a className={estilos.perfil} href="/">
                        <div className={estilos.perfil1}>
                            <img className={estilos.perfil__foto} src="https://media.tenor.com/Lk6mMX3yHqUAAAAd/little-witch-academia-atsuko-kagari.gif" alt="foto de perfil" />

                            <p className={estilos.perfil__user__name}>JacyelGamer2</p>
                        </div>
                    </a>

                </div>

                {/* Parte de envio de mensagens e observar as mensagens do feed */}
                <div className={estilos.mensagens}>
                    
                    <>
                        <p className={`${estilos.mensagens__seguindo} ${estilos.mensagens__seguindo_android}`}>Ver lista de <a href="/">pessoas que você segue completa</a></p>

                        {/* Formulario para enviar as mensagens */}

                        <form className={estilos.enviar__mensagens} onSubmit={(e) => enviar_mensagem(e)}>

                            <textarea className={estilos.enviar__mensagens__campor__escrita} id="texto" onChange={(e) => pegar_dados(e)} placeholder="Escreva algo:"></textarea>

                            <input className={estilos.enviar__mensagens__botao} type="submit" value="Enviar" />
                        
                            <div className={estilos.container__box}>
                                <div className={estilos.container__box__foto}>

                                    <img className={estilos.container__box__foto__name} src={fotos} alt="Icone de fotos" />
                                
                                    <input className={estilos.container__box__foto__file} type="file" name="" id="" multiple/>

                                </div>

                                <div className={estilos.container__box__foto}>

                                    <img className={estilos.container__box__foto__name} src={video} alt="Icone de fotos" />
                                
                                    <input className={estilos.container__box__foto__file} type="file" name="" id="" multiple/>
                                
                                </div>
                            </div>
                        </form>
                    </>

                    {dados.msg_infor.map((mensagem, index) => (
                        // console.log(mensagem[0][index]["fotos"][0], mensagem[0][index]["fotos"][0].length)

                        <div key={index} className={estilos.container__mensagem}>
                            {/* Mensagem dos usuários */}
        
                            <div className={estilos.container__mensagem__cabecalho}>
                                {/* Foto de perfil */}
                                <div className={estilos.container__mensagem__cabecalho__foto}>
                                    <a href="/">
                                        <img className={estilos.container__mensagem__cabecalho__foto__perfil} src={`http://${server}:3000/pegar__fotos__perfil?link=${mensagem[0][index]["foto_de_perfil"]}`} alt="Foto de perfil" />
                                    </a>
                                </div>
        
                                {/* Nome do usuário */}
                                <div className={estilos.container__mensagem__user__name}>
                                    <p>{mensagem[0][index]["nome"]}</p>
                                </div>
        
                                {/* Data de publicação */}
                                <div className={estilos.container__mensagem__data}>
                                    <p>{mensagem[0][index]["data_de_publicacao"]}</p>
                                </div>

                                {/* botão de excluir a mensagem */}
                                {mensagem[0][index]["usuario"] ? 
                                    <input onClick={() => {
                                        abrir_janela = true,

                                        setDados(copiar => ({
                                            ...copiar,
                                            id_mensagem: mensagem[0][index]["id_msg"]
                                        }))

                                        abrir_janela_apagar_mensagem()
                                    }} className={estilos.container__mensagem__botao__excluir} type="button" value="X" />

                                    :
                                    <input onClick={() => {
                                        abrir_janela = true,

                                        setDados(copiar => ({
                                            ...copiar,
                                            id_mensagem: mensagem[0][index]["id_msg"]
                                        }))

                                        abrir_janela_apagar_mensagem()
                                    }} className={estilos.container__mensagem__botao__excluir__invisivel} type="button" value="X" />
                                }

                            </div>
        
                            <div className={estilos.container__mensagem__corpo__msg}>
                                <div className={estilos.container__mensagem__corpo}>
                                    <p>{mensagem[0][index]["texto_da_mensagem"]}</p>
                                </div>
                            </div>
        
                            {/* Area aonde ficar as fotos e vidéos */}
                            {mensagem[0][index]["fotos"][0].length === 0 && mensagem[0][index]["videos"][0].length === 0 ? 
                                // if não existir fotos e videos
                                <div className={estilos.container__foto__mensagem} style={{"height": "2dvh"}}>
                                    {mensagem[0][index]["fotos"]}
                                    {mensagem[0][index]["videos"]}
                                </div>

                                :
                                // else
                                <div className={estilos.container__foto__mensagem}>
                                    {mensagem[0][index]["fotos"]}
                                    {mensagem[0][index]["videos"]}
                                </div>
                            }

                            <form onSubmit={(e) => like(e, flag_infor_comentarios)}>
                                <div className={estilos.container__mensagem__avaliacao}>
                                                
                                    {/* likes */}
                                    {mensagem[0][index]["likes_user"] ? 
                                        // if like estive selecionado
                                        <input onClick={() => {like_deslike = "like"; flag_comentarios = false}} id={[mensagem[0][index]["id_msg"], mensagem[0][index]["id"], index]} className={estilos.container__mensagem__avaliacao__like__deslike__selecionado} type="submit" value={`Like: ${mensagem[0][index]["likes"]}`}/>
                                        
                                    :   // else
                                        <input onClick={() => {like_deslike = "like"; flag_comentarios = false}} id={[mensagem[0][index]["id_msg"], mensagem[0][index]["id"], index]} className={estilos.container__mensagem__avaliacao__like__deslike} type="submit" value={`Like: ${mensagem[0][index]["likes"]}`}/>
                                    
                                    }

                                    {/* deslikes */}
                                    {mensagem[0][index]["deslikes_user"] ? 
                                        // if deslike estive selecionado
                                        <input onClick={() => {like_deslike = "deslike"; flag_comentarios = false}} id={[mensagem[0][index]["id_msg"], index]} className={estilos.container__mensagem__avaliacao__like__deslike__selecionado} type="submit" value={`Deslikes: ${mensagem[0][index]["deslikes"]}`}/>
                                        
                                    :   // else
                                        <input onClick={() => {like_deslike = "deslike"; flag_comentarios = false}} id={[mensagem[0][index]["id_msg"], index]} className={estilos.container__mensagem__avaliacao__like__deslike} type="submit" value={`Deslikes: ${mensagem[0][index]["deslikes"]}`}/>
                                    
                                    }
            
                                    <input onClick={e => flag_comentarios = true} className={`${estilos.container__box__foto} ${estilos.container__comentario__botao}`} type="submit" value="Comentarios" />

                                    <div onClick={() => {
                                        setDados(copiar => ({
                                            ...copiar,
                                            id_mensagem: mensagem[0][index]["id_msg"]
                                        }))

                                        abrir_janela_compartilhar_mensagem()

                                    }} className={estilos.container__box__foto}>
            
                                        <img className={`${estilos.container__box__foto__name} ${estilos.container__mensagem__avaliacao__compartilhar}`} src={compartilhar} alt="Icone compartilhar" />
                                                                
                                    </div>
                                </div>

                                <div className={estilos.box__comentarios__desativo}>

                                    <div className={estilos.comentarios__view}>

                                        {/* Comentarios */}
                                        {dados.msg_infor[index][0][index]["comentario"].map( (comentario, index_comentario ) => (

                                            <div key={index_comentario} className={estilos.comentario__box}>
                                                <div className={estilos.comentario__box__infor__usuario}>

                                                    {/* Foto de perfil */}
                                                    <a href="/">
                                                        {/* <img className={estilos.container__mensagem__cabecalho__foto__perfil} src={`http://${server}:3000/pegar__fotos__perfil?link=${mensagem[0][index]["foto_de_perfil"]}`} alt="Foto de perfil" /> */}
                                                        <img className={estilos.comentario__box__foto} src={`http://${server}:3000/pegar__fotos__perfil?link=${mensagem[0][index]["foto_de_perfil"]}`} alt="Foto de perfil" />
                                                    </a>
                            
                                                    {/* Nome do usuário */}


                                                    <p className={estilos.comentario__box__nome__usuario}></p>

                                                    <input className={estilos.comentario__box__botao__excluir__comentario} type="button" value="X" />
                                                </div>

                                                {/* Mensagem do comentario */}
                                                <div className={estilos.comentario__box__campo__texto__correcao__top}>
                                                    <div className={estilos.comentario__box__campo__texto}>
                                                        <p className={estilos.comentario__box__campo__texto__paragrafo}>{comentario["texto_da_mensagem"]}</p>
                                                    </div>
                                                </div>
                                                
                                                {/* Botões de comentarios */}
                                                <div className={estilos.comentario__box__submit}>
                                                    <input className={estilos.comentario__box__submit__input__texto__desativo} type="text" />
                                                    <input className={estilos.comentario__box__submit__enviar__desativo} type="button" value="Enviar" />
                                                    {/* O botão de cancelar e o botão de responde mensagem possui o botão que foi clicado um espaço e o id na lista de elementos do botão de responde */}
                                                    <input id={`botão_cancelar ${7 * (index_comentario + 1)}`} onClick={(e) => {

                                                        flag_comentarios = "responde"

                                                        flag_infor_comentarios = e.target.id

                                                        }} className={estilos.comentario__box__submit__enviar__desativo} type="submit" value="Cancelar" />

                                                    <input id={`botão_responde ${7 * (index_comentario + 1)}`} onClick={(e) => {

                                                        flag_comentarios = "responde"

                                                        flag_infor_comentarios = e.target.id

                                                        }} className={estilos.comentario__box__submit__responde__ativo} type="submit" value="Responde" />
                                                    
                                                    <input id="botão_ver_respostas true" onClick={e => {

                                                        flag_comentarios = "ver_respostas"

                                                        flag_infor_comentarios = e.target.id + ` ${index_comentario}`

                                                    }} className={`${estilos.comentario__box__submit__responde__ativo} ${estilos.comentario__box__submit__ver__respostas__ativo}`} type="submit" value="Ver respostas" />
                                                </div>

                                                {/* Resposta a comentarios */}
                                                <div className={estilos.respostas__a__comentarios__fundo} style={{"height": "0px"}}>
                                                    <div className={estilos.respostas__a__comentarios}>
                                                        <div className={estilos.comentario__box__infor__usuario}>

                                                            {/* Foto de perfil */}
                                                            <a href="/">
                                                                <img className={estilos.comentario__box__foto} src={`http://${server}:3000/pegar__fotos__perfil?link=${mensagem[0][index]["foto_de_perfil"]}`} alt="Foto de perfil" />
                                                            </a>
                                    
                                                            {/* Nome do usuário */}
                                                            <p className={estilos.comentario__box__nome__usuario}>{mensagem[0][index]["nome"]}</p>

                                                            <input className={estilos.comentario__box__botao__excluir__comentario} type="button" value="X" />
                                                        </div>

                                                        <div className={estilos.comentario__box__campo__texto}>
                                                            <p className={estilos.comentario__box__campo__texto__paragrafo}>Aqui vai ficar a mensagem</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        ))}

                                    </div>

                                    {/* Enviar comentarios */}
                                    <div className={estilos.enviar__comentario}>
                                        <input onChange={e => pegar_dados(e)} className={estilos.enviar__comentario__input__desativo} id={`comentario ${index}`} type="text" placeholder="Adicione um comentario a esse post" value={mensagem[0][index]["comentario_input"]} />
                                        
                                        <input onClick={(e) => enviar__comentario(e, index)} className={estilos.enviar__comentario__botao__desativo} type="submit" value="Enviar" />
                                    </div>

                                </div>

                            </form>
                        </div>
                    ))}

                </div>

                {/* Minhas redes sociais */}
                <div className={estilos.perfis__usuário}>

                    <p style={{"fontSize": "140%"}} className={estilos.mensagens__seguindo_pc}><strong>Minhas redes sociais:</strong></p>

                    {/* Instagram */}

                    <a className={estilos.perfil} href="https://www.instagram.com/jacyelpablo/">
                        <div className={estilos.perfil1}>
                            <img style={{"borderRadius": "0em", "height": "50px", "width": "50px"}} className={estilos.perfil__foto} src="https://th.bing.com/th/id/R.1c4afc1e38fa2de56562b3582742d1bb?rik=32v30LcaKNVjLw&pid=ImgRaw&r=0" alt="icone do instagram" />

                            <p className={estilos.perfil__user__name}>@jacyelpablo</p>
                        </div>
                    </a>
                    
                    {/* Facebook */}

                    <a className={estilos.perfil} href="https://www.facebook.com/jacyel.lopes.5/">
                        <div className={estilos.perfil1}>
                            <img style={{"borderRadius": "0em", "height": "50px", "width": "50px"}} className={estilos.perfil__foto} src="https://cdn.pixabay.com/photo/2021/08/10/17/03/facebook-6536473_1280.png" alt="icone do facebook" />

                            <p className={estilos.perfil__user__name}>@jacyel.lopes.5</p>
                        </div>
                    </a>

                    {/* Facebook */}

                    <a className={estilos.perfil} href="https://x.com/JacyelPablo">
                        <div className={estilos.perfil1}>
                            <img style={{"borderRadius": "0em", "height": "50px", "width": "50px"}} className={estilos.perfil__foto} src="https://th.bing.com/th/id/OIP.OiRP0Wt_nlImTXz5w45aRQHaHa?rs=1&pid=ImgDetMain" alt="icone do x" />

                            <p className={estilos.perfil__user__name}>@JacyelPablo</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}