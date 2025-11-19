"use client";

import * as React from "react";
import {
  AudioWaveform,
  BarChart3,
  Barcode,
  BookOpen,
  Bot,
  CalendarSync,
  ChartColumnStacked,
  Command,
  CreditCard,
  Factory,
  Frame,
  GalleryVerticalEnd,
  Map,
  PanelsTopLeft,
  PieChart,
  Pill,
  SendToBack,
  Settings2,
  ShoppingCart,
  SquareTerminal,
  Store,
  TrendingUp,
  Venus,
  WalletMinimal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
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
    { title: "Genre", url: "/genre", icon: Venus },
    { title: "Category", url: "/category", icon: ChartColumnStacked },
    { title: "Manufacturer", url: "/manufacturer", icon: Factory },
    {
      title: "Medicine",
      url: "/medicine",
      icon: Pill,
      items: [
        {
          title: "Medicine List",
          url: "/medicine",
          icon: Pill,
        },

        {
          title: "Sales",
          url: "/sales",
          icon: TrendingUp,
        },
        {
          title: "Transfer",
          url: "/medicine/transfer",
          icon: CalendarSync,
        },
      ],
    },
    {
      title: "Finance",
      url: "/finance",
      icon: WalletMinimal,
      items: [
        {
          title: "Overview",
          url: "/finance/overview",
          icon: CreditCard,
        },
        {
          title: "Transactions",
          url: "/finance/transactions",
          icon: BarChart3,
        },
        {
          title: "Reports",
          url: "/finance/reports",
          icon: TrendingUp,
        },
      ],
    },
    {
      title: "Purchase",
      url: "/purchase",
      icon: ShoppingCart,
      items: [
        {
          title: "Purchase List",
          url: "/purchase",
          icon: Barcode,
        },
        {
          title: "New Purchase",
          url: "/purchase/new",
          icon: ShoppingCart,
        },
        // {
        //   title: "Transfer",
        //   url: "/stock/transfer",
        //   icon: <SendToBack className="w-4 h-4" />,
        // },
      ],
    },
    {
      title: "Stock",
      url: "/stock",
      icon: Store,
      items: [
        {
          title: "Overview",
          url: "/stock/overview",
          icon: PanelsTopLeft,
        },
        {
          title: "Transfer",
          url: "/stock/transfer",
          icon: SendToBack,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>{/* <TeamSwitcher teams={data.teams} /> */}</SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
