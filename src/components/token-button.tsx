"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, KeyIcon, CheckCircle } from "lucide-react"

interface TokenButtonProps {
  onClick: () => void
  showingToken: boolean
  hasStoredToken: boolean
}

export default function TokenButton({ onClick, showingToken, hasStoredToken }: TokenButtonProps) {
  return (
    <Button className="w-full" onClick={onClick} variant="outline">
      {showingToken ? (
        <>
          Hide Azure DevOps Access Token
          <ChevronUp className="ml-2 h-4 w-4" />
        </>
      ) : (
        <>
          {hasStoredToken ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Azure DevOps Access Token (Saved)
            </>
          ) : (
            <>
              <KeyIcon className="mr-2 h-4 w-4" />
              Azure DevOps Access Token
            </>
          )}
          <ChevronDown className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  )
}

