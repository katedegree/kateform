import { create } from "zustand";

interface State {
  errorMessages: Record<string, string>;
  setErrorMessage: (key: string, message: string) => void;
}

export const useStore = create<State>((set) => ({
  errorMessages: {},
  setErrorMessage: (key, message) =>
    set((state) => ({
      errorMessages: { ...state.errorMessages, [key]: message },
    })),
}));
