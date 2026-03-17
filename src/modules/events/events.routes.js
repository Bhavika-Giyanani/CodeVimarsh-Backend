import { Router } from "express";
import * as eventsController from "./events.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireSuperAdmin } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createEventSchema,
  updateEventSchema,
  registerEventSchema,
} from "./events.schema.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management & registration
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of all events
 */
router.get("/", eventsController.getAllEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */
router.get("/:id", eventsController.getEventById);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEvent'
 *     responses:
 *       201:
 *         description: Event created
 */
router.post(
  "/",
  authenticate,
  requireSuperAdmin,
  validate(createEventSchema),
  eventsController.createEvent
);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event by ID
 *     tags: [Events]
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
 *             $ref: '#/components/schemas/UpdateEvent'
 *     responses:
 *       200:
 *         description: Event updated
 */
router.put(
  "/:id",
  authenticate,
  requireSuperAdmin,
  validate(updateEventSchema),
  eventsController.updateEvent
);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event by ID
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted
 */
router.delete(
  "/:id",
  authenticate,
  requireSuperAdmin,
  eventsController.deleteEvent
);

/**
 * @swagger
 * /events/{id}/register:
 *   post:
 *     summary: Register for an event
 *     tags: [Events]
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
 *             $ref: '#/components/schemas/RegisterEvent'
 *     responses:
 *       201:
 *         description: Successfully registered
 *       404:
 *         description: Event not found
 *       409:
 *         description: Already registered
 */
router.post(
  "/:id/register",
  authenticate,
  validate(registerEventSchema),
  eventsController.registerForEvent
);

export default router;
