import estilos from "../css/index.module.css"
import { useEffect, useState } from "react"

export default function Alterar_senha(props)
{
    const [ dados, setDados ] = useState({
        password: "",
        password1: "",
        id: ""
    })

    const server = props.server

    function pegar_dados(e)
    {
        setDados({
            ...dados,
            [e.target.name]: e.target.value
        })
    }

    function enviar_senha()
    {
        if (dados.password === dados.password1) {
            fetch(`${server}/alterar__senha`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)

            }).then(res => res.json()).then(res => {
                alert(res[1])

                if (res[0] === true) {
                    location.href = "/"
                }
            })

        } else {
            alert("As duas senhas inseridas são diferentes")
        }
    }

    useEffect(() => {
        let id = new URLSearchParams(window.location.search).toString().split("=")
        id = id[1]

        if (id === undefined) {
            alert("Dados do usuário não encotrado")
            location.href = "/"

        } else {
            setDados({
                ...dados,
                id: id
            })
        }

    }, [])

    return (
        <div className={estilos.corpo}>
            <form className={estilos.container}>
                <h1 className={estilos.container__titulo}>Alterar senha</h1>

                <p className={estilos.container__textos}>Insira uma nova senha:</p>
                <input onChange={e => pegar_dados(e)} className={estilos.container__campos} type="password" name="password" placeholder="Insira uma nova senha:" />

                <p className={estilos.container__textos}>Confirme sua senha:</p>
                <input onChange={e => pegar_dados(e)} className={estilos.container__campos} type="password" name="password1" placeholder="Confirme sua senha:" />

                <input onClick={() => enviar_senha()} className={`${estilos.container__campos} ${estilos.container__botao__entrar}`} type="button" value="Enviar" />
            </form>
        </div>
    )
}