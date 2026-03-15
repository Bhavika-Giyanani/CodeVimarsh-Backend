import * as userService from "./user.service.js";

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const user = await userService.updateUserById(
      req.user.id,
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const users = await userService.getLeaderboard();
    res.status(200).json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /users/:id/avatar
 * Uploads a new avatar image to Cloudinary and stores the resulting URL
 * in the users table.
 *
 * This controller runs AFTER upload.middleware has already:
 *   1. Checked file size ≤ MAX_AVATAR_SIZE_KB
 *   2. Validated MIME type (image/* only)
 *   3. Uploaded the file to Cloudinary with a 400×400 face-crop transformation
 *   4. Set req.file with { path: secureUrl, filename: publicId }
 *
 * Ownership: only the authenticated user can update their own avatar.
 */
export const uploadAvatar = async (req, res, next) => {
  try {
    // ── Guard: multer must have processed a file ──────────────────────────────
    if (!req.file) {
      const err = new Error(
        "No image file provided. Please attach an image with field name 'avatar'."
      );
      err.statusCode = 400;
      return next(err);
    }

    // ── Guard: account owners only ────────────────────────────────────────────
    if (req.user.id !== req.params.id) {
      const err = new Error("You are not allowed to update another user's avatar.");
      err.statusCode = 403;
      return next(err);
    }

    // multer-storage-cloudinary puts the secure HTTPS URL in req.file.path
    // and the Cloudinary public_id in req.file.filename
    const avatarUrl = req.file.path;
    const publicId  = req.file.filename;

    const updated = await userService.updateAvatar(req.params.id, avatarUrl, publicId);

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully.",
      avatar: updated.avatar,
    });
  } catch (err) {
    next(err);
  }
};