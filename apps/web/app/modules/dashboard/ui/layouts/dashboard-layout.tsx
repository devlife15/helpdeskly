import { AuthGuard } from "@/app/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/app/modules/auth/ui/components/org-guard";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { DashboardSidebar } from "@/app/modules/dashboard/ui/components/dashboard-sidebar";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { Provider } from "jotai";

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
        <Provider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <DashboardSidebar />
            <main className="flex flex-1 flex-col overflow-hidden">
              {/* {delete overflow-hidden} */}
              {children}
            </main>
          </SidebarProvider>
        </Provider>
      </OrganizationGuard>
    </AuthGuard>
  );
};
