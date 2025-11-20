"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITask, TTeam } from "@/app/types";
import AddEditTaskModal from "@/components/task/AddEditTaskModal";
import { deleteTask, getProjects, getTasks, getTeamList } from "@/lib/api";
import { useEffect, useState } from "react";
import { SquarePen, Trash } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Loading from "@/utils/Loading";

const TaskPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [taskList, setTaskList] = useState<ITask[]>([]);
  const [teamList, setTeamList] = useState<TTeam[]>([]);
  const [projectList, setProjectList] = useState<any[]>([]);
  const [queryParameter, setQueryParameter] = useState({
    projectId: "",
    assignedMemberId: "",
  });

  const queryParams: Record<string, string> = {};

  if (queryParameter.projectId)
    queryParams.projectId = queryParameter.projectId;
  if (queryParameter.assignedMemberId)
    queryParams.assignedMemberId = queryParameter.assignedMemberId;

  useEffect(() => {
    const loadTasks = async () => {
      const data = await getTasks(queryParams);
      setTaskList(data);
    };
    loadTasks();
  }, [queryParameter]);
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [projects, teams] = await Promise.all([
          getProjects(),
          getTeamList(),
        ]);

        setProjectList(projects);
        setTeamList(teams);
      } catch (error) {
        console.error("Failed to load project/team:", error);
      }
    };

    loadInitialData();
  }, []);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const res = await deleteTask(id);

    if (res && res.success) {
      setIsLoading(false);
      toast.success("Deleted succesfully");
    } else {
      setIsLoading(false);
      toast.error("someting went wrong");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 h-screen overflow-y-auto">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Task List
        </h2>
        <AddEditTaskModal title={"Add New Task"} />
      </div>

      <div className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Project Select */}
        <select
          className="border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white"
          value={queryParameter.projectId}
          onChange={(e) =>
            setQueryParameter((prev) => ({
              ...prev,
              projectId: e.target.value,
            }))
          }
        >
          <option value="">All Projects</option>
          {projectList.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>

        {/* Team / Member Select */}
        <select
          className="border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white"
          value={queryParameter.assignedMemberId}
          onChange={(e) =>
            setQueryParameter((prev) => ({
              ...prev,
              assignedMemberId: e.target.value,
            }))
          }
        >
          <option value="">All Members</option>
          {teamList.map((team) =>
            team.members?.map((member: any) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))
          )}
        </select>
      </div>

      {/* table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SL</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned Member</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taskList?.map((t, index: number) => (
            <TableRow>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{t?.title}</TableCell>
              <TableCell>{t.description}</TableCell>
              <TableCell>{t.priority}</TableCell>
              <TableCell>{t.status}</TableCell>
              <TableCell>{t.assignedMemberName || "Unassgined"}</TableCell>
              <TableCell className="flex items-center gap-2.5">
                <AddEditTaskModal
                  item={t}
                  title={<SquarePen className="text-green-500" />}
                />
                <Button
                  disabled={isLoading}
                  size={"icon"}
                  variant={"destructive"}
                  onClick={() => handleDelete(t._id)}
                >
                  {isLoading ? <Loading /> : <Trash />}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskPage;
