import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Index from './pagínas/index.jsx'
import Criar_conta from './pagínas/criar_conta.jsx'
import Home from './pagínas/home.jsx'
import Perfil__user from './pagínas/perfil user.jsx'
import Ver_seguidores from './pagínas/ver seguidores.jsx'
import Configuracao_conta from './pagínas/configuracao conta.jsx'
import './index.css'
import App from './App.jsx'

const rotas = createBrowserRouter([
  {
    path: "/",
    element: <Index/>
  },
  {
    path: "/criar_conta",
    element: <Criar_conta/>
  },
  {
    path: "/home",
    element: <Home/>
  },
  {
    path: "/perfil",
    element: <Perfil__user/>
  },
  {
    path: "/ver_seguidores",
    element: <Ver_seguidores/>
  },
  {
    path: "/configuracao_conta",
    element: <Configuracao_conta/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)
