"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTeamList } from "@/lib/api";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export type TTeam = {
  _id: string;
  name: string;
  capacity?: number;
  // other fields…
};

type TRes = {
  data: TTeam[];
};

const ProjectPage = () => {
  const [teamList, setTeamList] = useState<TRes>();
  useEffect(() => {
    const loadTeams = async () => {
      const data = await getTeamList();
      setTeamList(data as any);
    };
    loadTeams();
  }, []);

  const {
    control,
    formState: { errors },
  } = useForm();
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        Create New Project
      </h2>
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label>Project Name *</Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Project is required" }}
              render={({ field }) => (
                <Input {...field} placeholder="project Name" />
              )}
            />
            {errors?.name && (
              <span className="text-red-500">
                {errors?.name?.message as string}
              </span>
            )}
          </div>
          <div>
            <Label>Link Team *</Label>

            <Controller
              name="teamId"
              control={control}
              rules={{ required: "Team is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>

                  <SelectContent>
                    {teamList?.data?.map((team: any) => (
                      <SelectItem key={team._id} value={team._id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors?.teamId && (
              <span className="text-red-500 text-sm">
                {errors.teamId.message as string}
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProjectPage;
