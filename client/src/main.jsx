import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Index from './pagínas/index.jsx'
import Criar_conta from './pagínas/criar_conta.jsx'
import Alterar_senha from './pagínas/alterar_senha.jsx'
import Home from './pagínas/home.jsx'
import Perfil__user from './pagínas/perfil user.jsx'
import Ver_seguidores from './pagínas/ver seguidores.jsx'
import Configuracao_conta from './pagínas/configuracao conta.jsx'
import Ativar__conta from './pagínas/ativar__conta.jsx'
import Pagina_nao_encotrada from './pagínas/pagína_nao_encotrada.jsx'
import './index.css'
import App from './App.jsx'

// Coloque aqui a porta do servidor e no arquivo server.js ultima linha
const port_server = "https://memorys-backend.onrender.com"
// const port_server = "http://localhost:3000"

// Permitir upload de fotos e vídeos true ativo false desativo
const upload_foto_video_ativas = false

// Envio de email está ativo true ativo false desativo
const usar_email = false

const rotas_normais = {
  "/": <Index server={port_server}/>,
  "/criar_conta": <Criar_conta server={port_server} upload={upload_foto_video_ativas} usar_email={usar_email}/>,
  "/alterar_senha": <Alterar_senha server={port_server}/>,
  "/ativar__conta": <Ativar__conta server={port_server}/>,
}

var protecao = {
  "/home": <Home server={port_server} upload={upload_foto_video_ativas}/>,
  "/perfil": <Perfil__user server={port_server}/>,
  "/ver_seguidores": <Ver_seguidores server={port_server}/>,
  "/configuracao_conta": <Configuracao_conta server={port_server} upload={upload_foto_video_ativas}/>
}

const testes = false

function Protecao__telas()
{
  if (testes === false) {
    const [telas, setTelas] = useState(<></>)
    const paramentos = new URLSearchParams(window.location.search).toString().split("=")
    
    if (paramentos.length === 2) {
      localStorage.setItem("msg", paramentos[1])

    } else {
      localStorage.setItem("msg", null)
      
    }

    fetch(`${port_server}/verificar__token?token=${localStorage.getItem("token")}&id=${localStorage.getItem("id")}`).then(dados => dados.json()).then(dados => {
      if (dados === true && Object.keys(protecao).indexOf(window.location.pathname) >= 0) {
        setTelas(protecao[window.location.pathname])
        
      } else if (dados === true && Object.keys(protecao).indexOf(window.location.pathname) <= -1) {
        window.location.href = "/home"

      } else if (dados === false && Object.keys(protecao).indexOf(window.location.pathname) >= 0) {
        window.location.href = "/"

      } else {
        setTelas(rotas_normais[window.location.pathname])
      }

    })
  
    return telas

  } else {
    
    return protecao[window.location.pathname]
  }
}

const rotas = createBrowserRouter([
  {
    path: "/",
    element: <Protecao__telas/>
  },
  {
    path: "/criar_conta",
    element: <Protecao__telas/>
  },
  {
    path: "/alterar_senha",
    element: <Protecao__telas/>
  },
  {
    path: "/ativar__conta",
    element: <Protecao__telas/>
  },
  {
    path: "/home",
    element: <Protecao__telas/>
  },
  {
    path: "/perfil",
    element: <Protecao__telas/>
  },
  {
    path: "/ver_seguidores",
    element: <Protecao__telas/>
  },
  {
    path: "/configuracao_conta",
    element: <Protecao__telas/>
  },
  {
    path: "*",
    element: <Pagina_nao_encotrada/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)
