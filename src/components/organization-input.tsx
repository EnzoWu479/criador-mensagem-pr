"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ChangeEvent } from "react"

interface OrganizationInputProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function OrganizationInput({ value, onChange }: OrganizationInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="organization">Organization</Label>
      <Input id="organization" value={value} onChange={onChange} placeholder="Enter Azure DevOps organization name" />
    </div>
  )
}

