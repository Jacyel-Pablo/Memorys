import estilos from "../css/home.module.css"
import fotos from "../assets/foto icone.png"
import video from "../assets/video icone.png"
import compartilhar from "../assets/compartilhar icone.png"

export default function Home()
{

    return (
        <div className="corpo">
            <nav className="menu">
                <p className="logo">Memorys</p>
                <input className="buscar" type="search" />
                
                <a href="/perfil">
                    <img className="foto_perfil" src={`http://localhost:3000/pegar__foto?email=${localStorage.getItem("email")}`} alt="Foto de perfil" />
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

                <div className={estilos.mensagens}>
                    <p className={`${estilos.mensagens__seguindo} ${estilos.mensagens__seguindo_android}`}>Ver lista de <a href="/">pessoas que você segue completa</a></p>

                    {/* Formulario para enviar as mensagens */}

                    <form className={estilos.enviar__mensagens}>

                        <textarea className={estilos.enviar__mensagens__campor__escrita} name="" placeholder="Escreva algo:"></textarea>

                        <input className={estilos.enviar__mensagens__botao} type="submit" value="Enviar" />
                    
                        <div className={estilos.container__box}>
                            <div className={estilos.container__box__foto}>

                                <img className={estilos.container__box__foto__name} src={fotos} alt="Icone de fotos" />
                            
                                <input className={estilos.container__box__foto__file} type="file" name="" id="" />

                            </div>

                            <div className={estilos.container__box__foto}>

                                <img className={estilos.container__box__foto__name} src={video} alt="Icone de fotos" />
                            
                                <input className={estilos.container__box__foto__file} type="file" name="" id="" />
                            
                            </div>
                        </div>
                    </form>
                    
                    {/* Mensagem dos usuários */}

                    <div className={estilos.container__mensagem}>
                        <div className={estilos.container__mensagem__cabecalho}>
                            {/* Foto de perfil */}
                            <div className={estilos.container__mensagem__cabecalho__foto}>
                                <a href="/">
                                    <img className={estilos.container__mensagem__cabecalho__foto__perfil} src="https://media.tenor.com/Lk6mMX3yHqUAAAAd/little-witch-academia-atsuko-kagari.gif" alt="Foto de perfil" />
                                </a>
                            </div>

                            <div className={estilos.container__mensagem__user__name}>
                                <p>JacyelGamer2</p>
                            </div>

                            <div className={estilos.container__mensagem__data}>
                                <p>03/02/2025</p>
                            </div>
                        </div>

                        <div className={estilos.container__mensagem__corpo__msg}>
                            <div className={estilos.container__mensagem__corpo}>
                                <p>Olá blz</p>
                            </div>
                        </div>
                        
                        <div className={estilos.container__mensagem__avaliacao}>
                            
                            <input className={estilos.container__mensagem__avaliacao__like__deslike} type="button" value="Like: 0"/>

                            <input className={estilos.container__mensagem__avaliacao__like__deslike} type="button" value="Deslikes: 0"/>

                            <div className={estilos.container__box__foto}>

                                <img className={`${estilos.container__box__foto__name} ${estilos.container__mensagem__avaliacao__compartilhar}`} src={compartilhar} alt="Icone compartilhar" />
                                                        
                            </div>
                        </div>
                    </div>

                    {/* Mensagem dos usuários */}

                    <div className={estilos.container__mensagem}>
                        <div className={estilos.container__mensagem__cabecalho}>
                            {/* Foto de perfil */}
                            <div className={estilos.container__mensagem__cabecalho__foto}>
                                <a href="/">
                                    <img className={estilos.container__mensagem__cabecalho__foto__perfil} src="https://media.tenor.com/Lk6mMX3yHqUAAAAd/little-witch-academia-atsuko-kagari.gif" alt="Foto de perfil" />
                                </a>
                            </div>

                            <div className={estilos.container__mensagem__user__name}>
                                <p>JacyelGamer2</p>
                            </div>

                            <div className={estilos.container__mensagem__data}>
                                <p>03/02/2025</p>
                            </div>
                        </div>

                        <div className={estilos.container__mensagem__corpo__msg}>
                            <div className={estilos.container__mensagem__corpo}>
                                <p>Bom dia, rapaz esse projeto vai ficar muito massa depois do back-end.</p>
                            </div>
                        </div>
                        
                        <div className={estilos.container__mensagem__avaliacao}>
                            
                            <input className={estilos.container__mensagem__avaliacao__like__deslike} type="button" value="Like: 0"/>

                            <input className={estilos.container__mensagem__avaliacao__like__deslike} type="button" value="Deslikes: 0"/>

                            <div className={estilos.container__box__foto}>

                                <img className={`${estilos.container__box__foto__name} ${estilos.container__mensagem__avaliacao__compartilhar}`} src={compartilhar} alt="Icone compartilhar" />
                                                        
                            </div>
                        </div>
                    </div>
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