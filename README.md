# blockbusterExample

->  Endpoints:

-> Para traer toda la lista de peliculas existentes en la api:
Get  http://localhost:3000/movies


router.get('/rents', );
router.get('/favourites', checkLoggedUser, MovieController.allFavouritesMovies)
router.get('/movies/:id', MovieController.getMovieDetails);
router.get('/runtime/:max', MovieController.getMoviesByRuntime)

-> Para iniciar sesion, la seccion de Body: 
{
    "email": "tuemail@email.com", 
    "password": "tucontraseña"
}
Post http://localhost:3000/login


-> Para registrarte en el sistema
{
    "email": "tuemail@email.com", 
    "password": "tucontraseña", 
    "dni": "tudni", 
    "phone": "tunumerodetelefono"
http://localhost:3000/register





router.get("/logout", checkLoggedUser, UsersController.logout);
router.post('/movie', checkLoggedIn, MovieController.addMovie)
router.post('/rent/:code', checkLoggedUser, RentController.rentMovie)
router.post('/favourite/:code', checkLoggedUser, MovieController.addFavourite)
router.use(errorHandler.notFound);
