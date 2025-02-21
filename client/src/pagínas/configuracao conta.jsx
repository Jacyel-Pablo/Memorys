import estilos from "../css/configuracao conta.module.css"
import estilos2 from "../css/home.module.css"
import lapis from "../assets/Lapis icone.png"
import { useState } from "react"

export default function Configuracao_conta()
{

    const [ dados, setDados] = useState({
        alturar_largura_deleta_conta: "0",
        input__file__h_w: "100",
        font__paragrafo: "0",
        contado: 0
    })

    function deletar__conta__confirmacao(e)
    {
        if (e.target.id === "deletar") {
            setDados(copiar => ({
                ...copiar,
                contado: dados.contado + 1
            }))
    
            if (dados.contado % 2 != 0) {
                setDados(copiar => ({
                    ...copiar,
                    alturar_largura_deleta_conta: 100,
                    input__file__h_w: 0,
                    font__paragrafo: "120%"
                }))
    
            } else {
                setDados(copiar => ({
                    ...copiar,
                    alturar_largura_deleta_conta: 0,
                    input__file__h_w: 100,
                    font__paragrafo: "0%"
                }))
            }
        }
    }

    return(
        <div className="corpo">
            {/* Essa div vai aparece após o botão de deletar conta for pressionado */}
            <div onClick={(e) => deletar__conta__confirmacao(e)} id="deletar" className={estilos.del} style={{"height": `${dados.alturar_largura_deleta_conta}vh`, "width": `${dados.alturar_largura_deleta_conta}vw`}}>
                <div className={estilos.del__box}>
                    <div className={estilos.del__box__text}>
                        <p className={estilos.del__box__paragrafo} style={{"fontSize": dados.font__paragrafo}}>Essa ação não podera se desfeita</p>
                    </div>

                    <div className={estilos.del__box__botoes}>
                        <input className={estilos.del__box__input} onClick={(e) => deletar__conta__confirmacao(e)} id="deletar" type="button" value="Cancelar" />
                        
                        <input className={`${estilos.del__box__input} ${estilos.del__box__input__apagar}`} type="button" value="Apagar" />
                    </div>
                </div>
            </div>

            <nav className="menu">
                <p className="logo">Memorys</p>
                <input className="buscar" type="search" />
                
                <a href="/perfil">
                    <img className="foto_perfil" src="https://media.tenor.com/Lk6mMX3yHqUAAAAd/little-witch-academia-atsuko-kagari.gif" alt="Foto de perfil" />
                </a>
            </nav>
            
            <div className={estilos.corpo2}>
                {/* Primeira parte do grid */}
                <div className={estilos.container1}>
                    <div className={estilos.container1__1}>
                        <h1 className={estilos.container1__titulo}>Configurações:</h1>

                        <img className={estilos.container1__foto__perfil} src="https://media.tenor.com/Lk6mMX3yHqUAAAAd/little-witch-academia-atsuko-kagari.gif" alt="Foto de perfil" />
                        
                        <div className={estilos.container1__editar__foto}>
                            <img className={estilos.container1__editar__foto__lapis} src={lapis} alt="Editar foto" />

                            <input style={{"height": `${dados.input__file__h_w}%`, "width": `${dados.input__file__h_w}%`}} className={estilos.container1__editar__foto__file} type="file" name="" id="" />
                        </div>

                        {/* Campo do nome do usuário */}

                        <div className={estilos.user__name}>
                            <p>JacyelGamer2</p>
                            {/* Input de renomeia */}
                            <input style={{"width": "0%", "border": "0 none"}} type="text" />
                            
                            <img onClick={() => alert("alterar nome")} src={lapis} alt="Trocar nome" />
                        </div>

                        <input className={estilos.botao__sair} type="button" value="Sair" />

                        <div style={{"textAlign": "left"}}>
                            <p>Essa ação vai remove <br/>
                               está conta do atual <br/>
                               dispositivo.</p>
                        </div>

                        <p className={estilos.texto__apagar__conta__mobile}>Deleta conta</p>

                        <input onClick={(e) => deletar__conta__confirmacao(e)} id="deletar" className={estilos.botao__apagar__conta__mobile} type="button" value="Apagar" />

                    </div>
                </div>

                {/* Segunda parte do grid */}
                <div className={estilos.container2}>
                    <p className={`${estilos.texto__apagar__conta__mobile} ${estilos.texto__apagar__conta__pc}`}>Deleta conta</p>

                    <input onClick={(e) => deletar__conta__confirmacao(e)} className={`${estilos.botao__apagar__conta__mobile} ${estilos.botao__apagar__conta__pc}`} id="deletar" type="button" value="Apagar" />
                </div>

                {/* Redes sociais */}
                <div>
                    {/* Instagram */}

                    <a style={{"marginTop": "20%"}} className={estilos2.perfil} href="https://www.instagram.com/jacyelpablo/">
                        <div className={estilos2.perfil1}>
                            <img className={`${estilos2.perfil__foto} ${estilos.perfil__foto__remover}`} src="https://th.bing.com/th/id/R.1c4afc1e38fa2de56562b3582742d1bb?rik=32v30LcaKNVjLw&pid=ImgRaw&r=0" alt="icone do instagram" />

                            <p className={estilos2.perfil__user__name}>@jacyelpablo</p>
                        </div>
                    </a>
                    
                    {/* Facebook */}

                    <a className={estilos2.perfil} href="https://www.facebook.com/jacyel.lopes.5/">
                        <div className={estilos2.perfil1}>
                            <img className={`${estilos2.perfil__foto} ${estilos.perfil__foto__remover}`} src="https://cdn.pixabay.com/photo/2021/08/10/17/03/facebook-6536473_1280.png" alt="icone do facebook" />

                            <p className={estilos2.perfil__user__name}>@jacyel.lopes.5</p>
                        </div>
                    </a>

                    {/* Facebook */}

                    <a className={estilos2.perfil} href="https://x.com/JacyelPablo">
                        <div className={estilos2.perfil1}>
                            <img className={`${estilos2.perfil__foto} ${estilos.perfil__foto__remover}`} src="https://th.bing.com/th/id/OIP.OiRP0Wt_nlImTXz5w45aRQHaHa?rs=1&pid=ImgDetMain" alt="icone do x" />

                            <p className={estilos2.perfil__user__name}>@JacyelPablo</p>
                        </div>
                    </a>
                </div>

            </div>

        </div>
    )
}