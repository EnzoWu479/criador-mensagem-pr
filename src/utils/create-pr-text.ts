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
  return `Repositório: ${pullRequest.repository.name}
 
${workItems.map((item) => `- [${item.title}](${item.link})`).join("\n")}
Branch Origin: ${pullRequest.sourceRefName.replace("refs/heads/", "")}
Branch Target: ${pullRequest.targetRefName.replace("refs/heads/", "")}
Link PR: [${pullRequest.title}](${pullRequest.url})
 
Reviewers: ${pullRequest.reviewers
    .map((reviewer) => reviewer.displayName)
    .join(", ")}`;
};
