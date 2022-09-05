import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";

const UiContext = createContext();

export function useUiContext() {
  return useContext(UiContext);
}
export const UIConsumer = UiContext.Consumer;

export function UIProvider({ children }) {
  const [profile, setProfileBase] = useState(null);
  const setProfile = useCallback((nextProfile) => {
    setProfileBase((prevQueryParams) => {
      if (isFunction(nextProfile)) {
        nextProfile = nextProfile(prevQueryParams);
      }
      if (isEqual(prevQueryParams, nextProfile)) {
        return prevQueryParams;
      }
      return nextProfile;
    });
  }, []);

  const value = {
    profile,
    setProfileBase,
    setProfile,
  };

  return (
    <UiContext.Provider value={value}>
      {children}
    </UiContext.Provider>
  );
}
