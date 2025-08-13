import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  CssBaseline,
  Container
} from '@mui/material'
import { 
  LockPerson as LockIcon, 
  Key as KeyIcon 
} from '@mui/icons-material'
import './App.css'

const drawerWidth = 240

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{ 
          width: '100%',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Nabto WebRTC Key Tool
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <KeyIcon />
              </ListItemIcon>
              <ListItemText primary="Generate Key Pairs" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <LockIcon />
              </ListItemIcon>
              <ListItemText primary="Generate Tokens" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default', 
          p: 3,
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        <Container>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to WebRTC Key Tool
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is your dashboard for managing WebRTC keys and configurations.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default App
