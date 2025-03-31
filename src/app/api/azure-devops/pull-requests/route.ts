import { getSecureCookie } from "@/app/actions";
import { type NextRequest, NextResponse } from "next/server";
import { azureDevOpsAxiosServer } from "../axios";
import { IAzureDevOpsPullRequest } from "../types/pullrequest";

export async function POST(request: NextRequest) {
  try {
    const token = await getSecureCookie("azureDevOpsToken");
    const azureDevopsApi = await azureDevOpsAxiosServer();
    const {
      organization,
      project,
      repositoryId,
      status = "all",
    } = await request.json();

    if (
      !token ||
      !organization ||
      !project ||
      !repositoryId ||
      !azureDevopsApi
    ) {
      return NextResponse.json(
        {
          error: "Token, organization, project, and repositoryId are required",
        },
        { status: 400 }
      );
    }

    // Make the request to Azure DevOps API from the server
    const response = await azureDevopsApi.get<IAzureDevOpsPullRequest>(
      `/${project}/_apis/git/repositories/${repositoryId}/pullrequests`,
      {
        params: {
          "searchCriteria.status": status,
        },
      }
    );

    if (response.status !== 200) {
      return NextResponse.json(
        {
          error: `Azure DevOps API error: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error in pull-requests API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
