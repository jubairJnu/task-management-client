import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Users,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  UserCheck,
} from "lucide-react";
import { IReassgingTask, ITask, TTeamSummary } from "@/app/types";
import { postReassignTasks } from "@/lib/api";
import { toast } from "sonner";

export default function ReassignTasksDialog({
  teamMembers,
}: {
  teamMembers: TTeamSummary[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reassignments, setReassignments] = useState<IReassgingTask[]>([]);
  const [completed, setCompleted] = useState(false);

  console.log(reassignments, "ers");

  const calculateReassignments = () => {
    const suggestions: any = [];

    console.log(suggestions, "suggestions");

    // Find overloaded members
    const overloadedMembers = teamMembers.filter(
      (m) => m.isOverloaded && m.tasks
    );

    const availableMembers = teamMembers
      .filter((m) => m.currentTasks < m.capacity)
      .sort((a, b) => a.currentTasks - b.currentTasks);

    overloadedMembers.forEach((overloaded) => {
      const tasksToMove = overloaded.currentTasks - overloaded.capacity;

      const movableTasks = overloaded.tasks
        .filter((task) => task.priority === "Low" || task.priority === "Medium")
        .slice(0, tasksToMove);

      movableTasks.forEach((task: ITask) => {
        const bestMember = availableMembers.find(
          (m) => m.currentTasks < m.capacity && m._id !== overloaded._id
        );

        if (bestMember) {
          suggestions.push({
            taskId: task._id,
            taskTitle: task.title,
            fromMemberId: overloaded._id,
            fromMemberName: overloaded.name,
            priority: task.priority,
            toMemberId: bestMember._id,
            toMemberName: bestMember.name,
          });

          // Update temporary capacity for next iteration
          bestMember.currentTasks++;
        }
      });
    });
    setReassignments(suggestions);
    return suggestions;
  };

  const handleAutoReassign = async () => {
    setLoading(true);
    const suggestions = calculateReassignments();
    setReassignments(suggestions);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleRemoveReassignment = (index: number) => {
    const updatedReassignments = reassignments.filter((_, i) => i !== index);
    setReassignments(updatedReassignments);
  };

  const handleConfirmReassignments = async () => {
    setLoading(true);

    try {
      // Prepare data for backend
      const reassignmentData = reassignments.map((r) => ({
        taskId: r.taskId,
        fromMemberId: r.fromMemberId,
        toMemberId: r.toMemberId,
      }));

      // Send to your backend API
      const res = await postReassignTasks(reassignmentData);
      if (res && res.success) {
        setLoading(false);
        toast.success("Tasks reassigned successfully");
        setOpen(false);
        setCompleted(false);
        setReassignments([]);
      }

      // Simulate API call
    } catch (error) {
      console.error("Error reassigning tasks:", error);
      setLoading(false);
    }
  };

  const getMemberWorkload = (memberId: string) => {
    const member = teamMembers.find((m) => m._id === memberId);
    if (!member) return null;

    // Calculate projected workload including pending reassignments
    const incomingTasks = reassignments.filter(
      (r) => r.toMemberId._id === memberId
    ).length;
    const outgoingTasks = reassignments.filter(
      (r) => r.fromMemberId._id === memberId
    ).length;
    const projectedTasks = member.currentTasks + incomingTasks - outgoingTasks;

    return {
      current: member.currentTasks,
      capacity: member.capacity,
      projected: projectedTasks,
      isOverloaded: projectedTasks > member.capacity,
    };
  };

  const overloadedCount = teamMembers?.filter((m) => m.isOverloaded).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Users className="w-4 h-4 mr-2" />
          Reassign Tasks
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users className="w-5 h-5" />
            Auto Reassign Tasks
          </DialogTitle>
          <DialogDescription>
            Automatically balance workload by reassigning tasks from overloaded
            members
          </DialogDescription>
        </DialogHeader>

        {!completed ? (
          <div className="space-y-4 mt-4">
            <Alert
              className={
                overloadedCount > 0
                  ? "border-orange-200 bg-orange-50"
                  : "border-green-200 bg-green-50"
              }
            >
              <AlertTriangle
                className={`w-4 h-4 ${
                  overloadedCount > 0 ? "text-orange-600" : "text-green-600"
                }`}
              />
              <AlertDescription className="text-sm">
                {overloadedCount > 0 ? (
                  <span className="text-orange-800">
                    <strong>{overloadedCount}</strong> team member(s) are
                    overloaded and need task redistribution
                  </span>
                ) : (
                  <span className="text-green-800">
                    All team members are within capacity. No reassignment
                    needed.
                  </span>
                )}
              </AlertDescription>
            </Alert>

            {/* Team Overview */}
            <div className="grid grid-cols-2 gap-3">
              {teamMembers?.map((member) => {
                const workload = getMemberWorkload(member._id);
                return (
                  <Card
                    key={member._id}
                    className={
                      member.isOverloaded
                        ? "border-red-200 bg-red-50"
                        : "border-slate-200"
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">{member.name}</p>
                          <p className="text-xs text-slate-600">
                            {member.role}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              member.isOverloaded ? "destructive" : "secondary"
                            }
                            className="text-xs mb-1"
                          >
                            {member.currentTasks}/{member.capacity}
                          </Badge>
                          {reassignments.length > 0 &&
                            workload &&
                            workload.projected !== workload.current && (
                              <div className="text-xs text-blue-600 font-medium">
                                → {workload.projected}/{workload.capacity}
                              </div>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {reassignments?.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center justify-between">
                  <span>Proposed Reassignments:</span>
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {reassignments?.map((r, idx) => (
                    <Card key={idx} className="border-blue-200 bg-blue-50">
                      <CardContent className="p-3">
                        <div className="space-y-3">
                          {/* Task Info */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {r.taskTitle}
                              </p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge variant="outline" className="text-xs">
                                  {r?.priority}
                                </Badge>
                                <span className="text-xs text-slate-600">
                                  {r?.fromMemberName}
                                </span>
                                <ArrowRight className="w-3 h-3 text-slate-400" />
                                <span className="text-xs font-medium text-blue-700">
                                  {r?.toMemberName}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveReassignment(idx)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-100 h-8 px-2"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              {reassignments.length === 0 ? (
                <Button
                  onClick={handleAutoReassign}
                  disabled={loading || overloadedCount === 0}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Calculate Reassignments
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setReassignments([]);
                    }}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmReassignments}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Reassigning...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Confirm ({reassignments.length})
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Tasks Reassigned Successfully!
            </h3>
            <p className="text-slate-600 text-sm">
              {reassignments.length} task(s) have been redistributed
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
