import {
  Box,
  Paper,
  Typography
} from '@mui/material'

interface FormCardProps {
  title?: string
  children: React.ReactNode
}

export default function FormCard({ title, children }: FormCardProps) {
  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      { title ?
        (<Typography variant="h6" gutterBottom>
          {title}
        </Typography>) :
        null
      }
      <Box sx={{ mt: 2, display: 'flex', gap: 2, flexDirection: 'column' }}>
        {children}
      </Box>
    </Paper>
  )
}