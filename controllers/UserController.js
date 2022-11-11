const db = require('../models/index');
const { User } = db;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const login = (req, res, next) => {
    try{    
        console.log(req.body);
        let body = req.body
        User.findOne({ where: { email: body.email } }).then(usuarioDB => {
            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Usuario o contraseña incorrectos"
                    }
                })
            }
            // Valida que la contraseña escrita por el usuario, sea la almacenada en la db
            if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Usuario o contraseña incorrectos"
                    }
                });
            }
            // Genera el token de autenticación
            let token = jwt.sign({
                usuario: usuarioDB,
            }, process.env.SEED_AUTENTICACION, {
                expiresIn: process.env.CADUCIDAD_TOKEN
            });
            res.json({
                ok: true,
                usuario: usuarioDB,
                token,
            })
        }).catch(error => next(error));
    }catch(error){
        let msg = "Error login user"
        console.log(error);
        error = new Error(msg);
        error.status = 400;
        res.status(400).send(msg);
        return next(error);
    }
}

const register = async (req, res, next) => {

    console.log(res.body);
    
    try{
        let { email, password, dni, phone } = req.body;
        let usuario = {
            email,
            dni,
            phone,
            password: bcrypt.hashSync(password, 10)
        }  

        const userHunting = await User.findOne({
            where: {email: email},
            where: {dni: dni},
        })

        if(!userHunting){
            let testAccount = await nodemailer.createTestAccount();
            User.create(usuario).then(async usuarioDB => {
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: "ejemplosmailalexis@gmail.com",
                        pass: "uosjucgjopazadit"
                    }
                });
                let info = await transporter.sendMail({
                    from: '"Blockbuster" <no-reply@blockbuster.com>',
                    to: email,
                    subject: "Verify your account",
                    text: "Verify your account please http://localhost:3000/verify/" + usuarioDB.id
                });
                return res.status(201).json({
                    ok: true,
                    usuario: usuarioDB
                }).end();
            });
        }
        else{
            res.status(400).send("User exists");
        }
    }
    catch(error){
        let msg = "Error create User"
        console.log(error);
        error = new Error(msg);
        error.status = 400;
        res.status(400).send(msg);
        return next(error);
    }
}

const verifyUser = (req, res) => {
    User.update({verified: true} ,{ where: { id: req.params.id }})
    .then(() => {
        res.status(200).send("User Verified")
    })
}

const logout = (req, res, next) => {
    req.user = null;
    console.log("LoguedOut");
    res.redirect("/login");
};

module.exports = {
    login,
    register,
    verifyUser,
    logout
}