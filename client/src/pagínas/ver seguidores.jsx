import estilos from "../css/ver seguidores.module.css"
import estilos2 from "../css/home.module.css"

export default function Ver_seguidores()
{
    return (
        <div className="corpo">
            <nav className="menu">
                <p className="logo">Memorys</p>
                <input className="buscar" type="search" />
                
                <a href="/perfil">
                    <img className="foto_perfil" src="https://media.tenor.com/Lk6mMX3yHqUAAAAd/little-witch-academia-atsuko-kagari.gif" alt="Foto de perfil" />
                </a>
            </nav>

            <div className={estilos.corpo2}>
                <div className={estilos.container1}>

                    <a className={estilos.user} href="/">
                        <div className={estilos.user__infor}>
                            <img className={estilos.user__infor__foto} src="https://media.tenor.com/Lk6mMX3yHqUAAAAd/little-witch-academia-atsuko-kagari.gif" alt="Foto de perfil" />

                            <p>JacyelGamer2</p>

                            <div className={estilos.user__infor__data}>
                                <p className={estilos.user__infor__data__valor}>04/02/2025</p>
                            </div>
                        </div>
                    </a>

                </div>

                <div>
                    <p className={`${estilos2.mensagens__seguindo_pc} ${estilos.redes__sociais__textos}`}><strong>Minhas redes sociais:</strong></p>

                    {/* Instagram */}

                    <a className={estilos2.perfil} href="https://www.instagram.com/jacyelpablo/">
                        <div className={estilos2.perfil1}>
                            <img className={estilos2.perfil__foto} src="https://th.bing.com/th/id/R.1c4afc1e38fa2de56562b3582742d1bb?rik=32v30LcaKNVjLw&pid=ImgRaw&r=0" alt="icone do instagram" />

                            <p className={estilos2.perfil__user__name}>@jacyelpablo</p>
                        </div>
                    </a>

                    {/* Facebook */}

                    <a className={estilos2.perfil} href="https://www.facebook.com/jacyel.lopes.5/">
                        <div className={estilos2.perfil1}>
                            <img className={estilos2.perfil__foto} src="https://cdn.pixabay.com/photo/2021/08/10/17/03/facebook-6536473_1280.png" alt="icone do facebook" />

                            <p className={estilos2.perfil__user__name}>@jacyel.lopes.5</p>
                        </div>
                    </a>

                    {/* x */}

                    <a className={estilos2.perfil} href="https://x.com/JacyelPablo">
                        <div className={estilos2.perfil1}>
                            <img className={estilos2.perfil__foto} src="https://th.bing.com/th/id/OIP.OiRP0Wt_nlImTXz5w45aRQHaHa?rs=1&pid=ImgDetMain" alt="icone do x" />

                            <p className={estilos2.perfil__user__name}>@JacyelPablo</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}