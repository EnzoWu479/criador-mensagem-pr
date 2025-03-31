import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AzureDevOpsForm from "@/components/azure-devops-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Azure DevOps PR Viewer</CardTitle>
          <CardDescription>Enter repository and PR details</CardDescription>
        </CardHeader>
        <CardContent>
          <AzureDevOpsForm />
        </CardContent>
      </Card>
    </main>
  );
}
