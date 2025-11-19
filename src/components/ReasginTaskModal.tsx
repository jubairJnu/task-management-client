"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { postReassignTasks } from "@/lib/api";
import { FieldValues } from "react-hook-form";

const ReassignTasks: FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleReassign = async (data:FieldValues) => {
    setLoading(true);

    const res = await postReassignTasks(data);

    if (res?.success) {
      setResult(res.data);
      toast.success("Tasks reassigned successfully");
    } else {
      toast.error("Failed to reassign tasks");
    }

    setLoading(false);
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => {
          setOpen(true);
          setResult(null);
        }}
      >
        Reassign Tasks
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Reassign Tasks</DialogTitle>
          </DialogHeader>

          {/* If no result yet → show confirmation */}
          {!result && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                This action will automatically reassign tasks from overloaded
                members to members with free capacity.
              </p>
              <p className="text-red-600 text-sm">
                • High priority tasks will NOT be moved. <br />
                • Only Low and Medium priority tasks will be reassigned. <br />•
                All movements are recorded in Activity Log.
              </p>
            </div>
          )}

          {/* If result → show summary */}
          {result && (
            <div className="space-y-3 mt-2">
              <h3 className="font-medium">Task Movements</h3>

              {result.movedTasks.length === 0 ? (
                <p className="text-sm text-gray-600">No tasks moved.</p>
              ) : (
                <ul className="text-sm space-y-2">
                  {result.movedTasks.map((task: any) => (
                    <li
                      key={task.taskId}
                      className="p-2 border rounded-md bg-gray-50"
                    >
                      <span className="font-medium">{task.title}</span>
                      <br />
                      <span className="text-xs text-gray-600">
                        {task.from} → {task.to}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <h3 className="font-medium pt-4">Members Affected</h3>
              <ul className="text-sm space-y-1">
                {result.members.map((m: any) => (
                  <li key={m._id} className="text-gray-700">
                    <span className="font-medium">{m.name}</span> — now at{" "}
                    {m.currentTasks}/{m.capacity}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <DialogFooter>
            {!result ? (
              <Button
                disabled={loading}
                onClick={handleReassign}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Run Reassignment
              </Button>
            ) : (
              <Button onClick={() => setOpen(false)} className="w-full">
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReassignTasks;
