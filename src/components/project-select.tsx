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
import { fetchProjects } from "@/lib/azure-devops-api";
import { useQueryProjects } from "@/hooks/queries/useQueryProjects";

interface Project {
  id: string;
  name: string;
}

interface ProjectSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  token: string;
  organization: string;
  enabled: boolean;
}

export default function ProjectSelect({
  value,
  onValueChange,
  token,
  organization,
  enabled,
}: ProjectSelectProps) {
  const {
    data: projects,
    refetch,
    isLoading,
    error,
  } = useQueryProjects(token, organization);

  if (!enabled) {
    return (
      <div className="space-y-2">
        <Label htmlFor="project">Project</Label>
        <Select disabled>
          <SelectTrigger id="project" className="w-full">
            <SelectValue placeholder="Select an organization first" />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="space-y-2">
        <Label htmlFor="project">Project</Label>
        <Select disabled>
          <SelectTrigger id="project">
            <SelectValue placeholder="Select an organization first" />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Project</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>Project</Label>
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
        <Label htmlFor="project">Project</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          className="h-6 px-2"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>

      {projects?.length === 0 ? (
        <Alert>
          <AlertDescription>
            No projects found in this organization.
          </AlertDescription>
        </Alert>
      ) : (
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger id="project" className="w-full">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects?.map((proj) => (
              <SelectItem key={proj.id} value={proj.name}>
                {proj.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
