"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FC, JSX, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { getProjects, getTeamListByProject, postTask } from "@/lib/api";
import { TTeam } from "@/app/(withDashboardLayout)/dashboard/project/page";
import { toast } from "sonner";
import Loading from "@/utils/Loading";

type TTAddEdmitaskModalProps = {
  title: string | JSX.Element;
  item?: any;
};

const AddEditTaskModal: FC<TTAddEdmitaskModalProps> = ({ item, title }) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const isEditMode = !!item;
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [teams, setTeams] = useState<TTeam>();

  useEffect(() => {
    if (isModalOpen) {
      loadProjects();
    }
  }, [isModalOpen]);

  const loadProjects = async () => {
    const res = await getProjects();
    setProjects(res);
  };

  const handleOnSubmit = async (data: FieldValues) => {
    console.log("first");
    setIsLoading(true);
    const res = await postTask(data);
    if (res && res.success) {
      setIsLoading(false);
      toast.success("Added succesfully");
      reset();
      setIsModalOpen(false);
    } else {
      setIsLoading(false);
      toast.error("someting went wrong");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{title}</Button>
      </DialogTrigger>
      <DialogContent className="w-full lg:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
            {/* Task Name */}
            <div className="space-y-2">
              <Label>Task Name *</Label>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Task name is required" }}
                render={({ field }) => (
                  <Input {...field} placeholder="Task Name" />
                )}
              />
              {errors?.title && (
                <span className="text-red-500">
                  {errors.title.message as string}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description *</Label>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <Textarea {...field} placeholder="Write task details..." />
                )}
              />
              {errors?.description && (
                <span className="text-red-500">
                  {errors.description.message as string}
                </span>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority *</Label>
              <Controller
                name="priority"
                control={control}
                rules={{ required: "Priority is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors?.priority && (
                <span className="text-red-500">
                  {errors.priority.message as string}
                </span>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status *</Label>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors?.status && (
                <span className="text-red-500">
                  {errors.status.message as string}
                </span>
              )}
            </div>

            {/* Project Select */}
            <div className="space-y-2">
              <Label>Project *</Label>
              <Controller
                name="projectId"
                control={control}
                rules={{ required: "Project is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);

                      const selectedProject = projects.find(
                        (p) => p._id === value
                      );

                      // Set team data
                      setTeams(selectedProject?.teamId);
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects?.map((p: any) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors?.projectId && (
                <span className="text-red-500">
                  {errors.projectId.message as string}
                </span>
              )}
            </div>

            {/* Assigned Member */}
            <div className="space-y-2">
              <Label>Assign To</Label>
              <Controller
                name="assignedMemberId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams?.members?.map((m: any) => (
                        <SelectItem key={m._id} value={m._id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors?.assignedMemberId && (
                <span className="text-red-500">
                  {errors.assignedMemberId.message as string}
                </span>
              )}
            </div>
          </div>

          <div className="flex mt-5 justify-end">
            <Button type="submit">{isLoading ? <Loading /> : "Submit"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditTaskModal;
