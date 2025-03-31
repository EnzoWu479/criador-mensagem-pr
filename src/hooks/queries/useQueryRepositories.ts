import { fetchRepositories } from "@/lib/azure-devops-api";
import { useQuery } from "@tanstack/react-query";

export const useQueryRepositories = (
  token: string,
  organization: string,
  project: string
) => {
  const query = useQuery({
    queryKey: ["repositories", token, organization, project],
    queryFn: async () => {
      const response = await fetchRepositories({ organization, project });
      return response;
    },
    enabled: !!token && !!organization && !!project,
    retry: false,
  });

  return query;
};
