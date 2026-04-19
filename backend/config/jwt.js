require("dotenv").config();

/**
 * Same secret must be used for sign (register/login) and verify (middleware).
 * Set JWT_SECRET in backend/.env for any real deployment.
 */
let warnedMissingSecret = false;

function getJwtSecret() {
  const s = process.env.JWT_SECRET;
  if (s && String(s).trim()) return String(s).trim();
  if (!warnedMissingSecret) {
    warnedMissingSecret = true;
    console.warn(
      "⚠️  JWT_SECRET is not set. Using a built-in dev key. Set JWT_SECRET in backend/.env for security.",
    );
  }
  return "smartagri-local-dev-only-change-for-production";
}

module.exports = { getJwtSecret };
