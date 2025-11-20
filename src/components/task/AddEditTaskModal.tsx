"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import {
  deleteTask,
  getProjects,
  getTeamListByProject,
  postTask,
  updateTask,
} from "@/lib/api";

import { toast } from "sonner";
import Loading from "@/utils/Loading";
import { Badge } from "../ui/badge";
import { DialogDescription } from "@radix-ui/react-dialog";
import { TTeam } from "@/app/types";

type TTAddEdmitaskModalProps = {
  title: string | JSX.Element;
  item?: any;
};

const AddEditTaskModal: FC<TTAddEdmitaskModalProps> = ({ item, title }) => {
  const isEditMode = !!item;
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [teams, setTeams] = useState<TTeam>();
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showWarning, setShowWarning] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: item?.title || "",
      description: item?.description || "",
      priority: item?.priority || "",
      status: item?.status || "",
      projectId: item?.projectId || "",
      assignedMemberId: item?.assignedMemberId || "",
    },
  });

  useEffect(() => {
    if (isModalOpen) loadProjects();
  }, [isModalOpen]);

  useEffect(() => {
    if (isEditMode && projects.length > 0) {
      reset(item);
      const selectedProject = projects.find((p) => p._id === item.projectId);
      setTeams(selectedProject?.teamId);
    }
  }, [projects, isEditMode]);

  const handleAssignChange = (memberId: string) => {
    const member = teams?.members?.find((m: any) => m._id === memberId);

    if (member && member?.currentTasks > member?.capacity) {
      setSelectedMember(member);
      setShowWarning(true);
      return;
    }

    setValue("assignedMemberId", memberId);
  };

  const handleAutoAssign = () => {
    if (!teams?.members) return;

    const autoMember = [...teams.members].sort(
      (a, b) => a.currentTasks - b.currentTasks
    )[0];

    setValue("assignedMemberId", autoMember._id);
  };

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
    setIsLoading(true);
    let res;
    if (isEditMode) {
      res = await updateTask({ id: item._id, payload: data });
    } else {
      res = await postTask(data);
    }

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
    <div>
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
              <div className="space-y-2 mt-[22px]">
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
                <div className="flex justify-between items-center">
                  <Label>Assign To</Label>
                  <Button
                    disabled={!teams?.members}
                    type="button"
                    className=" bg-amber-600 hover:bg-amber-700 text-white text-sm"
                    onClick={handleAutoAssign}
                  >
                    Auto-assign
                  </Button>
                </div>
                <Controller
                  name="assignedMemberId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => handleAssignChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams?.members?.map((m: any) => (
                          <SelectItem key={m._id} value={m._id}>
                            {m.name}{" "}
                            <Badge
                              variant={
                                m.currentTasks > m.capacity
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-xs mb-1"
                            >
                              {m.currentTasks}/{m.capacity}
                            </Badge>
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
              <Button type="submit">
                {isLoading ? <Loading /> : "Submit"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/*  */}

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Member Overloaded</DialogTitle>
            <DialogDescription>
              {selectedMember?.name} has {selectedMember?.currentTasks} tasks,
              but capacity is {selectedMember?.capacity}. Assign anyway?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowWarning(false);
              }}
            >
              Choose Another
            </Button>

            <Button
              onClick={() => {
                setValue("assignedMemberId", selectedMember._id);
                setShowWarning(false);
              }}
            >
              Assign Anyway
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddEditTaskModal;
