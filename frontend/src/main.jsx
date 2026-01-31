import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactDom from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
 import UserContext from './context/UserContext.jsx';
 import CaptainContext from './context/CaptainContext.jsx';
 import SocketProvider from './context/SocketContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <CaptainContext>
        <UserContext>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserContext>
      </CaptainContext>
    </SocketProvider>
  </StrictMode>,
)
