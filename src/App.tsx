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
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  Typography
} from '@mui/material'
import FormCard from './components/FormCard'
import SectionHeader from './components/SectionHeader'
import CopyField from './components/CopyField'
import { generateKeyPair, generateToken } from './Crypto'

const drawerWidth = 240

type Section = 'keypairs' | 'tokens'

function KeyPairsSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [keyPair, setKeyPair] = useState({ privateKey: "", publicKey: "" })

  const handleGenerateKeyPair = async () => {
    const { publicKeyPem, privateKeyPem } = await generateKeyPair()
    setKeyPair({ privateKey: privateKeyPem, publicKey: publicKeyPem })
    setModalOpen(true)
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
            <CopyField text={keyPair.privateKey} title="Private Key" rows={6} ext="pem"/>
            <CopyField text={keyPair.publicKey} title="Public Key" rows={4} ext="pem"/>
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
  const [modalOpen, setModalOpen] = useState(false)
  const [token, setToken] = useState("")

  const [productId, setProductId] = useState("")
  const [deviceId, setDeviceId] = useState("")
  const [expiration, setExpiration] = useState(24)
  const [publicKey, setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")

  const handleGenerateToken = async () => {
    const token = await generateToken(
      publicKey,
      privateKey,
      productId,
      deviceId,
      "client:connect turn"
    )
    setToken(token)
    setModalOpen(true)
  }

  return (
    <>
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
          label="Product ID"
          type="number"
          variant="outlined"
          fullWidth
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <TextField
          label="Device ID"
          type="number"
          variant="outlined"
          fullWidth
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
        />
        <TextField
          label="Expiration (hours)"
          type="number"
          variant="outlined"
          fullWidth
          value={expiration}
          onChange={(e) => setExpiration(Number(e.target.value))}
        />
        <TextField
          label="Public Key"
          type="text"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
        />
        <TextField
          label="Private Key"
          type="text"
          variant="outlined"
          fullWidth
          multiline
          rows={6}
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
        />
        <Button variant="contained" sx={{ alignSelf: 'flex-start' }} onClick={handleGenerateToken}>
          Generate Token
        </Button>
      </FormCard>
    </Container>

    <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generated Key Pair</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <CopyField text={token} title="Access Token" rows={6} ext="txt"/>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
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
