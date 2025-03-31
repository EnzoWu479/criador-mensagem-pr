import { fetchProjects } from "@/lib/azure-devops-api";
import { useQuery } from "@tanstack/react-query";

export const useQueryProjects = (token: string, organization: string) => {
  const query = useQuery({
    queryKey: ["projects", token, organization],
    queryFn: async () => {
      const response = await fetchProjects();
      return response;
    },
    enabled: !!token && !!organization,
    retry: false,
  });

  return query;
};
