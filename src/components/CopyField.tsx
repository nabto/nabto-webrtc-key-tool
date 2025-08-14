import { Box, Typography, TextField, IconButton } from "@mui/material";
import { ContentCopy as CopyIcon, Download as DownloadIcon } from '@mui/icons-material'

interface CopyFieldProps {
  text: string
  rows: number
  title: string
  ext?: string
}

export default function CopyField({ text, title, rows, ext }: CopyFieldProps) {
  ext = ext ?? ".txt"

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([text], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${title.toLowerCase().replace(/\s+/g, '_')}.${ext}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    URL.revokeObjectURL(element.href)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6">{title}</Typography>
        <Box>
          <IconButton onClick={() => { void handleCopy(text) }} size="small">
            <CopyIcon />
          </IconButton>
          <IconButton onClick={handleDownload} size="small">
            <DownloadIcon />
          </IconButton>
        </Box>
      </Box>
      <TextField
        multiline
        rows={rows}
        fullWidth
        value={text}
        variant="outlined"
        slotProps={{
          input: {
            readOnly: true
          }
        }}
        sx={{ fontFamily: 'monospace' }}
      />
    </Box>
  )
}
