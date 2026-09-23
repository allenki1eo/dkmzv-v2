/** CJS shape expo-router expects. query-string v9 is ESM-only and breaks `import *`. */
function stringify(params, options) {
  const entries = Object.entries(params).filter(([, value]) => value != null);
  if (options?.sort !== false) {
    entries.sort(([a], [b]) => (typeof options?.sort === 'function' ? options.sort(a, b) : a.localeCompare(b)));
  }
  return entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
}

function parse(query) {
  return Object.fromEntries(new URLSearchParams(String(query).replace(/^\?/, '')));
}

module.exports = { stringify, parse };
