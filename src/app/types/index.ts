export type TTeamSummary = {
  _id: string;
  name: string;
  role: string;
  capacity: number;
  currentTasks: number;
  isOverloaded: boolean;
  tasks: ITask[];
};

export type TRecentReassignment = {
  _id: string;
  task: {
    title: string;
    priority: string;
    _id: string;
  };
  fromMember: {
    name: string;
    _id: string;
  };
  toMember: {
    name: string;
    _id: string;
  };
  createdAt: string; // ISO string
};

export type TDashboardData = {
  totalProjects: number;
  totalTasks: number;
  teamSummary: TTeamSummary[];
  recentReassignments: TRecentReassignment[];
};

export type TTeam = {
  _id: string;
  name: string;
  capacity?: number;
  members: [
    {
      name: string;
      capacity: number;
      role: string;
      _id: string;
      currentTasks: number;
    }
  ];
};

export interface ITask {
  _id: string;
  title: string;
  description: string;
  assignedMemberId: string;
  assignedMemberName: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Done";
  projectId: string;
}

export interface IReassgingTask {
  taskId: {
    title: string;
    priority: string;
    _id: string;
  };
  fromMemberId: {
    name: string;
    _id: string;
  };
  toMemberId: {
    name: string;
    _id: string;
  };
  taskTitle?: string;
  priority?: string;
  fromMemberName?: string;
  toMemberName?: string;
}
