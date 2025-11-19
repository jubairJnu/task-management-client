"use client";

import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStats } from "@/lib/api";
import {
  AlertCircle,
  ArrowRight,
  FolderKanban,
  ListTodo,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import moment from "moment";
import ReassignTasks from "@/components/ReasginTaskModal";
import { TDashboardData } from "@/app/types";

const DashbboardPage = () => {
  const [summayList, setSummayList] = useState<TDashboardData>();

  useEffect(() => {
    const loadSummary = async () => {
      const data = await getStats();
      setSummayList(data as any);
    };
    loadSummary();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Team Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
              Monitor workload and manage task assignments
            </p>
          </div>

          <ReassignTasks />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Projects
              </CardTitle>
              <FolderKanban className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {summayList?.totalProjects}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Active projects in progress
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Tasks
              </CardTitle>
              <ListTodo className="w-5 h-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {summayList?.totalTasks}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Tasks across all projects
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Summary */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Summary
            </CardTitle>
            <CardDescription>
              Current workload distribution across team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summayList?.teamSummary?.map((member) => (
                <div
                  key={member._id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    member.isOverloaded
                      ? "bg-red-50 border-red-200"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {member.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {member.role}
                        </Badge>
                        {member.isOverloaded && (
                          <Badge
                            variant="destructive"
                            className="text-xs flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3" />
                            Overloaded
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {member.currentTasks} / {member.capacity} tasks assigned
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          member.isOverloaded ? "bg-red-500" : "bg-emerald-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            (member.currentTasks / member.capacity) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium min-w-12 text-right ${
                        member.isOverloaded ? "text-red-600" : "text-slate-700"
                      }`}
                    >
                      {Math.round(
                        (member.currentTasks / member.capacity) * 100
                      )}
                      %
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reassignments */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Reassignments</CardTitle>
            <CardDescription>Last 5 task reassignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summayList?.recentReassignments
                ?.slice(0, 5)
                ?.map((reassignment) => (
                  <div
                    key={reassignment._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Task #{reassignment.taskId}
                        </p>
                        <p className="text-xs text-slate-600">
                          <span className="font-medium">
                            {reassignment.fromMember}
                          </span>
                          <ArrowRight className="w-3 h-3 inline mx-1" />
                          <span className="font-medium">
                            {reassignment.toMember}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">
                      {moment(reassignment.timestamp).fromNow()}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashbboardPage;
