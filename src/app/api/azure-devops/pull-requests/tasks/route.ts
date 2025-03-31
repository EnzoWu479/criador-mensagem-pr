import { getSecureCookie } from "@/app/actions";
import { type NextRequest, NextResponse } from "next/server";
import { azureDevOpsAxiosServer } from "../../axios";
import { IAzureDevopsResponse } from "../../types/global";
import {
  IAzureDevOpsWorkItemDetails,
  IAzureDevopsWorkItemSimple,
} from "../../types/workitem";

export async function POST(request: NextRequest) {
  try {
    const token = await getSecureCookie("azureDevOpsToken");
    const organization = await getSecureCookie("organization");
    const { project, repositoryId, pullRequestId } = await request.json();
    const azureDevopsApi = await azureDevOpsAxiosServer();

    if (
      !token ||
      !project ||
      !repositoryId ||
      !pullRequestId ||
      !azureDevopsApi
    ) {
      return NextResponse.json(
        {
          error:
            "Token, organization, project, repositoryId e pullRequestId são obrigatórios",
        },
        { status: 400 }
      );
    }

    // 🔹 1️⃣ Buscar os Work Items vinculados ao PR
    const workItemsUrl = `/${project}/_apis/git/repositories/${repositoryId}/pullRequests/${pullRequestId}/workitems`;

    const workItemsResponse = await azureDevopsApi.get<
      IAzureDevopsResponse<IAzureDevopsWorkItemSimple>
    >(workItemsUrl);

    if (workItemsResponse.status !== 200) {
      return NextResponse.json(
        {
          error: `Erro ao buscar Work Items vinculados ao PR: ${workItemsResponse.status} ${workItemsResponse.statusText}`,
        },
        { status: workItemsResponse.status }
      );
    }
    const workItems = workItemsResponse.data.value || [];

    if (workItems.length === 0) {
      return NextResponse.json({
        message: "Nenhum Work Item vinculado a esse PR.",
      });
    }

    // 🔹 2️⃣ Buscar detalhes dos Work Items, incluindo nome (title) e tipo (PBI ou Task)
    const taskIds = workItems.map((item) => item.id).join(",");

    const tasksResponse = await azureDevopsApi.get<
      IAzureDevopsResponse<IAzureDevOpsWorkItemDetails>
    >(`/${project}/_apis/wit/workitems`, {
      params: {
        ids: taskIds,
        fields: "System.Title,System.WorkItemType",
      },
    });

    if (tasksResponse.status !== 200) {
      return NextResponse.json(
        {
          error: `Erro ao buscar detalhes dos Work Items: ${tasksResponse.status} ${tasksResponse.statusText}`,
        },
        { status: tasksResponse.status }
      );
    }

    const tasksData = tasksResponse.data;

    // 🔹 3️⃣ Retorna um array com ID, Nome, Tipo e Link para cada Work Item
    const formattedWorkItems = tasksData.value.map((task) => ({
      id: task.id,
      title: task.fields["System.Title"],
      type: task.fields["System.WorkItemType"], // 🔹 Tipo do Work Item (ex: "Task", "Product Backlog Item")
      link: `https://dev.azure.com/${organization}/${project}/_workitems/edit/${task.id}`,
    }));

    return NextResponse.json(formattedWorkItems);
  } catch (error) {
    console.error("Erro na rota /api/azure-devops/pr-workitems:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
