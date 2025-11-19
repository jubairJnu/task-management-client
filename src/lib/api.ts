// lib/api.ts

"use server";

import config from "@/config";

export async function postUserSignup(
  payload: any
): Promise<{ success: boolean; data: any } | null> {
  try {
    const response = await fetch(`${config.api_url}/users`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log(result, "result");
    return result;
  } catch (error) {
    console.error("Error signing up user:", error);
    return null;
  }
}

// Optional: Function to get product slugs (for generateStaticParams)
export async function getTeamList(): Promise<any[]> {
  try {
    const response = await fetch(`${config.api_url}/teams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // optional for Next.js
    });

    if (!response.ok) {
      throw new Error("Failed to fetch team list");
    }

    const data = await response.json();
    return data?.data || []; // return the real team list
  } catch (error) {
    console.error("Error fetching team list", error);
    return [];
  }
}
// by project id == teams/:id
export async function getTeamListByProject(projectId: string): Promise<any[]> {
  try {
    const response = await fetch(`${config.api_url}/teams/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch team list");
    }

    const result = await response.json();
    return result?.data;
  } catch (error) {
    console.error("Error fetching team list:", error);
    return [];
  }
}

// get projects ==  /projects
export async function getProjects(): Promise<any[]> {
  try {
    const response = await fetch(`${config.api_url}/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    const result = await response.json();
    return result?.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// get task// == /tasks

export async function getTasks(): Promise<any[]> {
  try {
    const response = await fetch(`${config.api_url}/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const result = await response.json();
    return result?.data || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}
export async function getStats(): Promise<any[]> {
  try {
    const response = await fetch(`${config.api_url}/stats/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }

    const result = await response.json();
    return result?.data || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

// post task == /tasks

export async function postTask(payload: any): Promise<any | null> {
  try {
    const response = await fetch(`${config.api_url}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    const result = await response.json();
    return result; // should contain success + data
  } catch (error) {
    console.error("Error creating task:", error);
    return null;
  }
}

export async function postReassignTasks(payload: any): Promise<any | null> {
  try {
    const response = await fetch(`${config.api_url}/reassign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    const result = await response.json();
    return result; // should contain success + data
  } catch (error) {
    console.error("Error creating task:", error);
    return null;
  }
}
// post project
export async function postProject(payload: any): Promise<any | null> {
  try {
    const response = await fetch(`${config.api_url}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create projects");
    }

    const result = await response.json();
    return result; // should contain success + data
  } catch (error) {
    console.error("Error creating task:", error);
    return null;
  }
}
// post team
export async function postTeam(payload: any): Promise<any | null> {
  try {
    const response = await fetch(`${config.api_url}/teams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create teams");
    }

    const result = await response.json();
    return result; // should contain success + data
  } catch (error) {
    console.error("Error creating task:", error);
    return null;
  }
}
