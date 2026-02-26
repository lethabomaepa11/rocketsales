"use client";

import { useContext, useReducer, useCallback } from "react";
import { App } from "antd";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
  ActivityStateContext,
  ActivityActionContext,
  INITIAL_STATE,
} from "./context";
import { ActivityReducer } from "./reducer";
import * as ActivityActions from "./actions";
import {
  CreateActivityDto,
  UpdateActivityDto,
  ActivityQueryParams,
  CompleteActivityDto,
  CreateActivityParticipantDto,
} from "./types";

export const ActivityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(ActivityReducer, INITIAL_STATE);
  const instance = getAxiosInstance();
  const { notification } = App.useApp();

  const fetchActivities = useCallback(
    async (params?: ActivityQueryParams) => {
      dispatch(ActivityActions.fetchActivitiesPending());
      try {
        const response = await instance.get("/Activities", { params });
        dispatch(
          ActivityActions.fetchActivitiesSuccess(response.data.items || []),
        );
      } catch {
        dispatch(ActivityActions.fetchActivitiesError());
        notification.error({
          title: "Error",
          description: "Failed to fetch activities",
        });
      }
    },
    [instance, notification],
  );

  const fetchActivityById = useCallback(
    async (id: string) => {
      dispatch(ActivityActions.fetchActivitiesPending());
      try {
        const response = await instance.get(`/Activities/${id}`);
        dispatch(ActivityActions.fetchActivitiesSuccess([response.data]));
      } catch {
        dispatch(ActivityActions.fetchActivitiesError());
      }
    },
    [instance],
  );

  const fetchUpcomingActivities = useCallback(
    async (daysAhead = 30) => {
      dispatch(ActivityActions.fetchActivitiesPending());
      try {
        const response = await instance.get("/Activities/upcoming", {
          params: { daysAhead },
        });
        dispatch(ActivityActions.fetchActivitiesSuccess(response.data || []));
      } catch {
        dispatch(ActivityActions.fetchActivitiesError());
      }
    },
    [instance],
  );

  const fetchOverdueActivities = useCallback(async () => {
    dispatch(ActivityActions.fetchActivitiesPending());
    try {
      const response = await instance.get("/Activities/overdue");
      dispatch(ActivityActions.fetchActivitiesSuccess(response.data || []));
    } catch {
      dispatch(ActivityActions.fetchActivitiesError());
    }
  }, [instance]);

  const fetchMyActivities = useCallback(async () => {
    dispatch(ActivityActions.fetchActivitiesPending());
    try {
      const response = await instance.get("/Activities/my-activities");
      dispatch(ActivityActions.fetchActivitiesSuccess(response.data || []));
    } catch {
      dispatch(ActivityActions.fetchActivitiesError());
    }
  }, [instance]);

  const createActivity = useCallback(
    async (activity: CreateActivityDto) => {
      dispatch(ActivityActions.createActivityPending());
      try {
        const response = await instance.post("/Activities", activity);
        dispatch(ActivityActions.createActivitySuccess(response.data));
        notification.success({
          title: "Success",
          description: "Activity created",
        });
      } catch {
        dispatch(ActivityActions.createActivityError());
        notification.error({
          title: "Error",
          description: "Failed to create activity",
        });
      }
    },
    [instance, notification],
  );

  const updateActivity = useCallback(
    async (id: string, activity: UpdateActivityDto) => {
      dispatch(ActivityActions.updateActivityPending());
      try {
        const response = await instance.put(`/Activities/${id}`, activity);
        dispatch(ActivityActions.updateActivitySuccess(response.data));
        notification.success({
          title: "Success",
          description: "Activity updated",
        });
      } catch {
        dispatch(ActivityActions.updateActivityError());
        notification.error({
          title: "Error",
          description: "Failed to update activity",
        });
      }
    },
    [instance, notification],
  );

  const deleteActivity = useCallback(
    async (id: string) => {
      dispatch(ActivityActions.deleteActivityPending());
      try {
        await instance.delete(`/Activities/${id}`);
        dispatch(ActivityActions.deleteActivitySuccess(id));
        notification.success({
          title: "Success",
          description: "Activity deleted",
        });
      } catch {
        dispatch(ActivityActions.deleteActivityError());
        notification.error({
          title: "Error",
          description: "Failed to delete activity",
        });
      }
    },
    [instance, notification],
  );

  const completeActivity = useCallback(
    async (id: string, outcome?: string) => {
      dispatch(ActivityActions.updateActivityPending());
      try {
        const response = await instance.put(`/Activities/${id}/complete`, {
          outcome,
        } as CompleteActivityDto);
        dispatch(ActivityActions.updateActivitySuccess(response.data));
        notification.success({
          title: "Success",
          description: "Activity completed",
        });
      } catch {
        dispatch(ActivityActions.updateActivityError());
        notification.error({
          title: "Error",
          description: "Failed to complete activity",
        });
      }
    },
    [instance, notification],
  );

  const cancelActivity = useCallback(
    async (id: string) => {
      dispatch(ActivityActions.updateActivityPending());
      try {
        const response = await instance.put(`/Activities/${id}/cancel`);
        dispatch(ActivityActions.updateActivitySuccess(response.data));
        notification.success({
          title: "Success",
          description: "Activity cancelled",
        });
      } catch {
        dispatch(ActivityActions.updateActivityError());
        notification.error({
          title: "Error",
          description: "Failed to cancel activity",
        });
      }
    },
    [instance, notification],
  );

  const fetchParticipants = useCallback(
    async (activityId: string) => {
      dispatch(ActivityActions.fetchParticipantsPending());
      try {
        const response = await instance.get(
          `/Activities/${activityId}/participants`,
        );
        dispatch(ActivityActions.fetchParticipantsSuccess(response.data || []));
      } catch {
        dispatch(ActivityActions.fetchParticipantsError());
        notification.error({
          title: "Error",
          description: "Failed to fetch participants",
        });
      }
    },
    [instance, notification],
  );

  const addParticipant = useCallback(
    async (activityId: string, participant: CreateActivityParticipantDto) => {
      dispatch(ActivityActions.addParticipantPending());
      try {
        const response = await instance.post(
          `/Activities/${activityId}/participants`,
          participant,
        );
        dispatch(ActivityActions.addParticipantSuccess(response.data));
        notification.success({
          title: "Success",
          description: "Participant added",
        });
      } catch {
        dispatch(ActivityActions.addParticipantError());
        notification.error({
          title: "Error",
          description: "Failed to add participant",
        });
      }
    },
    [instance, notification],
  );

  return (
    <ActivityStateContext.Provider value={state}>
      <ActivityActionContext.Provider
        value={{
          fetchActivities,
          fetchActivityById,
          fetchUpcomingActivities,
          fetchOverdueActivities,
          fetchMyActivities,
          createActivity,
          updateActivity,
          deleteActivity,
          completeActivity,
          cancelActivity,
          fetchParticipants,
          addParticipant,
        }}
      >
        {children}
      </ActivityActionContext.Provider>
    </ActivityStateContext.Provider>
  );
};

export const useActivityState = () => {
  const context = useContext(ActivityStateContext);
  if (!context)
    throw new Error("useActivityState must be used within ActivityProvider");
  return context;
};
export const useActivityActions = () => {
  const context = useContext(ActivityActionContext);
  if (!context)
    throw new Error("useActivityActions must be used within ActivityProvider");
  return context;
};
