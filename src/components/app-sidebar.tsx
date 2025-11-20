"use client";

import * as React from "react";
import { FileClock, FolderGit2, LayoutDashboard, ListChecks, Users } from "lucide-react";

import { NavMain } from "@/components/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Team", url: "/dashboard/team", icon: Users },
    { title: "Project", url: "/dashboard/project", icon: FolderGit2 },
    { title: "Task", url: "/dashboard/task", icon: ListChecks },
    {
      title: "Activity Logs",
      url: "/dashboard/activity-logs",
      icon: FileClock,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
  
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
     
      <SidebarRail />
    </Sidebar>
  );
}
