const { expect } = require("chai");
const { response } = require("express");
const request = require("supertest");
const assert = require("chai").assert;
const { app } = require("../app");
const db = require("../models/index");
const { User } = db;
const bcrypt = require("bcrypt");
const { BaseError } = require("sequelize");
const MovieController = require('../controllers/MovieController');
const UsersController = require('../controllers/UserController');
const RentController = require('../controllers/RentController')

beforeEach(() => {
  db.sequelize.truncate({ cascade: true });
});

describe("GET /movies", () => {
  it("Should return status 200", (done) => {
    request(app).get("/movies").expect(200).end(done);
  });

  it("Should return json", (done) => {
    request(app)
      .get("/movies")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(done);
  });

  it("Should return movies", (done) => {
    request(app)
      .get("/movies")
      .expect(200)
      .then((response) => {
        assert.isNotEmpty(response._body);
        assert.isArray(response._body);
        response._body.forEach((movie) =>
          assert.containsAllKeys(movie, [
            "title",
            "description",
            "director",
            "producer",
            "release_date",
            "running_time",
            "rt_score",
          ])
        );
      })
      .then(() => done(), done); // soluciona el problema de  Error: Timeout of 2000ms exceeded.
  });
});

describe("GET /movies/:id", () => {
  it("Get Movie Details By ID", (done) => {
    request(app)
      .get("/movies/58611129-2dbc-4a81-a72f-77ddfc1b1b49")
      .expect(200)
      .then((response) => {
        assert.isNotEmpty(response._body); //no esta vacio
        assert.isNotArray(response._body);
        assert.containsAllKeys(response._body, [
          "title",
          "description",
          "director",
          "producer",
          "release_date",
          "running_time",
          "rt_score",
        ]);
      })
      .then(() => done(), done);
  });
});


// todo lo de arriba anda joya


describe("POST /register", () => {
  const userExample = {
    email: "cristian@gmail.com",
    password: "avalith",
    phone: "555-555-555",
    dni: "43123453",
  };  

  it("should user register", (done) => {
    request(app)
      .post("/register")
      .send(userExample)
      .expect(201)
      .then(async (response) => {
        assert.isTrue(response._body.ok)
        assert.isNotEmpty(response._body); //no esta vacio
        assert.isNotArray(response._body);
        console.log(response._body);
        assert.containsAllKeys(response._body.usuario, [  
          "email",
          "dni",
          "phone",
          "password"
        ]);
        const userDB = await User.findOne({
          where: { email: userExample.email },
        });
        assert.exists(userDB);
        assert.isTrue(
          bcrypt.compareSync(
            userExample.password,
            response._body.usuario.password
          )
        );
      })
      .then(() => done(), done())
  });
  
  it("should return 201", (done) => {
    request(app)
      .post("/register")
      .send(userExample)
      .expect(201)
      .then(() => done(), done());
  });

  it("Should not allowed user to register twice", (done) => {
    //TO-DO
    //Check that repeated user doesnt persist
    request(app)
      .post("/register")
      .send(userExample)
      .expect(201)
      .then(async (response) => {
        assert.isTrue(response._body.ok)
        assert.isNotEmpty(response._body); //no esta vacio
        assert.isNotArray(response._body);
        assert.containsAllKeys(response._body.user, [  
          "email",
          "dni",
          "phone",
          "password"
        ]);
        const userDB = await User.findOne({
          where: { email: userExample.email },
        });
        assert.exists(userDB);
        assert.isTrue(
          bcrypt.compareSync(
            userExample.password,
            response._body.user.password
          )
        );
      })
      .then(() => done(), done());

      request(app)
      .post("/register")
      .send(userExample)
      .expect(400)
      .then(async (response) => {
        //assert.isFalse(response._body.ok)
        //assert.isNotEmpty(response._body); //no esta vacio
        //assert.isNotArray(response._body);

        const userDB = await User.findOne({
          where: { email: userExample.email },
        });
        //assert.notExists(userDB);
        assert.isTrue(
          bcrypt.compareSync(
            userExample.password,
            response._body.usuario.password
          )
        );
      })
      .then(() => done(), done)
  })
});


describe("POST /login", () => {
  const userExample = {
    nombre: "Cristian",
    email: "cristian@gmail.com",
    password: "avalith",
    phone: "555-555-555",
    dni: "43123453",
  };

  it("should return 200 and a token", (done) => {
    request(app)
      .post("/register")
      .send(userExample)
      .then((user) => {
        request(app)
          .post("/login")
          .send({ email: userExample.email, 
                  password: userExample.password,
                  dni: userExample.dni, 
                  phone: userExample.phone
          })
          .expect(200)
          .then((res) => {
            //checks y aserciones
            assert.isString(res._body.user.email);
            assert.isString(res._body.user.password);
          })
          .then(async () => done(), done);
      });
  });
});

