"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITask } from "@/app/types";
import AddEditTaskModal from "@/components/task/AddEditTaskModal";
import { getTasks } from "@/lib/api";
import { useEffect, useState } from "react";
import { SquarePen } from "lucide-react";

const TaskPage = () => {
  const [taskList, setTaskList] = useState<ITask[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      const data = await getTasks();
      setTaskList(data);
    };
    loadTasks();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 h-screen overflow-y-auto">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Task List
        </h2>
        <AddEditTaskModal title={"Add New Task"} />
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
              <TableCell>
                <AddEditTaskModal
                  item={t}
                  title={<SquarePen className="text-green-500" />}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskPage;
