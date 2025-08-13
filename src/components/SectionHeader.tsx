import { Typography } from "@mui/material"

interface SectionHeaderProps {
  title: string
  description: string
}

export default function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>
    </>
  )
}