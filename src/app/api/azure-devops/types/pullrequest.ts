import { IAzureDevOpsRepository } from "./repository";

export interface IAzureDevOpsPullRequest {
  repository: IAzureDevOpsRepository;
  pullRequestId: number;
  codeReviewId: number;
  status: string;
  createdBy: IAzureDevOpsEdBy;
  creationDate: Date;
  closedDate: Date;
  title: string;
  sourceRefName: string;
  targetRefName: string;
  mergeStatus: string;
  isDraft: boolean;
  mergeId: string;
  lastMergeSourceCommit: IAzureDevOpsLastMergeSourceCommitClass;
  lastMergeTargetCommit: IAzureDevOpsLastMergeSourceCommitClass;
  lastMergeCommit: IAzureDevOpsLastMergeCommit;
  reviewers: IAzureDevOpsReviewer[];
  url: string;
  _links: Record<string, IAzureDevOpsLink>;
  completionOptions: IAzureDevOpsCompletionOptions;
  supportsIterations: boolean;
  completionQueueTime: Date;
  closedBy: IAzureDevOpsEdBy;
  artifactId: string;
}

export interface IAzureDevOpsLink {
  href: string;
}

export interface IAzureDevOpsEdBy {
  displayName: string;
  url: string;
  _links: IAzureDevOpsLinks;
  id: string;
  uniqueName: string;
  imageUrl: string;
  descriptor: string;
}

export interface IAzureDevOpsLinks {
  avatar: IAzureDevOpsLink;
}

export interface IAzureDevOpsCompletionOptions {
  mergeCommitMessage: string;
  deleteSourceBranch: boolean;
  squashMerge: boolean;
  mergeStrategy: string;
  autoCompleteIgnoreConfigIds: any[];
}

export interface IAzureDevOpsLastMergeCommit {
  commitId: string;
  author: IAzureDevOpsAuthor;
  committer: IAzureDevOpsAuthor;
  comment: string;
  commentTruncated: boolean;
  url: string;
}

export interface IAzureDevOpsAuthor {
  name: string;
  email: string;
  date: Date;
}

export interface IAzureDevOpsLastMergeSourceCommitClass {
  commitId: string;
  url: string;
}

export interface IAzureDevOpsReviewer {
  reviewerUrl: string;
  vote: number;
  hasDeclined: boolean;
  isRequired: boolean;
  isFlagged: boolean;
  displayName: string;
  url: string;
  _links: IAzureDevOpsLinks;
  id: string;
  uniqueName: string;
  imageUrl: string;
}
