import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';

const userController = {
  list(req, res) {
    const users = userModel.findAll();
    res.json({ users });
  },

  update(req, res, next) {
    try {
      const { id } = req.params;
      const existing = userModel.findById(id);
      if (!existing) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (req.body.email) {
        const emailTaken = userModel.findByEmail(req.body.email);
        if (emailTaken && emailTaken.id !== Number(id)) {
          return res.status(409).json({ error: 'Email already in use' });
        }
      }

      const user = userModel.update(id, req.body);
      res.json({ user });
    } catch (err) {
      next(err);
    }
  },

  remove(req, res) {
    const { id } = req.params;
    if (Number(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const existing = userModel.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'User not found' });
    }

    userModel.delete(id);
    res.json({ message: 'User deleted' });
  },

  async updateProfile(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (email) {
        const emailTaken = userModel.findByEmail(email);
        if (emailTaken && emailTaken.id !== req.user.id) {
          return res.status(409).json({ error: 'Email already in use' });
        }
      }

      const user = userModel.update(req.user.id, { name, email });

      if (password) {
        const passwordHash = await bcrypt.hash(password, 10);
        userModel.updatePassword(req.user.id, passwordHash);
      }

      res.json({ user });
    } catch (err) {
      next(err);
    }
  },

  getProfile(req, res) {
    const user = userModel.findById(req.user.id);
    res.json({ user });
  },
};

export default userController;
