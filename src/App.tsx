import { useState } from 'react'
import './App.css'
import {
  Key as KeyIcon,
  LockPerson as LockIcon,
  Code as CodeIcon
} from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  Typography
} from '@mui/material'
import { ContentCopy as CopyIcon } from '@mui/icons-material'
import FormCard from './components/FormCard'
import SectionHeader from './components/SectionHeader'
import CopyField from './components/CopyField'
import { generateKeyPair } from './Crypto'

const drawerWidth = 240

type Section = 'keypairs' | 'tokens'

function KeyPairsSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [keyPair, setKeyPair] = useState({ privateKey: '', publicKey: '' })

  const handleGenerateKeyPair = async () => {
    const { publicKeyPem, privateKeyPem } = await generateKeyPair()
    setKeyPair({ privateKey: privateKeyPem, publicKey: publicKeyPem })
    setModalOpen(true)
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <>
      <Container>
        <SectionHeader
          title="Generate Key Pairs"
          description="Generate cryptographic key pairs for WebRTC communication."
        />
        <FormCard>
          <Typography variant="body1" color="text.primary" sx={{ maxWidth: 480, mb: 1, textAlign: "start" }}>
            This tool will generate an ECDSA key pair.
            <br/>
            The private key is PCKS8 encoded and the public key is SPKI encoded. Both are given in the PEM format.
            <br/><br/>
            Key generation happens transiently on the client side. You may verify the source code by clicking on "Source" on the sidebar.
          </Typography>
          <Button variant="contained" sx={{ alignSelf: "flex-start" }} onClick={handleGenerateKeyPair}>
            Generate Key Pair
          </Button>
        </FormCard>
      </Container>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generated Key Pair</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <CopyField text={keyPair.privateKey} title="Private Key" rows={6}/>
            <CopyField text={keyPair.publicKey} title="Public Key" rows={4}/>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function TokensSection() {
  return (
    <Container>
      <SectionHeader
        title="Generate Tokens"
        description="Generate access tokens for secure centralized connections over Nabto WebRTC."
      />
      <FormCard>
      <Typography variant="body1" color="text.primary" sx={{ maxWidth: 480, mb: 1, textAlign: "start" }}>
        Access token generation happens transiently on the client side, nothing is stored.
        You may verify the source code by clicking on "Source" on the sidebar.
      </Typography>
        <TextField
          label="Expiration (hours)"
          type="number"
          variant="outlined"
          fullWidth
          defaultValue={24}
        />
        <TextField
          label="Private Key"
          type="text"
          variant="outlined"
          fullWidth
          multiline
          rows={8}
        />
        <Button variant="contained" sx={{ alignSelf: 'flex-start' }}>
          Generate Token
        </Button>
      </FormCard>
    </Container>
  )
}

function App() {
  const [selectedSection, setSelectedSection] = useState<Section>('keypairs')

  const renderContent = () => {
    switch (selectedSection) {
      case 'keypairs':
        return <KeyPairsSection />
      case 'tokens':
        return <TokensSection />
      default:
        return null
    }
  }

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
            <ListItemButton
              selected={selectedSection === 'keypairs'}
              onClick={() => setSelectedSection('keypairs')}
            >
              <ListItemIcon>
                <KeyIcon />
              </ListItemIcon>
              <ListItemText primary="Generate Key Pairs" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedSection === 'tokens'}
              onClick={() => setSelectedSection('tokens')}
            >
              <ListItemIcon>
                <LockIcon />
              </ListItemIcon>
              <ListItemText primary="Generate Tokens" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={false}
              onClick={() => {}}
            >
              <ListItemIcon>
                <CodeIcon />
              </ListItemIcon>
              <ListItemText primary="Source" />
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
        {renderContent()}
      </Box>
    </Box>
  )
}

export default App
