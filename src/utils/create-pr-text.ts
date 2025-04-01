import { IAzureDevopsPullRequest } from "@/types/pull-requests";

export type IWorkItem = {
  id: number;
  title: string;
  type: string;
  link: string;
};

export const createPrText = (
  pullRequest: IAzureDevopsPullRequest,
  workItems: IWorkItem[],
  organization: string,
) => {
  const prLink = `https://dev.azure.com/${organization}/${pullRequest.repository.project.name}/_git/${pullRequest.repository.name}/pullrequest/${pullRequest.pullRequestId}`;
  return `Repositório: <a href="${pullRequest.repository.url}">${
    pullRequest.repository.name
  }</a><br><br>
 
${workItems
  .map((item) => `- [${item.type} ${item.id}] <a href="${item.link}">${item.title}</a>`)
  .join("<br>")}<br>
Branch Origin: ${pullRequest.sourceRefName.replace("refs/heads/", "")}<br>
Branch Target: ${pullRequest.targetRefName.replace("refs/heads/", "")}<br>
Link PR: <a href="${prLink}">${pullRequest.pullRequestId} ${pullRequest.title}</a><br><br>
 
Reviewers: ${pullRequest.reviewers
    .map((reviewer) => reviewer.displayName)
    .join(", ")}`;
};
