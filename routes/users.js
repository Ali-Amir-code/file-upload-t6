import { Router } from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
const router = Router();

router.get('/', auth, async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) { next(err); }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

export default router;
