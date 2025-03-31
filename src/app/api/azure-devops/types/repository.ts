import { IAzureDevopsProject } from "./project";

export interface IAzureDevOpsRepository {
  id: string;
  name: string;
  url: string;
  project: IAzureDevopsProject;
  defaultBranch: string;
  size: number;
  remoteUrl: string;
  sshUrl: string;
  webUrl: string;
  isDisabled: boolean;
  isInMaintenance: boolean;
}
