const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MovieController = require('./controllers/MovieController');
const UsersController = require('./controllers/UserController');
const { checkLoggedIn, checkLoggedUser } = require('./middlewares/checks');
const errorHandler = require('./middlewares/errorHandler');
const RentController = require('./controllers/RentController')

router.use(bodyParser.json())

const welcome = (req, res, next) =>{

    res.send("Welcome");
}

// info listable 
router.get('/movies', MovieController.getMovies); // order by title Todas las películas
//router.get('/rents', checkLoggedUser, RentController ); // todas las películas alquiladas por un usuario
router.get('/favourites', checkLoggedUser, MovieController.allFavouritesMovies) // order by title todas las películas favoritas de un usuario

// buscar peliculas por codigo y title
router.get('/movies/:id', MovieController.getMovieDetails);
router.get('/search', MovieController.getMovieDetailsByTitle);
router.get('/runtime/:max', MovieController.getMoviesByRuntime)

// longin y register de usuarios
router.post('/register', UsersController.register)
router.post('/login', UsersController.login)

// logout para usuario
router.get("/login", (req, res) => res.send("You must to logued in"));
router.get("/logout", checkLoggedUser, UsersController.logout);

// alquiler
router.post('/movie', checkLoggedIn, MovieController.addMovie)
router.put("/rent/:code", checkLoggedUser, RentController.devMovie);
router.post("/rent/:code", checkLoggedUser, RentController.rentMovie); // anda joya
router.post('/favourite/:code', checkLoggedUser, MovieController.addFavourite)

router.get('/', welcome);

router.use(errorHandler.notFound);

module.exports = router;