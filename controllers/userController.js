

export const loginUser = async (req, res, next) => {
	try{
		res.render('login');
	} catch (err) {
		err.status = err.status || 500;
		next(err);
    }
};

export default { loginUser };
