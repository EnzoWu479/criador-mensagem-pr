import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token, organization, project } = await request.json()

    if (!token || !organization || !project) {
      return NextResponse.json({ error: "Token, organization, and project are required" }, { status: 400 })
    }

    // Make the request to Azure DevOps API from the server
    const response = await fetch(
      `https://dev.azure.com/${organization}/${project}/_apis/git/repositories?api-version=7.0`,
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
    console.error("Error in repositories API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

