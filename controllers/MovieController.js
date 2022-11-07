const fetch = (url) => import('node-fetch').then(({ default: fetch }) => fetch(url));
const GHIBLI_APP = 'https://ghibliapi.herokuapp.com/films/'
const db = require('../models/index')
const { Movie, FavouriteFilms } = db;
// JsonWebToken
const jwt = require("jsonwebtoken");

async function getFilmFromAPIByName(name) {
    let films = await fetch('https://ghibliapi.herokuapp.com/films')
    films = await films.json();
    return films.find(film => film.title.includes(name))
}

const orderMoviesByTitle = (movies, order) => {
    switch(order){
        case 'asc': 
                movies.sort((a,b) =>{
                    if(a.title < b.title){return -1;}
                    else if(a.title > b.title){return 1;}
                    else{return 0;}
                });
                break;

        case 'desc':
                movies.sort((a,b) =>{
                    if(a.title > b.title){return -1;}
                    else if(a.title < b.title){return 1;}
                    else{return 0;}
                });
                break;        
    }
    return movies;
}

const getMovies = async (req, res) => {
    console.log('List all movies');
    let movies = await fetch('https://ghibliapi.herokuapp.com/films');
    movies = await movies.json()
    movies = movies.map(movie => ({
        id: movie.id,
        title: movie.title,
        description: movie.description,
        director: movie.director,
        producer: movie.producer,
        release_date: movie.producer,
        running_time: movie.running_time,
        rt_score: movie.rt_score
    }));
    
    console.log("Order: ", req.query.order);
    let order = req.query.order;

    //order == 'asc'? movies.sort((a,b) => a.rt_score - b.rt_score)
      //        : movies.sort((a,b) => b.rt_score - a.rt_score);

    movies = orderMoviesByTitle(movies, order);
    res.status(200).send(movies);
}

const getMovieByTitle = async (req, res, next) =>{

    try {
        const title = req.params
        let movies = await fetch('https://ghibliapi.herokuapp.com/films');
        movies = await movies.json()
        movies = movies.map(movie => ({
            id: movie.id,
            title: movie.title,
            description: movie.description,
            director: movie.director,
            producer: movie.producer,
            release_date: movie.producer,
            running_time: movie.running_time,
            rt_score: movie.rt_score
        }));
        const movie = movies.find(movie => movie.title === title)
        res.status(200).send(movie);
    }catch (error) {
        error = new Error("Movie Not Found");
        error.status = 400;
        res.status(400).send("Movie Not Found");
        return next(error);
  }
}

const getMovieDetailsByTitle = async (req, res , next) =>{
    try {
        const {title}  = req.body;
        let movies = await fetch('https://ghibliapi.herokuapp.com/films');
        movies = await movies.json()
        const movie = movies.find((film) => film.title.includes(title))
        res.status(200).json(movie);
    } catch (error) {
        res.status(404).send( "404 - Movie not found" )
        error => next(error);
    }
}

const getMoviesByRuntime = async (req, res) => {
    const maxRuntime = req.params.max
    let movies = await fetch('https://ghibliapi.herokuapp.com/films');
    movies = await movies.json()
    movies = movies.map(movie => ({
        id: movie.id,
        title: movie.title,
        description: movie.description,
        director: movie.director,
        producer: movie.producer,
        release_date: movie.producer,
        running_time: movie.running_time,
        rt_score: movie.rt_score
    }));
    if (maxRuntime < 137) movies = movies.filter(movie => movie.running_time <= maxRuntime)
    
    console.log(req.query.order);
    let order = req.query.order;
    order == 'asc'? movies.sort((a,b) => a.running_time - b.running_time)
              : movies.sort((a,b) => b.running_time - a.running_time);
    
    res.status(200).send(movies);
}

const getMovieDetails = async (req, res) => {
    const { id } = req.params;
    let movies = await fetch('https://ghibliapi.herokuapp.com/films');
    movies = await movies.json()
    movies = movies.map(movie => ({
        id: movie.id,
        title: movie.title,
        description: movie.description,
        director: movie.director,
        producer: movie.producer,
        release_date: movie.producer,
        running_time: movie.running_time,
        rt_score: movie.rt_score
    }));
    const movie = movies.find(movie => movie.id === id)
    res.status(200).send(movie);
}

const addMovie = (req, res, next) => {
    const movie = getFilmFromAPIByName(req.body.title)
    const newMovie = {
        code: movie.id,
        title: movie.title,
        stock: 5,
        rentals: 0
    }
    Movie.create(newMovie)
        .then(movie => res.status(201).send("Movie Stocked"))
        .catch(err => next(err))
}

const addFavourite = async (req, res, next) => {
    try {
        const code = req.params.code;
        const { review } = req.body;

        Movie.findOne({ where: { code: code } }).then(film => {
            if (!film) throw new Error(' Pelicula no disponible ')

            const newFavouriteFilms = {
                MovieCode: film.code,
                UserId: req.user.id,
                review: review,
            };

            FavouriteFilms.create(newFavouriteFilms).then(newFav => {
                if (!newFav) throw new Error('FAILED to add favorite movie')

                res.status(201).send("Movie Added to Favorites");
            });
        });
    } catch (error) {
        error => next(error);
    }
}

const allFavouritesMovies = async (req, res, next) => {

    const allFilms = await FavouriteFilms.findAll({ where: { UserId: req.user.id } })

    let filmReduced = allFilms.map(film => {

        if (film.review != null) {
            return film
        } else {
            return {
                id: film.id,
                MovieCode: film.MovieCode,
                UserId: film.UserId
            }
        }
    })

    console.log(req.query.order);
    let order = req.query.order;
    console.log("Order: ", req.query.order);
    filmReduced =  orderMoviesByTitle(filmReduced, order);
    res.status(200).json(filmReduced);
}

module.exports = {
    getMovies,
    getMovieByTitle,
    getMovieDetails,
    getMoviesByRuntime,
    addMovie,
    addFavourite,
    allFavouritesMovies,
    getMovieDetailsByTitle,
    orderMoviesByTitle,
}