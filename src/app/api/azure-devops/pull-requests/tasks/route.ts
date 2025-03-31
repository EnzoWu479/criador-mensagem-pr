import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token, organization, project, repositoryId, pullRequestId } = await request.json();

    if (!token || !organization || !project || !repositoryId || !pullRequestId) {
      return NextResponse.json(
        { error: "Token, organization, project, repositoryId e pullRequestId são obrigatórios" },
        { status: 400 }
      );
    }

    // 🔹 1️⃣ Buscar os Work Items vinculados ao PR
    const workItemsUrl = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/pullRequests/${pullRequestId}/workitems?api-version=7.1-preview.1`;

    const workItemsResponse = await fetch(workItemsUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(`:${token}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
    });

    if (!workItemsResponse.ok) {
      return NextResponse.json(
        { error: `Erro ao buscar Work Items vinculados ao PR: ${workItemsResponse.status} ${workItemsResponse.statusText}` },
        { status: workItemsResponse.status }
      );
    }

    const workItemsData = await workItemsResponse.json();
    const workItems = workItemsData.value || [];

    if (workItems.length === 0) {
      return NextResponse.json({ message: "Nenhum Work Item vinculado a esse PR." });
    }

    // 🔹 2️⃣ Buscar detalhes dos Work Items, incluindo nome (title)
    const taskIds = workItems.map((item: any) => item.id).join(",");
    const tasksUrl = `https://dev.azure.com/${organization}/${project}/_apis/wit/workitems?ids=${taskIds}&fields=System.Title&api-version=7.1`;

    const tasksResponse = await fetch(tasksUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(`:${token}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
    });

    if (!tasksResponse.ok) {
      return NextResponse.json(
        { error: `Erro ao buscar detalhes dos Work Items: ${tasksResponse.status} ${tasksResponse.statusText}` },
        { status: tasksResponse.status }
      );
    }

    const tasksData = await tasksResponse.json();

    // 🔹 3️⃣ Retorna um array com ID, Nome e Link para cada Work Item
    const formattedWorkItems = tasksData.value.map((task: any) => ({
      id: task.id,
      title: task.fields["System.Title"],
      link: `https://dev.azure.com/${organization}/${project}/_workitems/edit/${task.id}`, // 🔗 Link direto para o Work Item
    }));

    return NextResponse.json(formattedWorkItems);
  } catch (error) {
    console.error("Erro na rota /api/azure-devops/pr-workitems:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
