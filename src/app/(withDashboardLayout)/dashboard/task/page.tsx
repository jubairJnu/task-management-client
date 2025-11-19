"use client";

import AddEditTaskModal from "@/components/task/AddEditTaskModal";
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
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Task List
        </h2>
        <AddEditTaskModal title={"Add New Task"} />
      </div>
    </div>
  );
};

export default TaskPage;
