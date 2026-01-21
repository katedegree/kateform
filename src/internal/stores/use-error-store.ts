import { create, useShallow } from "@kateform/internal/store";
import type { StoreApi } from "@kateform/internal/store";

type ErrorState = {
  errors: Record<string, string>;
  setError: (key: string, message: string) => void;
  setErrors: (messages: Record<string, string>) => void;
};

let state: ErrorState;
const listeners = new Set<() => void>();

const storeApi: StoreApi<ErrorState> = {
  getState: () => state,
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

const notify = () => listeners.forEach((l) => l());

state = {
  errors: {},
  setError: (key, message) => {
    state = {
      ...state,
      errors: {
        ...state.errors,
        [key]: message,
      },
    };
    notify();
  },
  setErrors: (messages) => {
    state = {
      ...state,
      errors: {
        ...state.errors,
        ...messages,
      },
    };
    notify();
  },
};

const _useErrorStore = create(storeApi);

export const useErrorStore = () =>
  _useErrorStore(
    useShallow((s) => ({
      errors: s.errors,
      setError: s.setError,
      setErrors: s.setErrors,
    })),
  );
