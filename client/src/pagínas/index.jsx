import estilos from "../css/index.module.css"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function Index()
{
    const [ dados, setDados ] = useState({
        esqueceu_senha_p: "Esqueceu sua ",
        esqueceu_senha_a: "senha"
    })

    return (
        <div className={estilos.corpo}>
            <form className={estilos.container}>
                <h1 className={estilos.container__titulo}>Login</h1>

                <p className={estilos.container__textos}>Email:</p>
                <input className={estilos.container__campos} type="email" name="" placeholder="Insira um email:" />

                <p className={estilos.container__textos}>Senha:</p>
                <input className={estilos.container__campos} type="password" name="" placeholder="Insira uma senha:" />

                <p className={estilos.container__esqueceu__senha}>{dados.esqueceu_senha_p} <a href="/">{dados.esqueceu_senha_a}</a></p>

                <a href="/home">
                    <input className={`${estilos.container__campos} ${estilos.container__botao__entrar}`} type="button" value="Entrar" />
                </a>
                
                <a href="/criar_conta">
                    <input className={`${estilos.container__campos} ${estilos.container__botao__criar__conta}`} type="button" value="Criar conta" />
                </a>

            </form>
        </div>
    )
}