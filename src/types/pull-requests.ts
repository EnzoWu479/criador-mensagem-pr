export interface IAzureDevopsPullRequest {
  repository: Repository;
  pullRequestId: number;
  codeReviewId: number;
  status: "active" | "abandoned" | "completed";
  createdBy: CreatedBy;
  creationDate: Date;
  title: string;
  sourceRefName: string;
  targetRefName: string;
  mergeStatus: string;
  isDraft: boolean;
  mergeId: string;
  lastMergeSourceCommit: LastMergeCommit;
  lastMergeTargetCommit: LastMergeCommit;
  lastMergeCommit: LastMergeCommit;
  reviewers: Reviewer[];
  url: string;
  supportsIterations: boolean;
}

export interface CreatedBy {
  displayName: string;
  url: string;
  _links: Links;
  id: string;
  uniqueName: string;
  imageUrl: string;
  descriptor: string;
}

export interface Links {
  avatar: Avatar;
}

export interface Avatar {
  href: string;
}

export interface LastMergeCommit {
  commitId: string;
  url: string;
}

export interface Repository {
  id: string;
  name: string;
  url: string;
  project: Project;
}

export interface Project {
  id: string;
  name: string;
  state: string;
  visibility: string;
  lastUpdateTime: Date;
}

export interface Reviewer {
  reviewerUrl: string;
  vote: number;
  hasDeclined: boolean;
  isRequired: boolean;
  isFlagged: boolean;
  displayName: string;
  url: string;
  _links: Links;
  id: string;
  uniqueName: string;
  imageUrl: string;
}
