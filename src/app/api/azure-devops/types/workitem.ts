import { IAzureDevOpsLinks } from "./pullrequest";

export interface IAzureDevopsWorkItemSimple {
  id: string;
  url: string;
}

export interface IAzureDevOpsWorkItemDetails {
  id: number;
  rev: number;
  fields: IAzureDevOpsWorkItemFields;
  url: string;
}

export interface IAzureDevOpsWorkItemFields {
  "System.AreaPath": string;
  "System.TeamProject": string;
  "System.IterationPath": string;
  "System.WorkItemType": string;
  "System.State": string;
  "System.Reason": string;
  "System.AssignedTo": IAzureDevOpsMicrosoftVstsCommonActivatedBy;
  "System.CreatedDate": Date;
  "System.CreatedBy": IAzureDevOpsMicrosoftVstsCommonActivatedBy;
  "System.ChangedDate": Date;
  "System.ChangedBy": IAzureDevOpsMicrosoftVstsCommonActivatedBy;
  "System.CommentCount": number;
  "System.Title": string;
  "Microsoft.VSTS.Scheduling.OriginalEstimate": number;
  "Microsoft.VSTS.Common.StateChangeDate": Date;
  "Microsoft.VSTS.Common.ActivatedDate": Date;
  "Microsoft.VSTS.Common.ActivatedBy": IAzureDevOpsMicrosoftVstsCommonActivatedBy;
  "Microsoft.VSTS.Common.ClosedDate": Date;
  "Microsoft.VSTS.Common.ClosedBy": IAzureDevOpsMicrosoftVstsCommonActivatedBy;
  "Microsoft.VSTS.Common.Priority": number;
  "Custom.Horasexecutadas": number;
  "System.Description": string;
}

export interface IAzureDevOpsMicrosoftVstsCommonActivatedBy {
  displayName: string;
  url: string;
  _links: IAzureDevOpsLinks;
  id: string;
  uniqueName: string;
  imageUrl: string;
  descriptor: string;
}
