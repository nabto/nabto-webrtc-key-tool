import { useState, useEffect } from 'react'
import './App.css'
import {
  Key as KeyIcon,
  LockPerson as LockIcon,
  Code as CodeIcon,
  Help as HelpIcon
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
  Stack,
  IconButton,
  TextField,
  Toolbar,
  Typography
} from '@mui/material'
import FormCard from './components/FormCard'
import SectionHeader from './components/SectionHeader'
import CopyField from './components/CopyField'
import { generateKeyPair, generateToken } from './Crypto'
import { isValidProductId, isValidDeviceId, isValidPemKey } from './Validation'
import Markdown from 'react-markdown'
import * as Text from './Text'

const drawerWidth = 240
const githubUrl = "https://github.com/nabto/nabto-webrtc-key-tool"

const STORAGE_KEYS = {
  PRODUCT_ID: 'nabto-productId',
  DEVICE_ID: 'nabto-deviceId',
  EXPIRATION: 'nabto-expiration',
  PUBLIC_KEY: 'nabto-publicKey',
  PRIVATE_KEY: 'nabto-privateKey'
} as const

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
            <br />
            The private key is PCKS8 encoded and the public key is SPKI encoded. Both are given in the PEM format.
            <br /><br />
            Key generation happens transiently on the client side. You may verify the source code by clicking on "Source" on the sidebar.
          </Typography>
          <Button variant="contained" sx={{ alignSelf: "flex-start" }} onClick={() => { void handleGenerateKeyPair() }}>
            Generate Key Pair
          </Button>
        </FormCard>
      </Container>

      <Dialog open={modalOpen} onClose={() => { setModalOpen(false) }} maxWidth="md" fullWidth>
        <DialogTitle>Generated Key Pair</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <CopyField text={keyPair.privateKey} title="Private Key" rows={6} ext="pem" />
            <CopyField text={keyPair.publicKey} title="Public Key" rows={4} ext="pem" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setModalOpen(false) }}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function TokensSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const [token, setToken] = useState("")

  const [productId, setProductId] = useState("")
  const [deviceId, setDeviceId] = useState("")
  const [expiration, setExpiration] = useState(24)
  const [publicKey, setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")

  const [errors, setErrors] = useState({
    productId: "",
    deviceId: "",
    publicKey: "",
    privateKey: ""
  })

  useEffect(() => {
    const savedProductId = localStorage.getItem(STORAGE_KEYS.PRODUCT_ID)
    const savedDeviceId = localStorage.getItem(STORAGE_KEYS.DEVICE_ID)
    const savedExpiration = localStorage.getItem(STORAGE_KEYS.EXPIRATION)
    const savedPublicKey = localStorage.getItem(STORAGE_KEYS.PUBLIC_KEY)
    const savedPrivateKey = localStorage.getItem(STORAGE_KEYS.PRIVATE_KEY)

    if (savedProductId) setProductId(savedProductId)
    if (savedDeviceId) setDeviceId(savedDeviceId)
    if (savedExpiration) setExpiration(Number(savedExpiration))
    if (savedPublicKey) setPublicKey(savedPublicKey)
    if (savedPrivateKey) setPrivateKey(savedPrivateKey)
  }, [])

  const validateFields = () => {
    const newErrors = {
      productId: "",
      deviceId: "",
      publicKey: "",
      privateKey: ""
    }

    if (!productId.trim()) {
      newErrors.productId = "Product ID is required"
    } else if (!isValidProductId(productId)) {
      newErrors.productId = "Product ID must start with 'wp-' and be lowercase"
    }

    if (!deviceId.trim()) {
      newErrors.deviceId = "Device ID is required"
    } else if (!isValidDeviceId(deviceId)) {
      newErrors.deviceId = "Device ID must start with 'wd-' and be lowercase"
    }

    if (!publicKey.trim()) {
      newErrors.publicKey = "Public key is required"
    } else if (!isValidPemKey("public", publicKey)) {
      newErrors.publicKey = "The provided key is not PEM formatted"
    }

    if (!privateKey.trim()) {
      newErrors.privateKey = "Private key is required"
    } else if (!isValidPemKey("private", privateKey)) {
      newErrors.privateKey = "The provided key is not PEM formatted"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== "")
  }

  const handleGenerateToken = async () => {
    if (!validateFields()) {
      return
    }

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
      <Container sx={{ maxWidth: '95%' }}>
        <SectionHeader
          title="Generate Tokens"
          description="Generate access tokens for secure centralized connections over Nabto WebRTC."
        />
        <Stack direction="row" spacing={3} sx={{ width: '100%' }}>
          <Box>
            <IconButton onClick={() => setHelpModalOpen(true)}>
              <HelpIcon />
            </IconButton>
          </Box>
          <FormCard>
            <Typography variant="body1" color="text.primary" sx={{ maxWidth: 480, mb: 1, textAlign: "start" }}>
              Access token generation happens transiently on the client side, nothing is stored.
              You may verify the source code by clicking on "Source" on the sidebar.<br/>
              Click on the help button to the left to see more information.
            </Typography>
            <TextField
              label="Product ID"
              type="text"
              variant="outlined"
              fullWidth
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value)
                localStorage.setItem(STORAGE_KEYS.PRODUCT_ID, e.target.value)
              }}
              error={errors.productId != ""}
              helperText={errors.productId}
            />
            <TextField
              label="Device ID"
              type="text"
              variant="outlined"
              fullWidth
              value={deviceId}
              onChange={(e) => {
                setDeviceId(e.target.value)
                localStorage.setItem(STORAGE_KEYS.DEVICE_ID, e.target.value)
              }}
              error={errors.deviceId != ""}
              helperText={errors.deviceId}
            />
            <TextField
              label="Expiration (hours)"
              type="number"
              variant="outlined"
              fullWidth
              value={expiration}
              onChange={(e) => {
                setExpiration(Number(e.target.value))
                localStorage.setItem(STORAGE_KEYS.EXPIRATION, e.target.value)
              }}
            />
            <TextField
              label="Public Key"
              type="text"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={publicKey}
              onChange={(e) => {
                setPublicKey(e.target.value)
                localStorage.setItem(STORAGE_KEYS.PUBLIC_KEY, e.target.value)
              }}
              error={errors.publicKey != ""}
              helperText={errors.publicKey}
            />
            <TextField
              label="Private Key"
              type="text"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              value={privateKey}
              onChange={(e) => {
                setPrivateKey(e.target.value)
                localStorage.setItem(STORAGE_KEYS.PRIVATE_KEY, e.target.value)
              }}
              error={errors.privateKey != ""}
              helperText={errors.privateKey}
            />
            <Button variant="contained" sx={{ alignSelf: 'flex-start' }} onClick={() => { void handleGenerateToken() }}>
              Generate Token
            </Button>
          </FormCard>
        </Stack>
      </Container>

      <Dialog open={modalOpen} onClose={() => { setModalOpen(false) }} maxWidth="md" fullWidth>
        <DialogTitle>Generated Key Pair</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <CopyField text={token} title="Access Token" rows={6} ext="txt" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setModalOpen(false) }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={helpModalOpen} onClose={() => { setHelpModalOpen(false) }} maxWidth="md" fullWidth>
        <DialogTitle>What is this tool for?</DialogTitle>
        <DialogContent>
            <Typography >
              <Markdown>{Text.TokenHelp}</Markdown>
            </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setHelpModalOpen(false) }}>Close</Button>
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
              onClick={() => { setSelectedSection('keypairs') }}
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
              onClick={() => { setSelectedSection('tokens') }}
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
              onClick={() => {
                window.open(githubUrl, "_blank")
              }}
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
