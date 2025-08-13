import { Box, Typography, TextField, IconButton } from "@mui/material";
import { ContentCopy as CopyIcon } from '@mui/icons-material'

interface CopyFieldProps {
  text: string
  rows: number
  title: string
}

export default function CopyField({ text, title, rows }: CopyFieldProps) {
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={() => handleCopy(text)} size="small">
          <CopyIcon />
        </IconButton>
      </Box>
      <TextField
        multiline
        rows={rows}
        fullWidth
        value={text}
        variant="outlined"
        InputProps={{ readOnly: true }}
        sx={{ fontFamily: 'monospace' }}
      />
    </Box>
  )
}
