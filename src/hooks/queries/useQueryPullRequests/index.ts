import { useQuery } from "@tanstack/react-query";
import { UseQueryPullRequestsRequest } from "./types";
import { fetchPullRequests } from "@/lib/azure-devops-api";

export const useQueryPullrequests = ({
  organization,
  project,
  repositoryId,
  status,
}: UseQueryPullRequestsRequest) => {
  const query = useQuery({
    queryKey: ["pull-requests", organization, project, repositoryId, status],
    queryFn: async () => {
      const response = await fetchPullRequests({
        organization,
        project,
        repositoryId,
        status,
      });
      return response;
    },
    enabled: !!organization && !!project && !!repositoryId && !!status,
    retry: false,
  });

  return query;
};
