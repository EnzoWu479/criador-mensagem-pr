import { getSecureCookie } from "@/app/actions";
import axios from "axios";

export const azureDevOpsAxios = (token: string, organization: string) => {
  return axios.create({
    baseURL: `https://dev.azure.com/${organization}`,
    headers: {
      Authorization: `Basic ${Buffer.from(`:${token}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    params: {
      api_version: "7.1-preview.1",
    },
  });
};
export const azureDevOpsAxiosServer = async () => {
  const token = await getSecureCookie("azureDevOpsToken");
  const organization = await getSecureCookie("organization");

  if (!token || !organization) {
    return null;
  }

  return azureDevOpsAxios(token, organization);
};
