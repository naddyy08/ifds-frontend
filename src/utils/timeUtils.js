// src/utils/timeUtils.js

/**
 * Convert a UTC timestamp string from the backend to the user's local time.
 * Handles both ISO format (2026-03-27T07:23:09) and space format (2026-03-27 07:23:09)
 */
export function toLocalTime(utcString, options = {}) {
  if (!utcString) return 'N/A';

  // If the string doesn't end with 'Z' or have timezone info, treat it as UTC
  let normalized = utcString;
  if (!utcString.endsWith('Z') && !utcString.includes('+')) {
    normalized = utcString.replace(' ', 'T') + 'Z';
  }

  const date = new Date(normalized);
  if (isNaN(date.getTime())) return utcString; // fallback if invalid

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  return date.toLocaleString(undefined, { ...defaultOptions, ...options });
}

/**
 * Short version — date only, no time
 */
export function toLocalDate(utcString) {
  return toLocalTime(utcString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: undefined,
    minute: undefined,
    second: undefined,
  });
}