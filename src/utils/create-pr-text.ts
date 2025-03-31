import { IAzureDevopsPullRequest } from "@/types/pull-requests";

export type IWorkItem = {
  id: number;
  title: string;
  link: string;
};

export const createPrText = (
  pullRequest: IAzureDevopsPullRequest,
  workItems: IWorkItem[]
) => {
  return `Repositório: <a href="${pullRequest.repository.url}">${
    pullRequest.repository.name
  }</a>
 
${workItems
  .map((item) => `- <a href="${item.link}">${item.title}</a>`)
  .join("<br>")}
Branch Origin: ${pullRequest.sourceRefName.replace("refs/heads/", "")}
Branch Target: ${pullRequest.targetRefName.replace("refs/heads/", "")}
Link PR: <a href="${pullRequest.url}">${pullRequest.title}</a>
 
Reviewers: ${pullRequest.reviewers
    .map((reviewer) => reviewer.displayName)
    .join(", ")}`;
};
