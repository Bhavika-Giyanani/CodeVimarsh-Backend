import { Router } from "express";
import * as userController from "./user.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { updateProfileSchema, adminUpdateUserSchema } from "./user.schema.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management
 */

/**
 * @swagger
 * /users/leaderboard:
 *   get:
 *     summary: Get the global XP leaderboard (top 50)
 *     tags: [Users]
 *     security: []
 *     responses:
 *       200:
 *         description: Leaderboard fetched successfully
 */
router.get("/leaderboard", userController.getLeaderboard);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user's public profile
 *     tags: [Users]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile
 *       404:
 *         description: User not found
 */
router.get("/:id", userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user's profile (owner or SUPER_ADMIN only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       403:
 *         description: Forbidden
 */

router.put(
  "/:id",
  authenticate,
  (req, res, next) => {
    const schema =
      req.user.role === "SUPER_ADMIN"
        ? adminUpdateUserSchema
        : updateProfileSchema;
    return validate(schema)(req, res, next);
  },
  userController.updateUserById,
);

export default router;
