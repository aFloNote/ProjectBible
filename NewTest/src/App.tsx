
import { ThemeProvider } from "@/components/theme-provider"
import Sermon from '@/views/Sermons/SermonLanding'
import "./App.css"
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
