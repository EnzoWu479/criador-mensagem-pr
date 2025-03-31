"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, CheckCircle, XCircle, ShieldIcon } from "lucide-react";
import { setCookie, removeCookie } from "@/lib/cookies";
import { setSecureCookie, deleteSecureCookie } from "@/app/actions";
import type { ChangeEvent } from "react";

interface TokenInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  hasStoredToken: boolean;
  setHasStoredToken: (value: boolean) => void;
  onTokenSaved?: (token: string) => void;
}

export default function TokenInput({
  value,
  onChange,
  hasStoredToken,
  setHasStoredToken,
  onTokenSaved,
}: TokenInputProps) {
  const [saveSecure, setSaveSecure] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const handleSaveToken = async () => {
    if (!value.trim()) {
      setSaveStatus("error");
      return;
    }

    try {
      if (saveSecure) {
        // Save in HttpOnly cookie via server action with encryption
        await setSecureCookie("azureDevOpsToken", value);
      } else {
        // Save in regular cookie with encryption
        setCookie("azureDevOpsToken", value);
      }

      setHasStoredToken(true);
      setSaveStatus("success");

      // Notify parent component that token was saved
      if (onTokenSaved) {
        onTokenSaved(value);
      }

      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Error saving token:", error);
      setSaveStatus("error");
    }
  };

  const handleClearToken = async () => {
    try {
      // Clear both types of cookies to be safe
      removeCookie("azureDevOpsToken");
      await deleteSecureCookie("azureDevOpsToken");

      setHasStoredToken(false);
      onChange({ target: { value: "" } } as ChangeEvent<HTMLInputElement>);
      setSaveStatus("idle");

      // Notify parent component that token was cleared
      if (onTokenSaved) {
        onTokenSaved("");
      }
    } catch (error) {
      console.error("Error clearing token:", error);
    }
  };

  return (
    <div className="space-y-4">
      {!hasStoredToken && (
        <Alert variant="info" className="bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            You'll need an Azure DevOps Personal Access Token with appropriate
            permissions. Your token will be encrypted before storage.
          </AlertDescription>
        </Alert>
      )}

      {hasStoredToken && (
        <Alert className="bg-green-50 border-green-200">
          <ShieldIcon className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            Your token is encrypted and stored securely.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="token">Azure DevOps Access Token</Label>
        <div className="flex gap-2">
          <Input
            id="token"
            value={value}
            onChange={onChange}
            placeholder={
              hasStoredToken
                ? "Token saved securely"
                : "Enter your access token"
            }
            type="password"
            className="flex-1"
          />

          {hasStoredToken ? (
            <Button
              variant="destructive"
              onClick={handleClearToken}
              className="whitespace-nowrap"
            >
              Clear Token
            </Button>
          ) : (
            <Button
              onClick={handleSaveToken}
              className="whitespace-nowrap"
              disabled={saveStatus === "success"}
            >
              {saveStatus === "success" ? (
                <>
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Saved
                </>
              ) : saveStatus === "error" ? (
                <>
                  <XCircle className="mr-1 h-4 w-4" />
                  Error
                </>
              ) : (
                <>
                  <ShieldIcon className="mr-1 h-4 w-4" />
                  Save Token
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {!hasStoredToken && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="secureStorage"
            checked={saveSecure}
            onChange={(e) => setSaveSecure(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label
            htmlFor="secureStorage"
            className="text-sm text-muted-foreground"
          >
            Store token securely with encryption (recommended)
          </Label>
        </div>
      )}
    </div>
  );
}
