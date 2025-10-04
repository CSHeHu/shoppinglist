import * as itemModel from '../models/itemModel.js';

const showDashboard = async (req, res, next, model = itemModel) => {
  try {
    const items = await model.getAllItems();
    res.render('index', { title: 'Shopping List', items });
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

export default { showDashboard };
