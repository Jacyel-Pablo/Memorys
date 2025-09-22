import estilos from "../css/index.module.css"
import { useState } from "react"

export default function Criar_conta(props)
{
    const [ dados, setDados] = useState({
        foto: "",
        nome: "",
        email: "",
        senha: ""
    })

    const server = props.server

    async function submit(e)
    {
        e.preventDefault()

        if (dados.nome.length <= 0 || dados.senha.length <= 0 || dados.senha.length <= 0) {
            alert("Os campos não podem ser vazios")

        } else if (dados.nome.length <= 2 || dados.senha.length <= 2 || dados.senha.length <= 2) {
            alert("Os campos precisam ter no minimo 3 caracteres")

        } else {
            const formData = new FormData()
            formData.append("foto", dados.foto)
            formData.append("nome", dados.nome)

            setDados(copiar => ({
                ...copiar,
                email: dados.email.toLowerCase()
            }))

            formData.append("email", dados.email)
            formData.append("senha", dados.senha)
    
            try {
                await fetch(`${server}/criar__conta`, {
                    method: "POST",
                    // headers: {
                    //     "Content-Type": "application/json",
                    // },
                    body: formData
        
                }).then(estado => estado.json()).then(estado => {
                    if (estado) {
                        alert("Usuário criado com sucesso! \n agora ative sua conta com o link do email que enviamos a você.\nser não consegui ver, vai na parte de spam")

                        location.href = "/"
        
                    } else {
                        alert("Erro ao criar usuário!\n\nTente novamente.")
                        e.target.reset()
                    }
                })

            } catch (e) {
                alert("A foto de perfil não está em um formato valido")
            }
        }
    }

    function save_data(e)
    {
        if (e.target.name == "foto") {
            setDados(copiar => ({
                ...copiar,
                [e.target.name]: e.target.files[0]
            }))

        } else {
            setDados(copiar => ({
                ...copiar,
                [e.target.name]: e.target.value
            }))
        }

    }

    return (
        <div className={estilos.corpo}>
            <form className={estilos.container} onSubmit={(e) => submit(e)}>
                <h1 className={estilos.container__titulo}>Criar conta</h1>

                {props.upload === true ?
                    <div>
                        <p className={estilos.container__textos}>Foto de perfil:</p>
                        <input className={estilos.container__escolher__arquivo} type="file" onChange={(e) => save_data(e)} name="foto" />
                    </div>
                :
                    <></>
                }

                <p className={estilos.container__textos}>Nome de usuário:</p>
                <input className={estilos.container__campos} type="text" onChange={(e) => save_data(e)} name="nome" placeholder="Insira um nome de usuário:" />

                <p className={estilos.container__textos}>Email:</p>
                <input className={estilos.container__campos} type="email" onChange={(e) => save_data(e)} name="email" placeholder="Insira um email:" />

                <p className={estilos.container__textos}>Senha:</p>
                <input className={estilos.container__campos} type="password" onChange={(e) => save_data(e)} name="senha" placeholder="Insira uma senha:" />

                <input className={`${estilos.container__botao__entrar} ${estilos.container__botao__enviar}`} type="submit" value="Enviar" />
                                
            </form>
        </div>
    )
}