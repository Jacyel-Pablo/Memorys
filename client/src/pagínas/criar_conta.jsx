import estilos from "../css/index.module.css"

export default function Criar_conta()
{
    return (
        <div className={estilos.corpo}>
            <form className={estilos.container}>
                <h1 className={estilos.container__titulo}>Criar conta</h1>

                <p className={estilos.container__textos}>Foto de perfil:</p>
                <input className={estilos.container__escolher__arquivo} type="file" name="" />

                <p className={estilos.container__textos}>Nome de usuário:</p>
                <input className={estilos.container__campos} type="text" name="" placeholder="Insira um nome de usuário:" />

                <p className={estilos.container__textos}>Email:</p>
                <input className={estilos.container__campos} type="email" name="" placeholder="Insira um email:" />

                <p className={estilos.container__textos}>Senha:</p>
                <input className={estilos.container__campos} type="password" name="" placeholder="Insira uma senha:" />

                <input className={`${estilos.container__botao__entrar} ${estilos.container__botao__enviar}`} type="submit" value="Enviar" />
                                
            </form>
        </div>
    )
}