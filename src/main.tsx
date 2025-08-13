import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { orange } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    primary: {
      main: orange[600],
      light: orange[300],
      dark: orange[800],
    },
    secondary: {
      main: orange[800],
    },
  },
})

// eslint-disable-next-line
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
