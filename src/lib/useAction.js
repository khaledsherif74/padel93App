import { useState } from 'react';
import { errorText } from './apiErrors.js';

/** Runs one async submit: busy while saving (disable the button), error text if it fails. Resolves true on success. */
export function useAction() {
  const [state, setState] = useState({ busy: false, error: null });
  const run = async (fn) => {
    setState({ busy: true, error: null });
    try {
      await fn();
      setState({ busy: false, error: null });
      return true;
    } catch (err) {
      setState({ busy: false, error: errorText(err) });
      return false;
    }
  };
  return { ...state, run };
}
