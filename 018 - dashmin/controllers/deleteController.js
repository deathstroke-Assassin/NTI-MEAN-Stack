const staffModel = require('../modules/staffmodules');

const deleteController = (req, res) => {
    const index = req.params.index;
    staffModel().emps.splice(index, 1);
res.redirect('/');
}
module.exports= deleteController