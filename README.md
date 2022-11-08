# blockbusterExample

Correr migracion:
npx sequelize-cli db:migrate

Correr migracion para test:
npx sequelize-cli db:migrate --env test

Rellenar la tabla de movies en la base de datos:
npx sequelize-cli db:seed:all

Para iniciar el proyecto:
npm start

Para testear el proyecto:
npm test

->  Endpoints <-

-> Para traer toda la lista de peliculas existentes en la api:
Get  http://localhost:3000/movies


-> Registrarte en el sistema
{
    "email": "tuemail@email.com", 
    "password": "tucontraseña", 
    "dni": "tudni", 
    "phone": "tunumerodetelefono"
http://localhost:3000/register

-> Iniciar sesion, la seccion de Body: 
{
    "email": "tuemail@email.com", 
    "password": "tucontraseña"
}
Post http://localhost:3000/login


-> Cerrar sesion
    Poner en Headers:
     
    KEY:
    Authorization

    Values:
    Bearer + Tu token

Get http://localhost:3000/logout




http://localhost:3000/favourites
http://localhost:3000/runtime/:max



http://localhost:3000/rents


-> Hacer un alquiler
    Poner en Headers:
     
    KEY:
    Authorization

    Values:
    Bearer + Tu token

http://localhost:3000/rent/:code
Ejemplo: http://localhost:3000/rent/758bf02e-3122-46e0-884e-67cf83df1786




http://localhost:3000/favourite/:code
