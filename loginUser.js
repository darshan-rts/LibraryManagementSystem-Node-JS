/**
 * Router for /login
 *
 * Changes made:
 * - Removed unused requires.
 * - Added input validation and normalization.
 * - Added try/catch around async code and call next(err) on unexpected errors.
 * - Require a password from the login form and compare with bcrypt if DB stores a hash.
 * - Removed accidental global `session = ...` assignment and only use req.session.
 * - Added helpful logging for failed attempts (without exposing sensitive data).
 *
 * Notes:
 * - This expects the login form to POST `email` and `password`.
 * - Ensure passwords in the DB are stored hashed (bcrypt). If not, migrate them.
 * - Install bcrypt in the project (npm install bcrypt) and configure session security.
 */
const express = require("express");
const router = express.Router();
const home = require("./home");
const redirectLogin = require('./redirectLogin');
const bcrypt = require("bcrypt");

/**
 * userData must provide an async getUser(email) that returns an array of user rows.
 * The user row should include user_id and password (hashed).
 */
module.exports = (userData) => {

  // Render login page
  router.get("/", (req, res) => {
    res.render("login");
  });

  // Handle login form submission
  router.post("/", async (req, res, next) => {
    try {
      const { email, password } = req.body || {};

      // Basic validation
      const normalizedEmail = email ? String(email).trim().toLowerCase() : "";
      if (!normalizedEmail || !password) {
        // Do not reveal which one is missing — just redirect back to login
        console.warn("Login attempt with missing email or password");
        return res.redirect("/login");
      }

      // Lookup user by email
      const user = await userData.getUser(normalizedEmail);

      if (!user || user.length === 0) {
        // No user found
        console.info(`Login failed: no user for email ${normalizedEmail}`);
        return res.redirect("/login");
      }

      const dbUser = user[0];

      // If DB has a password field, require a match. Otherwise, deny for safety.
      if (!dbUser.password) {
        console.warn(`User ${normalizedEmail} has no password set in DB — rejecting login.`);
        return res.redirect("/login");
      }

      const passwordMatches = await bcrypt.compare(password, dbUser.password);
      if (!passwordMatches) {
        console.info(`Login failed: invalid password for ${normalizedEmail}`);
        return res.redirect("/login");
      }

      // Successful login: set session user id (no global variable)
      req.session.userid = dbUser.user_id;

      // Redirect to protected home
      return res.redirect(`/login/home`);
    } catch (err) {
      console.error("Error during login:", err);
      return next(err);
    }
  });

  router.use("/home", redirectLogin, home());

  return router;
};
