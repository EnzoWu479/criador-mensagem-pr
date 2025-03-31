"use client";

import { useState, useEffect } from "react";
import RepositorySelect from "./repository-select";
import ProjectSelect from "./project-select";
import TokenButton from "./token-button";
import TokenInput from "./token-input";
import PullRequestsList from "./pull-requests-list";
import { getCookie } from "@/lib/cookies";
import { getSecureCookie } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import OrganizationInput from "./organization-input";
import { AzurePRInfo, PrInput } from "./pr-input";

export default function AzureDevOpsForm() {
  const [repository, setRepository] = useState("");
  const [actualOrganization, setActualOrganization] = useState("");
  const [organization, setOrganization] = useState("");
  const [project, setProject] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [token, setToken] = useState("");
  const [hasStoredToken, setHasStoredToken] = useState(false);
  const [actualToken, setActualToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiEnabled, setApiEnabled] = useState(false);
  const [projSelectEnabled, setProjectSelectEnabled] = useState(false);
  const [repoSelectEnabled, setRepoSelectEnabled] = useState(false);
  const [pullRequestId, setPullRequestId] = useState<string>("");

  // Check for existing token in cookies on component mount
  useEffect(() => {
    const checkForToken = async () => {
      setIsLoading(true);

      // First try to get from client-side cookie
      const clientToken = getCookie("azureDevOpsToken");
      const clientOrganization = getCookie("organization");

      if (clientToken) {
        setToken("••••••••••••••••"); // Mask for display
        setActualToken(clientToken); // Store actual token for API calls
      }

      if (clientOrganization) {
        setOrganization(clientOrganization); // Store organization from client cookie
        setActualOrganization(clientOrganization); // Store actual organization for API calls
      }

      if (clientToken && clientOrganization) {
        setHasStoredToken(true);
        setIsLoading(false);
        return;
      }

      // If not found, try to get from server-side HttpOnly cookie
      try {
        const serverToken = await getSecureCookie("azureDevOpsToken");
        const serverOrganization = await getSecureCookie("organization");
        if (serverToken) {
          setToken("••••••••••••••••"); // Mask the actual token value for security
          setActualToken(serverToken); // Store actual token for API calls
        }

        if (serverOrganization) {
          setOrganization(serverOrganization); // Store organization from server cookie
          setActualOrganization(serverOrganization); // Store actual organization for API calls
        }

        if (serverToken && serverOrganization) {
          setHasStoredToken(true);
        }
      } catch (error) {
        console.error("Error fetching token from server:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkForToken();
  }, []);

  // Enable project select when organization is selected
  useEffect(() => {
    if (organization) {
      setProjectSelectEnabled(true);
    } else {
      setProjectSelectEnabled(false);
      setProject("");
    }
  }, [organization]);

  // Enable repository select when project is selected
  useEffect(() => {
    if (project) {
      setRepoSelectEnabled(true);
    } else {
      setRepoSelectEnabled(false);
      setRepository("");
    }
  }, [project]);

  const toggleTokenInput = () => {
    setShowTokenInput(!showTokenInput);
  };

  const handleFetchData = () => {
    if (organization && project && actualToken) {
      setApiEnabled(true);
    }
  };

  // When token is saved, enable organization select
  const handleTokenSaved = (savedToken: string) => {
    setActualToken(savedToken);
    setHasStoredToken(true);
  };

  const handleOrganizationSaved = (savedOrganization: string) => {
    setActualOrganization(savedOrganization);
    setHasStoredToken(true);
  };

  const handlePrExtract = (prInfo: AzurePRInfo) => {
    setActualOrganization(prInfo.organization);
    setProject(prInfo.project);
    setPullRequestId(prInfo.pullRequestId);
    setRepository(prInfo.repository);
    handleFetchData();
  };

  const formIsReady = organization && project && hasStoredToken;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {showTokenInput && (
          <>
            <TokenInput
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
              }}
              hasStoredToken={hasStoredToken}
              setHasStoredToken={setHasStoredToken}
              onTokenSaved={handleTokenSaved}
            />
            <OrganizationInput
              value={organization}
              onChange={(e) => {
                setOrganization(e.target.value);
              }}
              onOrganizationSaved={handleOrganizationSaved}
            />
          </>
        )}

        <PrInput onExtract={handlePrExtract} />

        <ProjectSelect
          value={project}
          onValueChange={setProject}
          token={actualToken}
          organization={actualOrganization}
          enabled={projSelectEnabled}
        />

        <RepositorySelect
          value={repository}
          onValueChange={setRepository}
          token={actualToken}
          organization={actualOrganization}
          project={project}
          enabled={repoSelectEnabled}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_1fr] gap-4">
          <TokenButton
            onClick={toggleTokenInput}
            showingToken={showTokenInput}
            hasStoredToken={hasStoredToken}
          />

          <Button
            onClick={handleFetchData}
            disabled={!formIsReady || isLoading}
            className="whitespace-nowrap"
          >
            <Search className="mr-2 h-4 w-4" />
            Fetch Data
          </Button>
        </div>

        {apiEnabled && (
          <PullRequestsList
            token={actualToken}
            organization={organization}
            project={project}
            repositoryId={repository}
            enabled={apiEnabled}
            pullRequestId={pullRequestId}
          />
        )}
      </div>
    </div>
  );
}
