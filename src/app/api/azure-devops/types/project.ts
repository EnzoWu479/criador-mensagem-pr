export interface IAzureDevopsProject {
  id: string;
  name: string;
  url: string;
  collection: IAzureDevopsCollection;
  state: string;
  defaultTeam: IAzureDevopsDefaultTeam;
  revision: number;
  visibility: string;
  lastUpdateTime: Date;
}

export interface IAzureDevopsCollection {
  id: string;
  name: string;
  url: string;
  collectionUrl: string;
}

export interface IAzureDevopsDefaultTeam {
  id: string;
  name: string;
  url: string;
}
