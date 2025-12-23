import express from 'express';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
const router = express.Router();
import { loginUserRender 
	,logoutUserRender
	, logoutUserAction
} from '../controllers/userController.js';

const buildUsersUri = () => {
    const host = process.env.MONGO_HOST || 'shoppinglist-mongo';
    const port = process.env.MONGO_PORT || '27017';
    const user = process.env.USER_DB_USER;
    const pass = process.env.USER_DB_PASSWORD;
    const db = process.env.USER_DB_NAME;
    if (!user || !pass || !db) throw new Error('USER_DB_* env vars required');
    return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${db}?authSource=${db}`;
};

router.get('/login', loginUserRender);
router.get('/logout', logoutUserRender);
router.post('/logout', logoutUserAction);

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const wantsHtml = req.accepts('html') && !req.is('application/json');
    if (!email || !password) {
        if (wantsHtml) return res.redirect('/users/login?error=missing');
        return res.status(400).json({ error: 'email and password required' });
    }

    const uri = buildUsersUri();
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(process.env.USER_DB_NAME);
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            if (wantsHtml) return res.redirect('/users/login?error=invalid');
            return res.status(401).json({ error: 'invalid credentials' });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            if (wantsHtml) return res.redirect('/users/login?error=invalid');
            return res.status(401).json({ error: 'invalid credentials' });
        }

        req.session.userId = String(user._id);
        req.session.role = user.role;
        if (wantsHtml) return res.redirect('/');
        return res.json({ ok: true, user: { email: user.email, role: user.role } });
    } catch (err) {
        if (wantsHtml) return res.redirect('/users/login?error=server');
        return res.status(500).json({ error: 'server error' });
    } finally {
        await client.close();
    }
});


router.get('/me', (req, res) => {
    if (!req.session || !req.session.userId) return res.status(401).json({ error: 'unauthenticated' });
    return res.json({ userId: req.session.userId, role: req.session.role});
});

export default router;
