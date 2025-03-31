"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  RefreshCw,
  GitPullRequest,
  Calendar,
  User,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { fetchPullRequests, fetchTasksFromPR } from "@/lib/azure-devops-api";
import { IAzureDevopsPullRequest } from "@/types/pull-requests";
import { createPrText } from "@/utils/create-pr-text";

interface PullRequestsListProps {
  token: string;
  organization: string;
  project: string;
  repositoryId: string;
  enabled: boolean;
  pullRequestId?: string;
}

export default function PullRequestsList({
  token,
  organization,
  project,
  repositoryId,
  enabled,
  pullRequestId,
}: PullRequestsListProps) {
  const [pullRequests, setPullRequests] = useState<IAzureDevopsPullRequest[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPRs = async () => {
    if (!token || !organization || !project || !repositoryId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const prs = await fetchPullRequests({
        token,
        organization,
        project,
        repositoryId,
        status: "active", // Fetch all PRs regardless of status
      });
      if (pullRequestId) {
        const filteredPRs = prs.filter(
          (pr) => pr.pullRequestId.toString() === pullRequestId
        );
        setPullRequests(filteredPRs);
      } else {
        setPullRequests(prs);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch pull requests"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (pr: IAzureDevopsPullRequest) => {
    try {
      const tasks = await fetchTasksFromPR({
        token,
        organization,
        project,
        repositoryId,
        pullRequestId: pr.pullRequestId.toString(),
      });

      const prText = createPrText(pr, tasks);

      const blob = new Blob([prText], { type: "text/html" });
      const data = [new ClipboardItem({ "text/html": blob })];

      navigator.clipboard.write(data).then(() => {
        alert("Pull request ID copied to clipboard!");
      });
    } catch (error) {
      console.error("Error copying pull request ID:", error);
    }
  };

  // Fetch pull requests when repository changes
  useEffect(() => {
    if (enabled && repositoryId) {
      fetchPRs();
    }
  }, [repositoryId, enabled]);

  if (!enabled) {
    return null;
  }

  if (!repositoryId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pull Requests</CardTitle>
          <CardDescription>
            Select a repository to view pull requests
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pull Requests</CardTitle>
          <CardDescription>Loading pull requests...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pull Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPRs}
            className="mt-4"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pull Requests</CardTitle>
          <CardDescription>
            {pullRequests.length} pull request
            {pullRequests.length !== 1 ? "s" : ""} found
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchPRs}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {pullRequests.length === 0 ? (
          <Alert>
            <AlertDescription>
              No pull requests found in this repository.
            </AlertDescription>
          </Alert>
        ) : (
          pullRequests.map((pr) => (
            <Card key={pr.pullRequestId} className="overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <GitPullRequest className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <h3 className="font-medium">{pr.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-4">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          <span>{pr.createdBy.displayName}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(pr.creationDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <Badge variant={"default"}>{pr.status}</Badge>
                    <button
                      type="button"
                      className="self-end cursor-pointer"
                      onClick={() => handleCopy(pr)}
                    >
                      <Copy size={"20px"} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
