import express from 'express';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const router = express.Router();

const buildUsersUri = () => {
    const host = process.env.MONGO_HOST || 'shoppinglist-mongo';
    const port = process.env.MONGO_PORT || '27017';
    const user = process.env.USER_DB_USER;
    const pass = process.env.USER_DB_PASSWORD;
    const db = process.env.USER_DB_NAME;
    if (!user || !pass || !db) throw new Error('USER_DB_* env vars required');
    return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${db}?authSource=${db}`;
};

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const uri = buildUsersUri();
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(process.env.USER_DB_NAME);
        const user = await db.collection('users').findOne({ email });
        if (!user) return res.status(401).json({ error: 'invalid email' });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ error: 'invalid credentials' });

        req.session.userId = String(user._id);
        req.session.role = user.role;
        return res.json({ ok: true, user: { email: user.email, role: user.role } });
    } catch (err) {
        return res.status(500).json({ error: 'server error' });
    } finally {
        await client.close();
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => res.json({ ok: true }));
});

router.get('/me', (req, res) => {
    if (!req.session || !req.session.userId) return res.status(401).json({ error: 'unauthenticated' });
    return res.json({ userId: req.session.userId, role: req.session.role });
});

export default router;
