import authService from '../services/authService.js';
import { cookieOptions } from '../config/jwt.js';

const authController = {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ message: 'Registration successful', user });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.cookie('refreshToken', result.refreshToken, cookieOptions);
      res.json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req, res, next) {
    const token = req.cookies.refreshToken;
    if (!token) {
      // Normal when user is not logged in — do not log as server error
      return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
      const result = await authService.refresh(token);
      res.cookie('refreshToken', result.refreshToken, cookieOptions);
      res.json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (err) {
      res.clearCookie('refreshToken', { path: cookieOptions.path });
      next(err);
    }
  },

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      await authService.logout(refreshToken);
      res.clearCookie('refreshToken', { path: cookieOptions.path });
      res.json({ message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  },

  async me(req, res) {
    res.json({ user: req.user });
  },
};

export default authController;
