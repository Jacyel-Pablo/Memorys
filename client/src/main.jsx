import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Index from './pagínas/index.jsx'
import Criar_conta from './pagínas/criar_conta.jsx'
import Home from './pagínas/home.jsx'
import Perfil__user from './pagínas/perfil user.jsx'
import Ver_seguidores from './pagínas/ver seguidores.jsx'
import Configuracao_conta from './pagínas/configuracao conta.jsx'
import Ativar__conta from './pagínas/ativar__conta.jsx'
import './index.css'
import App from './App.jsx'

// Coloque aqui a porta do servidor e no arquivo server.js ultima linha
const port_server = "memorys-backend.onrender.com/"

const protecao = {
  "/home": <Home server={port_server}/>,
  "/perfil": <Perfil__user server={port_server}/>,
  "/ver_seguidores": <Ver_seguidores server={port_server}/>,
  "/configuracao_conta": <Configuracao_conta server={port_server}/>
}

const testes = false

function Protecao__telas()
{
  if (testes === false) {
    const [telas, setTelas] = useState(<></>)

    fetch(`http://${port_server}:3000/verificar__token?token=${localStorage.getItem("token")}`).then(dados => dados.json()).then(dados => {
      if (dados === true) {
        setTelas(protecao[window.location.pathname])
        
      } else {
        window.location.href = "/"
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
    element: <Index server={port_server}/>
  },
  {
    path: "/criar_conta",
    element: <Criar_conta server={port_server}/>
  },
  {
    path: "/ativar__conta",
    element: <Ativar__conta server={port_server}/>
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
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)
