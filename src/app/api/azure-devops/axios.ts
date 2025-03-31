import axios from "axios";

export const azureDevOpsAxios = (token: string, organization: string) => {
  return axios.create({
    baseURL: `https://dev.azure.com/${organization}/_apis/`,
    headers: {
      Authorization: `Basic ${Buffer.from(`:${token}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    params: {
      api_version: "7.1-preview.1",
    },
  });
};
