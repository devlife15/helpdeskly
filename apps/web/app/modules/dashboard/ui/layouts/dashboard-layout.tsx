import { AuthGuard } from "@/app/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/app/modules/auth/ui/components/org-guard";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { DashboardSidebar } from "@/app/modules/dashboard/ui/components/dashboard-sidebar";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export const DashboardLayout = async ({
  children,
}: {
  children: ReactNode;
}) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <AuthGuard>
      <OrganizationGuard>
        <SidebarProvider defaultOpen={defaultOpen}>
          <DashboardSidebar />
          <main className="flex flex-1 flex-col">{children}</main>
        </SidebarProvider>
      </OrganizationGuard>
    </AuthGuard>
  );
};
