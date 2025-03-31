"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type ChangeEvent } from "react";
import { Button } from "./ui/button";
import { setSecureCookie } from "@/app/actions";
import { CheckCircle, ShieldIcon, XCircle } from "lucide-react";

interface OrganizationInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onOrganizationSaved?: (organization: string) => void;
}

export default function OrganizationInput({
  value,
  onChange,
  onOrganizationSaved,
}: OrganizationInputProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const handleSaveOrganization = async () => {
    if (!value.trim()) {
      setStatus("error");
      return;
    }
    setStatus("loading");

    await setSecureCookie("organization", value);

    if (onOrganizationSaved) {
      onOrganizationSaved(value);
    }

    setStatus("success");

    setTimeout(() => {
      setStatus("idle");
    }, 3000);
  };
  return (
    <div className="space-y-2">
      <Label htmlFor="organization">Organization</Label>
      <div className="flex gap-2">
        <Input
          id="organization"
          value={value}
          onChange={onChange}
          placeholder="Enter Azure DevOps organization name"
        />
        <Button
          onClick={handleSaveOrganization}
          className="whitespace-nowrap"
          disabled={status === "success"}
        >
          {status === "success" ? (
            <>
              <CheckCircle className="mr-1 h-4 w-4" />
              Saved
            </>
          ) : status === "error" ? (
            <>
              <XCircle className="mr-1 h-4 w-4" />
              Error
            </>
          ) : (
            <>
              <ShieldIcon className="mr-1 h-4 w-4" />
              Save Organization
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
