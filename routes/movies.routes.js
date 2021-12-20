// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();

const Movie = require("../models/Movie.model");
const Celebrity = require("../models/Celebrity.model");
// all your routes here
router.get("/movies", async (req, res, next) => {
  try {
    const moviesData = await Movie.find();
    //console.log(moviesData); // array, and handlebars need an object --> { moviesData }
    res.render("movies/movies", { movies: moviesData });
  } catch (error) {
    console.error("Error while creating the celebrity", error);
    next(error);
  }
});

router.get("/movies/create", async (req, res, next) => {
  try {
    const celebritiesArr = await Celebrity.find();
    console.log(celebritiesArr); // array
    // pass into {} --> to be an object --> { celebritiesArr }
    res.render("movies/new-movie", { celebritiesArr });
  } catch (error) {
    console.error("Error while creating the movie", error);
    next(error);
  }
});

// POST - Send information to DB
router.post("/movies/create", async (req, res, next) => {
  try {
    //res.send(req.body);
    const { title, genre, plot, cast } = req.body;
    const newMovie = await Movie.create({ title, genre, plot, cast });
    res.redirect("/movies");
  } catch (error) {
    console.error("Error while sending movie to DB", error);
    res.render("movies/new-movie");
    next(error);
  }
});

router.get("/movies/:movieId", async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId).populate("cast");
    //console.log(movie);
    res.render("movies/movie-details", movie);
  } catch (error) {
    console.error("Error while sending movie to DB", error);
    res.render("movies/all");
    next(error);
  }
});

router.post("/movies/:id/delete", async (req, res, next) => {
  try {
    const { id } = req.params;
    //res.send(id);
    const movieDelete = await Movie.findByIdAndRemove(id);
    res.redirect("/movies");
  } catch (error) {
    console.error("Error deleting sending movie to DB", error);
    res.render("/");
    next(error);
  }
});

router.get("/movies/:id/edit", async (req, res, next) => {
  // Iteration #4: Update the drone
  try {
    const { id } = req.params;
    //res.send(id)
    const movie = await Movie.findById(id).populate("cast");
    const actors = await Celebrity.find();
    res.render("movies/edit-movie", { movie, actors: actors });
  } catch (error) {
    console.log("Error while getting the movies from the DB: ", error);
    // Call the error-middleware to display the error page to the user
    next(error);
  }
});

// Post - fill out the form with the information
router.post("/movies/:id/edit", async (req, res, next) => {
  const { id } = req.params;
  const { title, genre, plot, cast } = req.body;

  console.log(title, genre, plot, cast);
  //res.send(req.body)
  const updateMovie = await Movie.findByIdAndUpdate(
    id,
    { title, genre, plot, cast },
    { new: true }
  );
  console.log("updated", updateMovie);
  res.redirect(`/movies/${id}`);
});

module.exports = router;
