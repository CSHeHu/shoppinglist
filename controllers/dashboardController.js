import * as itemModel from '../models/itemModel.js';

const showDashboard = async (req, res, next) => {
  try {
    const items = await itemModel.getAllItems();
    res.render('index', { title: 'Shopping List', items });
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

export default { showDashboard };
