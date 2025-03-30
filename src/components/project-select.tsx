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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjs = async () => {
    if (!token || !organization) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const projs = await fetchProjects({ token, organization });
      setProjects(projs);

      // If we have projects and none is selected, select the first one
      if (projs.length > 0 && !value) {
        onValueChange(projs[0].name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects when organization changes
  useEffect(() => {
    if (enabled && organization) {
      fetchProjs();
    }
  }, [organization, enabled]);

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

  if (loading) {
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
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchProjs}
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
          onClick={fetchProjs}
          className="h-6 px-2"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>

      {projects.length === 0 ? (
        <Alert>
          <AlertDescription>
            No projects found in this organization.
          </AlertDescription>
        </Alert>
      ) : (
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger id="project">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((proj) => (
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
