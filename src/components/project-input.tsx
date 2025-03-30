"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ChangeEvent } from "react"

interface ProjectInputProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function ProjectInput({ value, onChange }: ProjectInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="project">Project</Label>
      <Input id="project" value={value} onChange={onChange} placeholder="Enter Azure DevOps project name" />
    </div>
  )
}

