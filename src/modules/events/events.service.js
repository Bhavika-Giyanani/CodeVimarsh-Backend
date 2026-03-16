import prisma from "../../config/prisma.js";
import { sendEventRegistrationEmail } from "../../services/mail.service.js";

/**
 * Creates a new event.
 */
export const createEvent = async (data, createdBy) => {
  const event = await prisma.event.create({
    data: {
      ...data,
      created_by: createdBy,
    },
  });
  return event;
};

/**
 * Updates an existing event.
 */
export const updateEvent = async (eventId, data) => {
  const event = await prisma.event.update({
    where: { id: eventId },
    data,
  });
  return event;
};

/**
 * Deletes an event.
 */
export const deleteEvent = async (eventId) => {
  const event = await prisma.event.delete({
    where: { id: eventId },
  });
  return event;
};

/**
 * Retrieves all events.
 */
export const getAllEvents = async () => {
  const events = await prisma.event.findMany({
    orderBy: { start_date: "asc" },
  });
  return events;
};

/**
 * Retrieves a specific event and its basic relation counts.
 */
export const getEventById = async (eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      speakers: true,
      _count: {
        select: { registrations: true },
      },
    },
  });
  if (!event) throw new Error("Event not found");
  return event;
};

/**
 * Registers a user for an event and sends a confirmation email.
 */
export const registerForEvent = async (eventId, user, data) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!event) throw new Error("Event not found");

  const existingRegistration = await prisma.eventRegistration.findUnique({
    where: {
      user_id_event_id: {
        user_id: user.id,
        event_id: eventId,
      },
    },
  });

  if (existingRegistration) {
    throw new Error("You are already registered for this event.");
  }

  const registration = await prisma.eventRegistration.create({
    data: {
      ...data,
      user_id: user.id,
      event_id: eventId,
      full_name: user.name,
      email: user.email,
    },
  });

  // Send thank-you email
  await sendEventRegistrationEmail(user.email, user.name, event.title);

  return registration;
};
