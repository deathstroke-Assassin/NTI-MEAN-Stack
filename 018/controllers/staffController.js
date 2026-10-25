
const staffModel = require('../modules/staffmodules');

const staffController = (req, res) => {
    res.render('pages/staff', {
        depName: staffModel().staffTitle,
        staffCount: staffModel().staffCount,
        emps: staffModel().emps
    });
}

module.exports = staffController;

