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
import { getProjects, getTeamListByProject } from "@/lib/api";
import { TTeam } from "@/app/(withDashboardLayout)/dashboard/project/page";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [teams, setTeams] = useState<TTeam[]>([]);
  const selectedProjectId = watch("projectId");

  useEffect(() => {
    if (isModalOpen) {
      loadProjects();
    }
  }, [isModalOpen]);

  const loadProjects = async () => {
    const res = await getProjects();
    setProjects(res);
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadTeams(selectedProjectId);
    } else {
      setTeams([]);
    }
  }, [selectedProjectId]);

  const loadTeams = async (projectId: string) => {
    const res = await getTeamListByProject(projectId);
    setTeams(res);
  };

  const handleOnSubmit = async (data: FieldValues) => {};

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <DialogTrigger asChild>
          <Button variant="outline">{title}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Task" : "Add Task"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                <span className="text-red-500">{errors.title.message}</span>
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
                    <SelectTrigger>
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
                    <SelectTrigger>
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
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
                    <SelectTrigger>
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

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddEditTaskModal;
