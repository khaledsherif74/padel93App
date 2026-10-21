import { useMemo } from 'react';
import { newId } from './uuid.js';

/**
 * Idempotency key (clientRequestId) for one submit. It stays the same while the user retries the SAME values
 * (a flaky connection must not create a second record) and changes when they edit something.
 */
export const useRequestId = (fingerprint) => useMemo(() => newId(), [fingerprint]); // eslint-disable-line react-hooks/exhaustive-deps
