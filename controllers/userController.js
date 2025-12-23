
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const buildUsersUri = () => {
    const host = process.env.MONGO_HOST || 'shoppinglist-mongo';
    const port = process.env.MONGO_PORT || '27017';
    const user = process.env.USER_DB_USER;
    const pass = process.env.USER_DB_PASSWORD;
    const db = process.env.USER_DB_NAME;
    if (!user || !pass || !db) throw new Error('USER_DB_* env vars required');
    return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${db}?authSource=${db}`;
};

export const loginUserRender = async (req, res, next) => {
	try {
		res.render('login');
	} catch (err) {
		err.status = err.status || 500;
		next(err);
	}
};

export const logoutUserRender = async (req, res, next) => {
	try {
		res.render('logout');
	} catch (err) {
		err.status = err.status || 500;
		next(err);
	}
};

export const logoutUserAction = async (req, res, next) => {
	try {
		req.session.destroy(() => res.json({ ok: true }));
	} catch (err) {
		err.status = err.status || 500;
		next(err);
	}
};

export const getUser = async (req, res, next) => {
	try {
		if (!req.session || !req.session.userId)
			return res.status(401).json({ error: 'unauthenticated' });
		return res.json({ userId: req.session.userId, role: req.session.role });
	} catch (err) {
		err.status = err.status || 500;
		next(err);
	}
}

export const loginUserAction = async (req, res, next) => {
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
}



