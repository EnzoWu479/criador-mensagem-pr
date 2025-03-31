import { NextResponse } from "next/server";
import { azureDevOpsAxiosServer } from "../axios";
import { IAzureDevopsResponse } from "../types/global";
import { IAzureDevopsProject } from "../types/project";

export async function GET() {
  try {
    const azureDevopsApi = await azureDevOpsAxiosServer();

    if (!azureDevopsApi) {
      return NextResponse.json(
        { error: "Token and organization are required" },
        { status: 400 }
      );
    }

    // Make the request to Azure DevOps API from the server
    const response = await azureDevopsApi.get<
      IAzureDevopsResponse<IAzureDevopsProject>
    >(`/_apis/projects`);

    if (response.status !== 200) {
      return NextResponse.json(
        {
          error: `Azure DevOps API error: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data.value);
  } catch (error) {
    console.error("Error in projects API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
