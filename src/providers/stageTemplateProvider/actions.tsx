"use client";

// Action types for stage templates
export const LOAD_TEMPLATES_PENDING = "LOAD_TEMPLATES_PENDING";
export const LOAD_TEMPLATES_SUCCESS = "LOAD_TEMPLATES_SUCCESS";
export const LOAD_TEMPLATES_ERROR = "LOAD_TEMPLATES_ERROR";
export const SAVE_TEMPLATES_PENDING = "SAVE_TEMPLATES_PENDING";
export const SAVE_TEMPLATES_SUCCESS = "SAVE_TEMPLATES_SUCCESS";
export const SAVE_TEMPLATES_ERROR = "SAVE_TEMPLATES_ERROR";
export const UPDATE_TEMPLATE = "UPDATE_TEMPLATE";
export const ADD_ACTIVITY = "ADD_ACTIVITY";
export const REMOVE_ACTIVITY = "REMOVE_ACTIVITY";
export const RESET_TO_DEFAULTS = "RESET_TO_DEFAULTS";
export const SET_DIRTY = "SET_DIRTY";

// Action creators
export const loadTemplatesPending = () => ({ type: LOAD_TEMPLATES_PENDING });
export const loadTemplatesSuccess = (payload: unknown) => ({
  type: LOAD_TEMPLATES_SUCCESS,
  payload,
});
export const loadTemplatesError = () => ({ type: LOAD_TEMPLATES_ERROR });
export const saveTemplatesPending = () => ({ type: SAVE_TEMPLATES_PENDING });
export const saveTemplatesSuccess = () => ({ type: SAVE_TEMPLATES_SUCCESS });
export const saveTemplatesError = () => ({ type: SAVE_TEMPLATES_ERROR });
export const updateTemplate = (payload: unknown) => ({
  type: UPDATE_TEMPLATE,
  payload,
});
export const addActivity = (payload: unknown) => ({
  type: ADD_ACTIVITY,
  payload,
});
export const removeActivity = (payload: unknown) => ({
  type: REMOVE_ACTIVITY,
  payload,
});
export const resetToDefaults = () => ({ type: RESET_TO_DEFAULTS });
export const setDirty = (payload: boolean) => ({
  type: SET_DIRTY,
  payload,
});
