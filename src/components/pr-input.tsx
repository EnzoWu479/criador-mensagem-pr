import { CheckCircle, ShieldIcon, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { extractAzurePRInfo } from "@/utils/extract-azure-pr-info";

export type AzurePRInfo = {
  organization: string;
  project: string;
  pullRequestId: string;
  repository: string;
};

export interface PrInputProps {
  onExtract(prInfo: AzurePRInfo): void;
}

export const PrInput = ({ onExtract }: PrInputProps) => {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");

  const handleSaveOrganization = async () => {
    if (!value.trim()) {
      setStatus("error");
      return;
    }
    setStatus("loading");

    try {
      const { organization, project, pullRequestId, repository } =
        extractAzurePRInfo(value);
      if (!organization || !project || !pullRequestId || !repository) {
        setStatus("error");
        return;
      }

      onExtract({
        organization,
        project,
        pullRequestId,
        repository,
      });
      
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Error extracting PR info:", error);
      setStatus("error");
    }
  };
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="pr">Pull Request</Label>
      <div className="flex gap-2">
        <Input
          id="pr"
          type="text"
          placeholder="Enter Pull Request URL"
          className="w-full"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          onClick={handleSaveOrganization}
          className="whitespace-nowrap"
          disabled={status === "success"}
        >
          {status === "success" ? (
            <>
              <CheckCircle className="mr-1 h-4 w-4" />
              Loaded
            </>
          ) : status === "error" ? (
            <>
              <XCircle className="mr-1 h-4 w-4" />
              Error
            </>
          ) : (
            <>
              <ShieldIcon className="mr-1 h-4 w-4" />
              Load PR
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
