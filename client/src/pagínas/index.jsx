import estilos from "../css/index.module.css"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Index(props)
{
    const [ dados, setDados ] = useState({
        email: "",
        senha: "",

        msg: localStorage.getItem("msg"),

        redefinir_senha: false,
    })

    const server = props.server

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
            fetch(`${server}/login?email=${dados.email}&senha=${dados.senha}`).then(resposta => resposta.json()).then(resposta => {
                if (resposta[0] === true) {
                    localStorage.setItem("token", resposta[1])
                    localStorage.setItem("id", resposta[2])
                    localStorage.setItem("email", dados.email)

                    if (toString(dados.msg) === "null") {
                        location.href = `/home?msg=${dados.msg}`

                    } else {
                        location.href = "/home"
                    }
    
                } else {
                    alert("Email ou senha incorretos!")
                    e.target.reset()
                }
            })
        }
    }

    function recuperar_conta(e)
    {
        fetch(`${server}/enviar__email__recuperacao`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": dados.email
            })

        }).then(res => res.json()).then(res => {
            alert(res["msg"])

            setDados({
                ...dados,
                redefinir_senha: false
            })
        })
    }

    useEffect(() => {
        localStorage.removeItem("msg")
        
    }, [dados.msg])

    return (
        <div className={estilos.corpo}>
            {dados.redefinir_senha === false ? 
                <form className={estilos.container} onSubmit={(e) => enviar_dados(e)}>
                    <h1 className={estilos.container__titulo}>Login</h1>

                    <p className={estilos.container__textos}>Email:</p>
                    <input className={estilos.container__campos} type="email" name="email" onChange={(e) => pegar_dados(e)} placeholder="Insira um email:" />

                    <p className={estilos.container__textos}>Senha:</p>
                    <input className={estilos.container__campos} type="password" name="senha" onChange={(e) => pegar_dados(e)} placeholder="Insira uma senha:" />

                    <p className={estilos.container__esqueceu__senha}>Esqueceu sua <input onClick={() => 
                    setDados({
                        ...dados,
                        email: "",
                        senha: "",
                        redefinir_senha: true,

                    })} className={estilos.esqueceu__senha} type="button" value="senha" /></p>

                    <input className={`${estilos.container__campos} ${estilos.container__botao__entrar}`} type="submit" value="Entrar" />
                    
                    <a href="/criar_conta">
                        <input className={`${estilos.container__campos} ${estilos.container__botao__criar__conta}`} type="button" value="Criar conta" />
                    </a>

                </form>
            :
                <form className={estilos.container}>
                    <h1 className={estilos.container__titulo}>Recuperação de conta</h1>

                    <p className={estilos.container__textos}>Email da conta:</p>
                    <input onChange={e => pegar_dados(e)} className={estilos.container__campos} type="email" name="email" placeholder="Insira o email da sua conta:" />
                    
                    <input onClick={() => recuperar_conta()} className={`${estilos.container__campos} ${estilos.container__botao__entrar}`} type="button" value="Recuperar conta" />
                </form>
            }
        </div>
    )
}