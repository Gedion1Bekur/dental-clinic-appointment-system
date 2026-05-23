import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import userModel from '../models/userModel.js';
import refreshTokenModel from '../models/refreshTokenModel.js';
import { jwtConfig } from '../config/jwt.js';

const authService = {
  async register({ name, email, password }) {
    const existing = userModel.findByEmail(email);
    if (existing) {
      const err = new Error('Email already registered');
      err.status = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = userModel.create({
      name,
      email,
      passwordHash,
      role: 'patient',
    });

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },

  async login({ email, password }) {
    const user = userModel.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }

    const tokens = this.generateTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  },

  generateTokens(user) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, jwtConfig.accessSecret, {
      expiresIn: jwtConfig.accessExpiresIn,
    });
    const refreshToken = jwt.sign(
      { id: user.id, jti: uuidv4() },
      jwtConfig.refreshSecret,
      { expiresIn: jwtConfig.refreshExpiresIn }
    );
    return { accessToken, refreshToken };
  },

  async storeRefreshToken(userId, refreshToken) {
    const decoded = jwt.decode(refreshToken);
    const expiryDate = new Date(decoded.exp * 1000).toISOString();
    refreshTokenModel.create({ userId, token: refreshToken, expiryDate });
  },

  async refresh(refreshToken) {
    if (!refreshToken) {
      const err = new Error('Refresh token required');
      err.status = 401;
      throw err;
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);
    } catch {
      const err = new Error('Invalid refresh token');
      err.status = 401;
      throw err;
    }

    const stored = refreshTokenModel.findByToken(refreshToken);
    if (!stored) {
      const err = new Error('Refresh token not found');
      err.status = 401;
      throw err;
    }

    if (new Date(stored.expiry_date) < new Date()) {
      refreshTokenModel.deleteByToken(refreshToken);
      const err = new Error('Refresh token expired');
      err.status = 401;
      throw err;
    }

    const user = userModel.findById(decoded.id);
    if (!user) {
      const err = new Error('User not found');
      err.status = 401;
      throw err;
    }

    refreshTokenModel.deleteByToken(refreshToken);

    const fullUser = userModel.findByEmail(user.email);
    const tokens = this.generateTokens(fullUser);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  },

  async logout(refreshToken) {
    if (refreshToken) {
      refreshTokenModel.deleteByToken(refreshToken);
    }
  },

  verifyAccessToken(token) {
    return jwt.verify(token, jwtConfig.accessSecret);
  },
};

export default authService;
