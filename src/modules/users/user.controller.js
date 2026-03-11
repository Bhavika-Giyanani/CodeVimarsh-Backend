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
