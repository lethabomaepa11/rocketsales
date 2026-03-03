"use client";

import { useContext, useReducer, useCallback } from "react";
import { App } from "antd";
import { getAxiosInstance } from "@/utils/axiosInstance";
import { getCurrentUser, isSalesRep } from "@/utils/tenantUtils";
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
  const { notification, message } = App.useApp();

  const isActivityOwnedByCurrentUser = useCallback((activity: unknown) => {
    const currentUserId = getCurrentUser()?.userId;
    if (!currentUserId || !activity || typeof activity !== "object") {
      return false;
    }

    const record = activity as {
      assignedToId?: string;
      createdById?: string;
    };

    return (
      record.assignedToId === currentUserId ||
      record.createdById === currentUserId
    );
  }, []);

  const ensureSalesRepCanViewActivity = useCallback(
    async (activityId: string): Promise<boolean> => {
      if (!isSalesRep()) {
        return true;
      }

      try {
        const response = await instance.get(`/Activities/${activityId}`);
        if (!isActivityOwnedByCurrentUser(response.data)) {
          notification.warning({
            title: "Access denied",
            description: "Sales reps can only access their own activities.",
          });
          return false;
        }

        return true;
      } catch {
        notification.error({
          title: "Error",
          description: "Failed to verify activity access",
        });
        return false;
      }
    },
    [instance, isActivityOwnedByCurrentUser, notification],
  );

  const blockSalesRepMutation = useCallback((): boolean => {
    if (!isSalesRep()) {
      return false;
    }

    notification.warning({
      title: "Access denied",
      description: "Sales reps can only create activities.",
    });
    return true;
  }, [notification]);

  const fetchActivities = useCallback(
    async (params?: ActivityQueryParams) => {
      dispatch(ActivityActions.fetchActivitiesPending());
      try {
        const response = isSalesRep()
          ? await instance.get("/Activities/my-activities")
          : await instance.get("/Activities", { params });

        dispatch(
          ActivityActions.fetchActivitiesSuccess(
            isSalesRep() ? response.data || [] : response.data.items || [],
          ),
        );
      } catch {
        dispatch(ActivityActions.fetchActivitiesError());
        message.error("Failed to fetch activities");
      }
    },
    [instance, message],
  );

  const fetchActivityById = useCallback(
    async (id: string) => {
      dispatch(ActivityActions.fetchActivitiesPending());
      try {
        const response = await instance.get(`/Activities/${id}`);

        if (isSalesRep() && !isActivityOwnedByCurrentUser(response.data)) {
          dispatch(ActivityActions.fetchActivitiesError());
          notification.warning({
            title: "Access denied",
            description: "Sales reps can only access their own activities.",
          });
          return;
        }

        dispatch(ActivityActions.fetchActivitiesSuccess([response.data]));
      } catch {
        dispatch(ActivityActions.fetchActivitiesError());
      }
    },
    [instance, isActivityOwnedByCurrentUser, notification],
  );

  const fetchUpcomingActivities = useCallback(
    async (daysAhead = 30) => {
      dispatch(ActivityActions.fetchActivitiesPending());
      try {
        if (isSalesRep()) {
          const response = await instance.get("/Activities/my-activities");
          dispatch(ActivityActions.fetchActivitiesSuccess(response.data || []));
          return;
        }

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
      if (isSalesRep()) {
        const response = await instance.get("/Activities/my-activities");
        dispatch(ActivityActions.fetchActivitiesSuccess(response.data || []));
        return;
      }

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
        message.success("Activity created");
      } catch {
        dispatch(ActivityActions.createActivityError());
        message.error("Failed to create activity");
      }
    },
    [instance, message],
  );

  const updateActivity = useCallback(
    async (id: string, activity: UpdateActivityDto) => {
      if (blockSalesRepMutation()) {
        return;
      }

      dispatch(ActivityActions.updateActivityPending());
      try {
        const response = await instance.put(`/Activities/${id}`, activity);
        dispatch(ActivityActions.updateActivitySuccess(response.data));
        message.success("Activity updated");
      } catch {
        dispatch(ActivityActions.updateActivityError());
        message.error("Failed to update activity");
      }
    },
    [blockSalesRepMutation, instance, message],
  );

  const deleteActivity = useCallback(
    async (id: string) => {
      if (blockSalesRepMutation()) {
        return;
      }

      dispatch(ActivityActions.deleteActivityPending());
      try {
        await instance.delete(`/Activities/${id}`);
        dispatch(ActivityActions.deleteActivitySuccess(id));
        message.success("Activity deleted");
      } catch {
        dispatch(ActivityActions.deleteActivityError());
        message.error("Failed to delete activity");
      }
    },
    [blockSalesRepMutation, instance, message],
  );

  const completeActivity = useCallback(
    async (id: string, outcome?: string) => {
      if (blockSalesRepMutation()) {
        return;
      }

      dispatch(ActivityActions.updateActivityPending());
      try {
        const response = await instance.put(`/Activities/${id}/complete`, {
          outcome,
        } as CompleteActivityDto);
        dispatch(ActivityActions.updateActivitySuccess(response.data));
        message.success("Activity completed");
      } catch {
        dispatch(ActivityActions.updateActivityError());
        message.error("Failed to complete activity");
      }
    },
    [blockSalesRepMutation, instance, message],
  );

  const cancelActivity = useCallback(
    async (id: string) => {
      if (blockSalesRepMutation()) {
        return;
      }

      dispatch(ActivityActions.updateActivityPending());
      try {
        const response = await instance.put(`/Activities/${id}/cancel`);
        dispatch(ActivityActions.updateActivitySuccess(response.data));
        message.success("Activity cancelled");
      } catch {
        dispatch(ActivityActions.updateActivityError());
        message.error("Failed to cancel activity");
      }
    },
    [blockSalesRepMutation, instance, message],
  );

  const fetchParticipants = useCallback(
    async (activityId: string) => {
      const canView = await ensureSalesRepCanViewActivity(activityId);
      if (!canView) {
        return;
      }

      dispatch(ActivityActions.fetchParticipantsPending());
      try {
        const response = await instance.get(
          `/Activities/${activityId}/participants`,
        );
        dispatch(ActivityActions.fetchParticipantsSuccess(response.data || []));
      } catch {
        dispatch(ActivityActions.fetchParticipantsError());
        message.error("Failed to fetch participants");
      }
    },
    [ensureSalesRepCanViewActivity, instance, message],
  );

  const addParticipant = useCallback(
    async (activityId: string, participant: CreateActivityParticipantDto) => {
      if (blockSalesRepMutation()) {
        return;
      }

      dispatch(ActivityActions.addParticipantPending());
      try {
        const response = await instance.post(
          `/Activities/${activityId}/participants`,
          participant,
        );
        dispatch(ActivityActions.addParticipantSuccess(response.data));
        message.success("Participant added");
      } catch {
        dispatch(ActivityActions.addParticipantError());
        message.error("Failed to add participant");
      }
    },
    [blockSalesRepMutation, instance, message],
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
