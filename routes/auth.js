import { Router } from "express";
import { body, validationResult } from "express-validator";
import { hash, genSalt, compare } from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

const router = Router();

router.post(
    '/register',
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        try {
            if (await User.findOne({email: req.body.email})) return res.status(400).json({ msg: 'This Email is already in use' });
            const user = new User({ name: req.body.name, email: req.body.email, password: await hash(req.body.password, await genSalt()) });
            await user.save();
            const token = jwt.sign({ user: { id: user.id } }, process.env.JWT, {
                expiresIn: '1h'
            })
            res.json({token});
        } catch (e) { next(e); }
    })

router.post(
    '/login',
    body('email').isEmail(),
    body('password').notEmpty(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
            const isMatch = await compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
            const token = jwt.sign({ user: { id: user.id } }, process.env.JWT, {
                expiresIn: '1h'
            });
            res.json({ token })
        } catch (e) { next(e) }
    })

export default router;