import { RouterProvider } from 'react-router/dom'
import './App.css'
import router from './router'
import AuthProvider from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {

  return (
    <>
      <ThemeProvider>
        <AuthProvider>  
          <RouterProvider router={router}/>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}

export default App
