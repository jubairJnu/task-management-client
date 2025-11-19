"use client";

import { Button } from "@/components/ui/button";
import { postTeam } from "@/lib/api";
import Loading from "@/utils/Loading";
import { Mail, Plus, ShieldCheck, User, Users, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

const TeamPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      members: [{ name: "", capacity: 3, role: "Member" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    const res = await postTeam(data);

    if (res && res.success) {
      toast.success("Added Successfully");
      reset();
      setIsLoading(false);
    } else {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        Create New Team
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Team Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Team Name *
          </label>
          <input
            {...register("name", { required: "Team name is required" })}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter team name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}

        {/* Team Members */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Team Members *
            </label>
            <button
              type="button"
              onClick={() => append({ name: "", capacity: 1, role: "Member" })}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Member {index + 1}
                  </h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        {...register(`members.${index}.name`, {
                          required: "Name is required",
                        })}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.members?.[index]?.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.members[index].name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Capacity * (0-5)
                    </label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        {...register(`members.${index}.capacity`, {
                          required: "Capacity is required",
                          valueAsNumber: true,
                          max: 5,
                        })}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1"
                      />
                    </div>
                    {errors.members?.[index]?.capacity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.members[index]?.capacity.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Role
                    </label>
                    <select
                      {...register(`members.${index}.role`)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Member">Member</option>
                      <option value="Leader">Leader</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            // onClick={onCancel}
            className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <Button type="submit">{isLoading ? <Loading /> : "Submit"}</Button>
        </div>
      </form>
    </div>
  );
};

export default TeamPage;
