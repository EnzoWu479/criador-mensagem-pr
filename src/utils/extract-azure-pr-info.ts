export function extractAzurePRInfo(url: string) {
  const regex =
    /https:\/\/dev\.azure\.com\/([^\/]+)\/([^\/]+)\/_git\/([^\/]+)\/pullrequest\/(\d+)/;
  const match = url.match(regex);

  if (match) {
    return {
      organization: match[1],
      project: match[2],
      repository: match[3],
      pullRequestId: match[4],
    };
  }

  throw new Error("Invalid Azure DevOps PR URL");
}
