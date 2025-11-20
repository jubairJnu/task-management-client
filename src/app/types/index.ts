export type TTeamSummary = {
  _id: string;
  name: string;
  role: string;
  capacity: number;
  currentTasks: number;
  isOverloaded: boolean;
};

export type TRecentReassignment = {
  _id: string;
  taskId: string;
  fromMember: string;
  toMember: string;
  timestamp: string; // ISO string
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
