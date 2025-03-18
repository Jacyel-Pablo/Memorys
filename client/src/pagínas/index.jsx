import estilos from "../css/index.module.css"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function Index()
{
    const [ dados, setDados ] = useState({
        esqueceu_senha_p: "Esqueceu sua ",
        esqueceu_senha_a: "senha",

        email: "",
        senha: ""
    })

    function pegar_dados(e)
    {
        setDados(copiar => ({
            ...copiar,
            [e.target.name]: e.target.value
        }))
    }

    async function enviar_dados(e)
    {
        e.preventDefault()

        if (dados.email.length <= 0 || dados.senha.length <= 0) {
            alert("Os campos não podem se vazios")

        } else if (dados.email.length <= 2 || dados.senha.length <= 2) {
            alert("Os campos precisam ter pelo menos 3 caracteres")

        } else {
            fetch(`http://localhost:3000/login?email=${dados.email}&senha=${dados.senha}`).then(resposta => resposta.json()).then(resposta => {
                if (resposta[0] === true) {
                    localStorage.setItem("token", resposta[1])
                    localStorage.setItem("email", dados.email)
                    location.href = "/home"
    
                } else {
                    alert("Email ou senha incorretos!")
                    e.target.reset()
                }
            })
        }
    }

    return (
        <div className={estilos.corpo}>
            <form className={estilos.container} onSubmit={(e) => enviar_dados(e)}>
                <h1 className={estilos.container__titulo}>Login</h1>

                <p className={estilos.container__textos}>Email:</p>
                <input className={estilos.container__campos} type="email" name="email" onChange={(e) => pegar_dados(e)} placeholder="Insira um email:" />

                <p className={estilos.container__textos}>Senha:</p>
                <input className={estilos.container__campos} type="password" name="senha" onChange={(e) => pegar_dados(e)} placeholder="Insira uma senha:" />

                <p className={estilos.container__esqueceu__senha}>{dados.esqueceu_senha_p} <a href="/">{dados.esqueceu_senha_a}</a></p>

                <input className={`${estilos.container__campos} ${estilos.container__botao__entrar}`} type="submit" value="Entrar" />
                
                <a href="/criar_conta">
                    <input className={`${estilos.container__campos} ${estilos.container__botao__criar__conta}`} type="button" value="Criar conta" />
                </a>

            </form>
        </div>
    )
}