import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token, organization, project, repositoryId, status = "all" } = await request.json()

    if (!token || !organization || !project || !repositoryId) {
      return NextResponse.json(
        { error: "Token, organization, project, and repositoryId are required" },
        { status: 400 },
      )
    }

    // Make the request to Azure DevOps API from the server
    const response = await fetch(
      `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/pullrequests?searchCriteria.status=${status}&api-version=7.0`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`:${token}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: `Azure DevOps API error: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in pull-requests API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

