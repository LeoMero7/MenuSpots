import React from 'react'
import './ios-patches.css'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Capacitor core — bridges native iOS APIs
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'

// iOS-specific setup
async function setupNative() {
  if (Capacitor.isNativePlatform()) {
    // Set status bar style to match app
    await StatusBar.setStyle({ style: Style.Light })
    await StatusBar.setBackgroundColor({ color: '#FAF6F0' })

    // Hide splash screen after app renders
    await SplashScreen.hide({ fadeOutDuration: 400 })
  }
}

setupNative()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
