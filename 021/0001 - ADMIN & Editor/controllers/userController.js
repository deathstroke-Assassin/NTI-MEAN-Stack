const userModel = require("../models/userModel");
const path = require("path");
const { unlink } = require("fs");
const bcrypt = require("bcrypt");

const index = (req, res) => {
  userModel.index().then((users) => {
    res.render("pages/users/index", { users });
  });
};

const show = (req, res) => {
  const id = req.params["id"];
  userModel.show(id).then((oneuser) => {
    res.render("pages/users/show", { oneuser });
  });
};

const updateForm = (req, res) => {
  const id = req.params["id"];
  userModel.updateForm(id).then((oneuser) => {
    res.render("pages/users/updateForm", { oneuser });
  });
};

const update = async (req, res) => {
  // validation

  const id = req.body.id;
  const oneuser = await userModel.updateForm(id);

  if (oneuser.length != 0) {
    const updateData = {
      id: req.body.id,
      userName: req.body.userName,
      fullname: req.body.fullname,
      userRole: req.body.userRole,
      isActive: req.body.isActive === 'true',
    };
    // Only update password if a new one was entered
    if (req.body.password && req.body.password.trim() !== "") {
      updateData.password = await bcrypt.hash(req.body.password, 11);
    } else {
      updateData.password = oneuser[0].password;
    }
    await userModel.update(updateData);

    res.redirect("/users");
  }
};

const destroy = (req, res) => {
  const id = req.params["id"];
  userModel.updateForm(id).then((oneuser) => {
    if (oneuser.length != 0) {
      userModel.destroy(id).then((error) => {
      });
      res.redirect("/users");
    }
  });
};

module.exports = {
  index,
  show,

  updateForm,
  update,
  destroy,
};
