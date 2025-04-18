"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fetchRepositories } from "@/lib/azure-devops-api";
import { useQueryRepositories } from "@/hooks/queries/useQueryRepositories";

interface Repository {
  id: string;
  name: string;
}

interface RepositorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  token: string;
  organization: string;
  project: string;
  enabled: boolean;
}

export default function RepositorySelect({
  value,
  onValueChange,
  token,
  organization,
  project,
  enabled,
}: RepositorySelectProps) {
  const {
    data: repositories,
    isLoading,
    refetch,
    error,
  } = useQueryRepositories(token, organization, project);
  // const [repositories, setRepositories] = useState<Repository[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  if (!enabled) {
    return (
      <div className="space-y-2">
        <Label htmlFor="repository">Repository</Label>
        <Select disabled>
          <SelectTrigger id="repository" className="w-full">
            <SelectValue placeholder="Complete organization and project first" />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Repository</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>Repository</Label>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="mt-2"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="repository">Repository</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          className="h-6 px-2"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>

      {repositories?.length === 0 ? (
        <Alert>
          <AlertDescription>
            No repositories found. Please check your organization and project
            names.
          </AlertDescription>
        </Alert>
      ) : (
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger id="repository" className="w-full">
            <SelectValue placeholder="Select repository" />
          </SelectTrigger>
          <SelectContent>
            {repositories?.map((repo) => (
              <SelectItem key={repo.id} value={repo.name}>
                {repo.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
