"use client";

import { IAzureDevopsResponse } from "@/app/api/azure-devops/types/global";
import { IAzureDevopsProject } from "@/app/api/azure-devops/types/project";
import { IAzureDevopsPullRequest } from "@/types/pull-requests";
import { IAzureDevOpsRepository } from "@/types/repositories";

// Azure DevOps API utility functions through our server-side API routes

interface AzureDevOpsConfig {
  organization?: string;
  project?: string;
}

// Function to fetch projects from Azure DevOps
export async function fetchProjects() {
  try {
    const response = await fetch("/api/azure-devops/projects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          `Error fetching projects: ${response.status} ${response.statusText}`
      );
    }

    const data: IAzureDevopsProject[] = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

// Function to fetch repositories from Azure DevOps
export async function fetchRepositories({
  organization,
  project,
}: AzureDevOpsConfig) {
  if (!organization || !project) {
    throw new Error(
      "Organization and project are required to fetch repositories"
    );
  }

  try {
    const response = await fetch("/api/azure-devops/repositories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ organization, project }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          `Error fetching repositories: ${response.status} ${response.statusText}`
      );
    }

    const data: IAzureDevopsResponse<IAzureDevOpsRepository> =
      await response.json();
    return data.value || [];
  } catch (error) {
    console.error("Error fetching repositories:", error);
    throw error;
  }
}

// Function to fetch pull requests from a specific repository
export async function fetchPullRequests({
  organization,
  project,
  repositoryId,
  status = "active", // Can be 'active', 'completed', 'abandoned', or 'all'
}: AzureDevOpsConfig & { repositoryId: string; status?: string }) {
  if (!organization || !project || !repositoryId) {
    throw new Error(
      "Organization, project, and repositoryId are required to fetch pull requests"
    );
  }

  try {
    const response = await fetch("/api/azure-devops/pull-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organization,
        project,
        repositoryId,
        status,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          `Error fetching pull requests: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return (data.value as IAzureDevopsPullRequest[]) || [];
  } catch (error) {
    console.error("Error fetching pull requests:", error);
    throw error;
  }
}

export interface FetchTasksFromPRParams extends AzureDevOpsConfig {
  repositoryId: string;
  pullRequestId: string;
}

// Função para buscar as tasks relacionadas a um PR
export async function fetchTasksFromPR({
  organization,
  project,
  repositoryId,
  pullRequestId,
}: FetchTasksFromPRParams) {
  if (!organization || !project || !repositoryId || !pullRequestId) {
    throw new Error(
      "Organization, project, repositoryId e pullRequestId são obrigatórios"
    );
  }

  try {
    const response = await fetch("/api/azure-devops/pull-requests/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organization,
        project,
        repositoryId,
        pullRequestId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          `Erro ao buscar tasks do PR: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar tasks do PR:", error);
    throw error;
  }
}
