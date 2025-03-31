import { getSecureCookie } from "@/app/actions";
import { type NextRequest, NextResponse } from "next/server";
import { azureDevOpsAxiosServer } from "../axios";
import { IAzureDevopsResponse } from "../types/global";
import { IAzureDevOpsRepository } from "../types/repository";

export async function POST(request: NextRequest) {
  try {
    const token = await getSecureCookie("azureDevOpsToken");
    const { organization, project } = await request.json();
    const azureDevopsApi = await azureDevOpsAxiosServer();

    if (!token || !organization || !project || azureDevopsApi === null) {
      return NextResponse.json(
        { error: "Token, organization, and project are required" },
        { status: 400 }
      );
    }

    // Make the request to Azure DevOps API from the server
    const response = await azureDevopsApi.get<
      IAzureDevopsResponse<IAzureDevOpsRepository>
    >(`/${project}/_apis/git/repositories`);

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
    console.error("Error in repositories API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
