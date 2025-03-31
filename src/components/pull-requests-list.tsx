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
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { fetchPullRequests, fetchTasksFromPR } from "@/lib/azure-devops-api";
import { IAzureDevopsPullRequest } from "@/types/pull-requests";
import { createPrText } from "@/utils/create-pr-text";
import { cn } from "@/lib/utils";
import { useQueryPullrequests } from "@/hooks/queries/useQueryPullRequests";

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
  const [copyLoading, setCopyLoading] = useState(false);
  const { data, refetch, isLoading, error } = useQueryPullrequests({
    organization,
    project,
    repositoryId,
    status: "active", // Fetch all PRs regardless of status
  });

  const pullRequests = pullRequestId
    ? data?.filter((pr) => pr.pullRequestId.toString() === pullRequestId)
    : data;

  const handleCopy = async (pr: IAzureDevopsPullRequest) => {
    try {
      setCopyLoading(true);
      const tasks = await fetchTasksFromPR({
        organization,
        project,
        repositoryId,
        pullRequestId: pr.pullRequestId.toString(),
      });

      const prText = createPrText(pr, tasks);
      const blob = new Blob([prText], { type: "text/html" });
      const data = [new ClipboardItem({ "text/html": blob })];

      navigator.clipboard.write(data).then(() => {
        toast("Pull request ID copied to clipboard!");
      });
    } catch (error) {
      console.error("Error copying pull request ID:", error);
    } finally {
      setCopyLoading(false);
    }
  };

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

  if (isLoading) {
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
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
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
            {pullRequests?.length} pull request
            {pullRequests?.length !== 1 ? "s" : ""} found
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {pullRequests?.length === 0 ? (
          <Alert>
            <AlertDescription>
              No pull requests found in this repository.
            </AlertDescription>
          </Alert>
        ) : (
          pullRequests?.map((pr) => (
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
                      disabled={copyLoading}
                      className={cn(
                        "self-end cursor-pointer",
                        copyLoading && "opacity-50 cursor-not-allowed"
                      )}
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
