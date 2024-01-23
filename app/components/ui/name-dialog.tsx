import { KeyboardEvent, useState } from 'react'

import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'

type Props = {
  open: boolean
  title: string
  placeholder?: string
  onSubmit(value: string): void
}

export function NameDialog({
  open,
  title,
  placeholder = 'Name...',
  onSubmit,
}: Props) {
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
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>
          <Input
            type="text"
            id="name"
            value={value}
            placeholder={placeholder}
            autoComplete="off"
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onSubmit('')}>
            Cancel
          </Button>
          <Button onClick={() => onSubmit(value)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
