-- Run once against your SmartAgri MySQL database, e.g.:
--   mysql -u USER -p DATABASE < migrations/001_add_user_address_phone.sql
ALTER TABLE users
  ADD COLUMN address VARCHAR(500) NOT NULL DEFAULT '',
  ADD COLUMN phone_number VARCHAR(32) NOT NULL DEFAULT '';

-- If your users table has no role column yet, run this too (or restart the API — db.js adds it automatically):
-- ALTER TABLE users ADD COLUMN role VARCHAR(32) NOT NULL DEFAULT 'farmer';
