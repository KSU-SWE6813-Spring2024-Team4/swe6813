/**
 * Constructs request options with defaults + passed in options
 * @param {*} opts 
 * @returns {RequestInit}
 */
const getOptions = (opts) => ({
  headers: { 'Content-Type': 'application/json' }, 
  ...opts 
});