/*

describe('POST /favourite/:code', () => {
  beforeEach(done => {
    //Crear usuario y pelicula
    const user = {
      email: "AlexEch@gmail.com",
      password: "contraseñadealex",
      phone: "555-555-555",
      dni: "9223234567",
    };

    const movie = {
      code: "45204234-adfd-45cb-a505-a8e7a676b114",
      title: "My Neighbors the Yamadas",
      stock: 5,
      rentals: 1
    }

  })
  it("Should return 201 and set movie as favourite for logged user with review", done => {
    // TO-DO
    console.log("parametroooo");
    request(app)
      .post('/favourite/' + movie.code)
    // Check status
      .expect(201)
      .then(() => done(), done);
    // Check si se registro el cambio en la DB
      
    // Check si el registro en la DB es correcto
  })
  it("Should return 201 and set movie as favourite for logged user without review", done => {
    // TO-DO
    // Check status
    // Check si se registro el cambio en la DB
    // Check si el registro en la DB es correcto
  })
  it("Should not allow to favourite the same movie twice", done => {
    //TO-DO, llamar al endpoint con la misma peli 2 veces
    // Check error status
    // Check error message
    // Check db que no se haya persistido un registro
  })
})

describe('GET /favourites', () => {
  beforeEach(done => {
    // Crear usuario, pelicula y agregar favoritos
    const user = {
      nombre: "Alex Echeverria",
      email: "AlexEch@gmail.com",
      password: "contraseñadealex",
      phone: "555-555-555",
      dni: "9223234567",
    };
  })
  it("Should return 200 status and logged user favourite list", done => {
    // TO-DO
    // checkear que sea un array 
    // checkear que tenga la cantidad correcta de elementos
    // checkear las clave de cada elemento
    // checkear que los elementos sean/sea el/los correctos
    request(app)
      .post('/login')
      .send(userExample)
      .expect(200)
      .then((user) => {
        request(app)
          .get(`/favourites/user`)
          .set({ Authorization: `Bearer ${user._body.token}` })
          .expect(200)
          .then(async (response) => {
            assert.isArray(response._body)
            assert.containsAllKeys(response._body[0], [
              "id",
              "movie_code",
              "user_id",
              "review"
            ])
            const favourite = await MovieController.allFavouritesMovies();
            assert.deepEqual(response._body, favourite)
          })
          .then(() => done(), done);
      })
  })
  it("Should forbid access to non logged user", done => {
    //TO-DO
    //Chequear status
    //Chequear mensaje de error
    request(app)
      .get(`/favourites/user`)
      .expect(401)
      .then(async (response) => {
        assert.equal(response._body.error, "Authorization is not valid")
      })
      .then(() => done(), done);
  })
})

/*
describe('POST /rent/:code', () => {
  beforeEach(done => {
    // Crear usuario, pelicula
    })
    it("Should return 201 and successfully rent a movie", done => {
      //TO_DO
      //Check status
      //Chequear si se persistio correctamente la reserva
      //Chequear que se quito una peli de stock
      //Chequear que se sumo la renta a las veces alquiladas
    })
    it("Should not allow rent if there is no stock", done => {
      //TO-DO
    })
    it("Should not allow rent if movie does not exist", done => {
      //TO-DO
    })
    it("Should not allow non logged user to rent a movie", done => {
      //TO-DO
    })
  })

  */

  /*

describe("POST /return/:code", done => {
  beforeEach(done => {
    // Crear usuario, pelicula, y rentas, una vencida y una sin vencer
    const user = {
      email: "AlexEch@gmail.com",
      password: "contraseñadealex",
      phone: "555-555-555",
      dni: "9223234567",
    };

    const movie = {
      code: "45204234-adfd-45cb-a505-a8e7a676b114",
      title: "My Neighbors the Yamadas",
      stock: 5,
      rentals: 1
    };

    const currentRent = { // sin vencer
      id_rent: 1,
      id_user: 1,
      code: "45204234-adfd-45cb-a505-a8e7a676b114",
      rent_date: "2022-11-07 00:54:43",
      refund_date: "2022-11-14 00:54:43",
      userRefund_date: "2022-11-07 00:55:36"
    }

    const overdueRent = { // vencida
      id_rent: 1,
      id_user: 1,
      code: "45204234-adfd-45cb-a505-a8e7a676b114",
      rent_date: "2022-11-01 00:54:43",
      refund_date: "2022-11-7 00:54:43",
      userRefund_date: "2022-11-10 00:55:36"
    }
  })
  it("Should return a rental on time", done => {
    //TO-DO
    //Chequear status code 200
    //Chequear que se devuelva correctamente el precio
    //Chequear que se restockee correctamente la pelicula
    //Chequear que se persitio la fecha de devolucion
  })
  it("Should return late rental", done => {
    //TO-DO
    //Chequear status code 200
    //Chequear que se devuelva correctamente el precio con el agregado
    //Chequear que se restockee correctamente la pelicula
    //Chequear que se persitio la fecha de devolucion
  })
  it("Should return a movie that was rented a second time", done => {
    //TO-DO
  })
  it("Should not allow to rent movie twice simultaneously", done => {
    //TO-DO
  })
  it("Should not allow to return already returned movie", done => {
    //TO-DO
  })
  it("Should not allow to return non rented movie", done => {
    //TO-DO
  })
  it("Should not allow non logged user to return a movie", done => {
    //TO-DO
  })
})
  */

describe("Not Found handling", () => {
  it("Should return status 404", (done) => {
    request(app)
      .get("/")
      .expect(404)
      .then((response) => {
        assert.equal(response.res.statusMessage, "Not Found");
      })
      .then(() => done(), done);
  });
});
