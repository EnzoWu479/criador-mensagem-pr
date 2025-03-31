import { IAzureDevopsPullRequest } from "@/types/pull-requests";

export type IWorkItem = {
  id: number;
  title: string;
  type: string;
  link: string;
};

export const createPrText = (
  pullRequest: IAzureDevopsPullRequest,
  workItems: IWorkItem[]
) => {
  return `Repositório: <a href="${pullRequest.repository.url}">${
    pullRequest.repository.name
  }</a><br><br>
 
${workItems
  .map((item) => `- [${item.type}] <a href="${item.link}">${item.title}</a>`)
  .join("<br>")}<br>
Branch Origin: ${pullRequest.sourceRefName.replace("refs/heads/", "")}<br>
Branch Target: ${pullRequest.targetRefName.replace("refs/heads/", "")}<br>
Link PR: <a href="${pullRequest.url}">${pullRequest.title}</a><br><br>
 
Reviewers: ${pullRequest.reviewers
    .map((reviewer) => reviewer.displayName)
    .join(", ")}`;
};
