/**
 * Utility wrapper to handle async/await errors in Express routes
 * so we don't need try/catch everywhere.
 *
 * Usage:
 *   router.get("/", asyncHandler(async (req, res) => { ... }))
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
