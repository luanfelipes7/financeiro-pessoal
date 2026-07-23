const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail} = require('../models/userModel');

const SALT_ROUNDS = 10;

async function register(req, res){
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({error:'Nome, email e senha são obrigatórios.'});
        }

        if(password.length<6){
            return res.status(400).json({error: 'A senha precisa ter no mínimo 6 caracteres'});
        }

        const existingUser = findUserByEmail(email);
        if(existingUser){
            return res.status(409).json({ error: "Este email já está cadastrado"});
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const userId = createUser({name, email, passwordHash});

        return res.status(201).json({
            message: 'Usuário criado com sucesso.',
            user: {id: userId, name, email}
        });
        } catch(error){
            console.error(error);
            return res.status(500).json({error:'Erro interno ao criar usuário'});
        }
}

async function login(req, res) {
    try{
        const{ email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({error: 'Email e senha são obrigatórios.'});
        }

        const user = findUserByEmail(email);
        if(!user){
            return res.status(401).json({error: 'Email ou senha inválidos.'});
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if(!passwordMatches) {
            return res.status(401).json({ error : 'Email ou senha Inválidos.'});
        }

        const token = jwt.sign(
            {id: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        );
        
        return res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            user: {id: user.id, name: user.name, email: user.email}
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:'Erro interno ao fazer login'});
    }
}

module.exports = {register, login};