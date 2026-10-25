
const staffModel = require('../modules/staffmodules');

const allStaffController = (req, res) => {
    res.render('pages/home', {
        emps: staffModel().emps
    });
}

const StaffController = (req, res) => {
    index = req.params.index
    res.render('pages/staff', {
        employee: staffModel().emps[index]
    });
}

const StaffEditController = (req, res) => {
    index = req.params.index
    res.render('pages/staffEditor', {
        employee: staffModel().emps[index],
        index: index
    });
}

const StaffEditControllerPost = (req, res) => {
    index = req.params.index
    
    console.log("INDEX:", index);
    // console.log("EMPLOYEES:", staffModel().emps);

    const employee = staffModel().emps[index];

    console.log("EMPLOYEE:", employee);
    console.log("REEEQUEST",req.body.photo);
    employee.name = req.body.name
    employee.job = req.body.job;
    employee.address = req.body.address;
    employee.age = req.body.age;
    employee.experience = req.body.experience;
    employee.description = req.body.description;
    // employee.photo = req.body.photo;

//   Only change photo if a new value was provided
    if (req.body.photo) {
        employee.photo = req.body.photo;
    }

    res.redirect(`/staff/${index}`);
}

module.exports = {allStaffController,StaffController,StaffEditController,StaffEditControllerPost};
