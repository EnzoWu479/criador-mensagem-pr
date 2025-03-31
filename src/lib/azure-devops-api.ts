"use client";

import { IAzureDevopsPullRequest } from "@/types/pull-requests";

// Azure DevOps API utility functions through our server-side API routes

interface AzureDevOpsConfig {
  token: string;
  organization?: string;
  project?: string;
}

// Function to fetch organizations from Azure DevOps
export async function fetchOrganizations({ token }: AzureDevOpsConfig) {
  try {
    const response = await fetch("/api/azure-devops/organizations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          `Error fetching organizations: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.value || [];
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
}

// Function to fetch projects from Azure DevOps
export async function fetchProjects({
  token,
  organization,
}: AzureDevOpsConfig) {
  if (!organization) {
    throw new Error("Organization is required to fetch projects");
  }

  try {
    const response = await fetch("/api/azure-devops/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, organization }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          `Error fetching projects: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.value || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

// Function to fetch repositories from Azure DevOps
export async function fetchRepositories({
  token,
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
      body: JSON.stringify({ token, organization, project }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          `Error fetching repositories: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.value || [];
  } catch (error) {
    console.error("Error fetching repositories:", error);
    throw error;
  }
}

// Function to fetch pull requests from a specific repository
export async function fetchPullRequests({
  token,
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
        token,
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
  token,
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
        token,
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
