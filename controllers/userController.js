

export const loginUserRender = async (req, res, next) => {
	try{
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

export default { loginUserRender, logoutUserRender , logoutUserAction };
