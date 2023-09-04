import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'font-awesome/css/font-awesome.min.css';
import { Provider } from 'react-redux'
import { store } from './store/store.ts';
import { GoogleOAuthProvider } from '@react-oauth/google';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <Provider store={store}>
            <GoogleOAuthProvider clientId="754198416776-tdp7nlbtbav41n4a614ng9330o1a8rb1.apps.googleusercontent.com">
              <App/>
            </GoogleOAuthProvider>
        </Provider>      
  </React.StrictMode>
)
