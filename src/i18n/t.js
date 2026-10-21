import en from './en.json';

// Every UI string lives in en.json. Add ar.json later and pick the dictionary by language here.
export const t = (key, params) => (en[key] ?? key).replace(/\{(\w+)\}/g, (_, name) => params?.[name] ?? '');
