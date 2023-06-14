import { KeyboardEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

type Props = {
  open: boolean
  onSubmit(value: string): void
}

export function CustomDialog({ open, onSubmit }: Props) {
  const [value, setValue] = useState('')

  function handleKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' && value) {
      e.preventDefault()
      onSubmit(value)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => onSubmit('')}>
      <DialogContent onKeyDown={handleKey}>
        <DialogHeader>
          <DialogTitle>Custom Ingredient</DialogTitle>
        </DialogHeader>
        <div>
          <Input
            id="name"
            value={value}
            placeholder="Name..."
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => onSubmit(value)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
