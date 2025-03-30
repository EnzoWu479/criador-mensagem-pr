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
import { fetchOrganizations } from "@/lib/azure-devops-api";

interface Organization {
  accountId: string;
  accountName: string;
  accountUri: string;
}

interface OrganizationSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  token: string;
  enabled: boolean;
}

export default function OrganizationSelect({
  value,
  onValueChange,
  token,
  enabled,
}: OrganizationSelectProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrgs = async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orgs = await fetchOrganizations({ token });
      setOrganizations(orgs);

      // If we have organizations and none is selected, select the first one
      if (orgs.length > 0 && !value) {
        onValueChange(orgs[0].accountName);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch organizations"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch organizations when token changes
  useEffect(() => {
    if (enabled && token) {
      fetchOrgs();
    }
  }, [token, enabled]);

  if (!enabled) {
    return (
      <div className="space-y-2">
        <Label htmlFor="organization">Organization</Label>
        <Select disabled>
          <SelectTrigger id="organization" className="w-full">
            <SelectValue placeholder="Add your token first" />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Organization</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>Organization</Label>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrgs}
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
        <Label htmlFor="organization">Organization</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchOrgs}
          className="h-6 px-2"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>

      {organizations.length === 0 ? (
        <Alert>
          <AlertDescription>
            No organizations found. Please check your access token permissions.
          </AlertDescription>
        </Alert>
      ) : (
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger id="organization">
            <SelectValue placeholder="Select organization" />
          </SelectTrigger>
          <SelectContent>
            {organizations.map((org) => (
              <SelectItem key={org.accountId} value={org.accountName}>
                {org.accountName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
