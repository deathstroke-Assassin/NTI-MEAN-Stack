const MovieModel = require("../models/MovieModel");
const path = require("path");
const { unlink } = require("fs");

const index = (req, res) => {
  MovieModel.index().then((movies) => {
    res.render("pages/movies/index", { movies });
  });
};

const search = (req, res) => {
  MovieSearchText = req.query.MovieSearchText;
  MovieModel.search(MovieSearchText).then((movies) => {
    res.render("pages/movies/index", { movies });
  });
};

const getAllCategories = (req, res) => {
  res.render("pages/movies/categories");
};
const getCategory = (req, res) => {
  MovieCategory = req.params.category;
  console.log(req.params.category);
  MovieModel.getCategory(MovieCategory).then((movies) => {
    res.render("pages/movies/index", { movies, MovieCategory });
  });
};
const createForm = (req, res) => {
  res.render("pages/movies/createForm");
};

// const store = (req, res) => {
//     // validation
//     if (req.file != undefined) {
//         req.body.photo = req.file.filename;
//     }
//     else {
//         req.body.photo = "";
//     }

//     //////////////////
//     productModel.store(req.body)
//         .then(error => {
//             //
//         });
//     res.redirect("/products");
// }

const show = (req, res) => {
  const id = req.params["_id"];
  MovieModel.show(id).then((oneMovie) => {
    res.render("pages/movies/show", { oneMovie });
  });
};

const destroy = (req, res) => {
  const id = req.params["id"];
  MovieModel.updateForm(id).then((oneMovie) => {
    if (oneMovie.length != 0) {
      MovieModel.destroy(id).then((error) => {
        console.log(error);
      });
      res.redirect("/movies");
    }
  });
};

const updateForm = (req, res) => {
  const id = req.params["id"];
  MovieModel.updateForm(id).then((oneMovie) => {
    res.render("pages/movies/updateForm", { oneMovie });
  });
};

const update = async (req, res) => {
    const id = req.body.id;

    const oneMovie = await MovieModel.updateForm(id);

    if (oneMovie.length === 0) {
        return res.status(404).send("Movie not found");
    }

    if (req.file) {

        if (
            oneMovie[0].thumbnail &&
            !oneMovie[0].thumbnail.startsWith("http://") &&
            !oneMovie[0].thumbnail.startsWith("https://")
        ) {
            const publicPath = path.resolve("./", "public/img/uploades");

            unlink(
                path.join(publicPath, oneMovie[0].thumbnail),
                (err) => {
                    if (err && err.code !== "ENOENT") {
                        console.error("Failed to delete old thumbnail:", err);
                    }
                }
            );
        }

        req.body.thumbnail = req.file.filename;
    } else {
        req.body.thumbnail = oneMovie[0].thumbnail;
    }

    await MovieModel.update(req.body);

    res.redirect("/movies");
};

module.exports = {
  index,
  search,
  getAllCategories,
  getCategory,
  // createForm,
  // store,
  show,
  destroy,
  updateForm,
  update,
};
