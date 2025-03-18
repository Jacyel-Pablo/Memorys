import { useState, useEffect } from "react";

export default function Ativar__conta()
{
    const [ ativo, setAtivo ] = useState("Ocorreu um erro ao ativar sua conta!")

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get("id")

        fetch(`http://localhost:3000/ativar__conta?id=${id}`, {
            method: "PUT"
        }).then(resposta => resposta.json()).then(resposta => {
            if (resposta === true) {
                setAtivo("Sua conta foi ativada com sucesso!")

            } else {
                setAtivo("Ocorreu um erro ao ativar sua conta!")
            }
        })
    }, [])

    return (<p>{ativo}</p>)
}