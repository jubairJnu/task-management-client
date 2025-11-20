"use client";

import { TTeam } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTeamList, postProject } from "@/lib/api";
import Loading from "@/utils/Loading";
import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";


const ProjectPage = () => {
  const [teamList, setTeamList] = useState<TTeam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const loadTeams = async () => {
      const data = await getTeamList();
      setTeamList(data);
    };
    loadTeams();
  }, []);

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();

  const handleAdd = async (data: FieldValues) => {
    setIsLoading(true);
    const res = await postProject(data);
    if (res && res.success) {
      setIsLoading(false);
      toast.success("Added successfully");
      reset();
    } else {
      setIsLoading(false);
      toast.error("something went wrong");
    }
  };

  console.log(teamList, "team");

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        Create New Project
      </h2>
      <form onSubmit={handleSubmit(handleAdd)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2.5">
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
          <div className="space-y-2.5">
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
                    {teamList?.map((team: any) => (
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
        <div className="mt-5 flex justify-end">
          <Button type="submit">{isLoading ? <Loading /> : "Submit"}</Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectPage;
