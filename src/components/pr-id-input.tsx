"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ChangeEvent } from "react"

interface PrIdInputProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function PrIdInput({ value, onChange }: PrIdInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="prId">ID PR</Label>
      <Input id="prId" value={value} onChange={onChange} placeholder="Enter PR ID" />
    </div>
  )
}

