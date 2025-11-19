"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";

const TaskPage = () => {
  const {
    control,
    formState: { errors },
  } = useForm();
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        Create New Task
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
        </div>
      </form>
    </div>
  );
};

export default TaskPage;
