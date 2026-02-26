"use client";

import { createContext } from "react";
import {
  ActivityDto,
  CreateActivityDto,
  UpdateActivityDto,
  ActivityQueryParams,
  ActivityParticipantDto,
  CreateActivityParticipantDto,
} from "./types";

export interface IActivityStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  activities: ActivityDto[];
  selectedActivity: ActivityDto | null;
  participants: ActivityParticipantDto[];
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface IActivityActionContext {
  fetchActivities: (params?: ActivityQueryParams) => void;
  fetchActivityById: (id: string) => void;
  fetchUpcomingActivities: (daysAhead?: number) => void;
  fetchOverdueActivities: () => void;
  fetchMyActivities: () => void;
  createActivity: (activity: CreateActivityDto) => void;
  updateActivity: (id: string, activity: UpdateActivityDto) => void;
  deleteActivity: (id: string) => void;
  completeActivity: (id: string, outcome?: string) => void;
  cancelActivity: (id: string) => void;
  fetchParticipants: (activityId: string) => void;
  addParticipant: (
    activityId: string,
    participant: CreateActivityParticipantDto,
  ) => void;
}

export const INITIAL_STATE: IActivityStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  activities: [],
  selectedActivity: null,
  participants: [],
  pagination: { pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0 },
};

export const ActivityStateContext =
  createContext<IActivityStateContext>(INITIAL_STATE);
export const ActivityActionContext = createContext<IActivityActionContext>(
  undefined as unknown as IActivityActionContext,
);
