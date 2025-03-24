import estilo from "../css/perfil user.module.css"
import estilos2 from "../css/home.module.css"
import { useState, useEffect } from "react"

export default function Perfil__user()
{

    const [ dados, setDados] = useState({
        nome: ""
    })

    function nome()
    {
        fetch(`http://localhost:3000/pegar__nome?email=${localStorage.getItem("email")}`).then(nome => nome.json()).then(nome => {
            setDados(copiar => ({
                ...copiar,
                nome: nome.nome
            }))
        })
    }

    useEffect(() => {
        nome()
    }, [])

    return (
        <>
            <div className={estilo.corpo}>
                <nav className="menu">
                    <p className="logo">Memorys</p>
                    <div></div>

                    <a href="/perfil">
                        <img className="foto_perfil" src={`http://localhost:3000/pegar__foto?id=${localStorage.getItem("id")}`} alt="Foto de perfil" />
                    </a>
                </nav>

                <div className={estilo.corpo2}>

                    <div className={estilo.container__infor}>
                        <div className={estilo.container__infor__parte1}>
                            <div>
                                <img className={estilo.container__infor__foto} src={`http://localhost:3000/pegar__foto?id=${localStorage.getItem("id")}`} alt="Foto de perfil" />

                                <p>{dados.nome}</p>

                                <div className={estilo.like__deslike}>
                                    <div className={estilo.like}>
                                        <a className={estilo.like__texto} href="/ver_seguidores">Seguidores: 0</a>
                                    </div>

                                    <div className={`${estilo.like} ${estilo.deslike}`}>
                                        <a className={estilo.like__texto} href="/ver_seguidores">Seguindo: 0</a>
                                    </div>
                                </div>

                                <a href="/configuracao_conta"><input className={estilo.config__button} type="button" value="Configurações" /></a>
                            </div>

                        </div>

                        <div>
                            <p className={`${estilos2.mensagens__seguindo_pc} ${estilo.redes__sociais__texto}`}><strong>Minhas redes sociais:</strong></p>
        
                            {/* Instagram */}

                            <a className={`${estilos2.perfil} ${estilo.redes__sociais__link}`} href="https://www.instagram.com/jacyelpablo/">
                                <div className={`${estilos2.perfil1} ${estilo.redes__sociais}`}>
                                    <img className={`${estilos2.perfil__foto} ${estilo.foto__icone}`} src="https://th.bing.com/th/id/R.1c4afc1e38fa2de56562b3582742d1bb?rik=32v30LcaKNVjLw&pid=ImgRaw&r=0" alt="icone do instagram" />
        
                                    <p className={estilos2.perfil__user__name}>@jacyelpablo</p>
                                </div>
                            </a>
                            
                            {/* Facebook */}
        
                            <a className={`${estilos2.perfil} ${estilo.redes__sociais__link}`} href="https://www.facebook.com/jacyel.lopes.5/">
                                <div className={`${estilos2.perfil1} ${estilo.redes__sociais}`}>
                                    <img className={`${estilos2.perfil__foto} ${estilo.foto__icone}`} src="https://cdn.pixabay.com/photo/2021/08/10/17/03/facebook-6536473_1280.png" alt="icone do facebook" />
        
                                    <p className={estilos2.perfil__user__name}>@jacyel.lopes.5</p>
                                </div>
                            </a>
        
                            {/* Facebook */}
        
                            <a className={`${estilos2.perfil} ${estilo.redes__sociais__link}`} href="https://x.com/JacyelPablo">
                                <div className={`${estilos2.perfil1} ${estilo.redes__sociais}`}>
                                    <img className={`${estilos2.perfil__foto} ${estilo.foto__icone}`} src="https://th.bing.com/th/id/OIP.OiRP0Wt_nlImTXz5w45aRQHaHa?rs=1&pid=ImgDetMain" alt="icone do x" />
        
                                    <p className={estilos2.perfil__user__name}>@JacyelPablo</p>
                                </div>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}