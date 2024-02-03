
import { ThemeProvider } from "@/components/theme-provider"

import './App.css'

import Sermon from './Sermons/SermonLanding'

function App() {
  

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      {
        <div >
          
          <Sermon />
          
          
        </div>
      }      
    </ThemeProvider>
  )
}

export default App
