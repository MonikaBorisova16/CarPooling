import express, { Request, Response } from 'express';
import { User, UserDetails } from '../models/User'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import JWT from '../models/JWT';
import Credentials from '../models/Authentication';
import { userToUserDTO } from '../helpers/UserToUserDTO';
import cors from 'cors';

var blacklist = require('express-jwt-blacklist');

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

const router = express.Router()
router.use(cors(corsOptions))

//Get user by username
router.get('/api/users/get/:username', async (req: Request, res: Response) => {
    var token = req.headers.authorization?.substr(7)
    const decoded = jwt.verify(token as string, "secret") as JWT;
    const user = (await User.find({ username: req.params.username })).pop();
    if (user != undefined) {
        const userDTO = await userToUserDTO(user.id);
        return res.status(200).send(userDTO)
    }
    return res.status(400).sendStatus(400);
})

//Get user by id
router.get('/api/users/getID/:id', async (req: Request, res: Response) => {
    // var token = req.headers.authorization?.substr(7)
    // const decoded = jwt.verify(token as string, "secret") as JWT;
    const user = await User.findById(req.params.id);
    if (user != undefined) {
        const userDTO = await userToUserDTO(user.id);
        return res.status(200).send(userDTO)
    }
    return res.status(400).sendStatus(400);
})

//Get current user
router.get('/api/users/authenticate/me', async (req: Request, res: Response) => {
    try {
        var token = req.headers.authorization?.substr(7)
        const decoded = jwt.verify(token as string, "secret") as JWT;
        const user = await User.findById(decoded.id);
        if (user != undefined && user.id == decoded.id) {
            const userDTO = await userToUserDTO(user.id);
            return res.status(200).send(userDTO)
        }
        return res.status(400).sendStatus(400);
    } catch (error) {
        return res.status(400).sendStatus(400);
    }
});

router.get('/api/users', async (req: Request, res: Response) => {
    const users = User.find({enabled:true});
    return res.status(200).send(await users);
})

router.post('/api/users/register', async (req: Request, res: Response) => {
    const { firstName, lastName, username, email, phone } = req.body;
    const userFind = await User.find({ username: req.body.username })
    if (userFind.length > 0) {
        return res.status(409).send("Username already exists!")
    }
    if (req.body.password.length <= 8 || req.body.password.length >= 18) {
        throw new Error("Pass length" + req.body.password.length);
    }
    const password = await bcrypt.hash(req.body.password, 8);
    const user = User.build({ firstName, lastName, username, email, password, phone })
    await user.save();
    return res.status(201).sendStatus(201);
})

router.post('/api/users/authenticate', async (req: Request, res: Response) => {
    const credentials = req.body as Credentials;
    try {
        const user = (await User.find({ username: credentials.username })).pop();
        if (!user) {
            return res.status(400).sendStatus(400);
        }
        const passIsValid = await bcrypt.compare(credentials.password, user.password);
        if (!passIsValid) {
            return res.status(400).sendStatus(400);
        }
        const token = jwt.sign({ id: user._id, role: user.role }, "secret", {
            expiresIn: '1h'
        });

        res.status(200).json({ token, user });
    } catch (err) {
        return res.status(400).sendStatus(400);
    }
});

router.post('/api/users/logout', async (req: Request, res: Response) => {
    try {
        var token = req.body.headers.Authorization?.substr(7)
        const decoded = jwt.verify(token as string, "secret") as JWT;
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).sendStatus(400);
        }
        blacklist.revoke(user)
        res.status(200).sendStatus(200);
    } catch (err) {
        return res.status(400).sendStatus(400);
    }
});

router.post('/api/users/:username/avatar', async (req: Request, res: Response) => {
    //TODO
});

router.get('/api/users/:username/avatar', async (req: Request, res: Response) => {
    try {
        var token = req.headers.authorization?.substr(7)
        const decoded = jwt.verify(token as string, "secret") as JWT;
        const user = await User.findById(decoded.id);
        const userDetails = await UserDetails.findById(user?.userDetailsID);
        if (user != undefined && user.id == decoded.id && user.username === req.params.username) {
            return res.status(200).send(userDetails?.avatar)
        }
        return res.status(400).sendStatus(400);
    } catch (error) {
        return res.status(400).sendStatus(400);
    }
});

router.put('/api/users/edit', async (req: Request, res: Response) => {
    var token = req.headers.authorization?.substr(7)
    const decoded = jwt.verify(token as string, "secret") as JWT;
    const user = await User.findById(decoded.id);
    if (user != undefined && user.id == decoded.id) {
        await UserDetails.updateOne({ _id: user.userDetailsID }, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            avatar: "avatar"
        });
    }
    return res.status(201).sendStatus(200);
})

// router.get('/api/users/:username/cars', async (req: Request, res: Response) => {
//     try {
//         var token = req.headers.authorization?.substr(7)
//         const decoded = jwt.verify(token as string, "secret") as JWT;
//         const user = await User.findById(decoded.id);
//         if (user != undefined && user.id == decoded.id && user.username === req.params.username) {
//             return res.status(200).send(user?.ownedCars)
//         }
//         return res.status(400).sendStatus(400);
//     } catch (error) {
//         return res.status(400).sendStatus(400);
//     }
// })

//Delete user
router.delete('/api/users/:userID', async (req: Request, res: Response) => {
    var decoded;
    try {
        console.log(req)
        var token = req.headers.authorization?.substr(7)
        decoded = jwt.verify(token as string, "secret") as JWT;
        const user = await User.findById(decoded.id);
        console.log(user)
        if (user?.role !== 0) {
            console.log(user?.role)
            return res.status(400).sendStatus(400);
        }

        const userToDelete = await User.findById(req.params.userID)
        if (userToDelete) {
            userToDelete.enabled = false;
            console.log(userToDelete)
            await userToDelete.save();
            return res.status(204).sendStatus(204);
        }
        return res.status(400).sendStatus(400);
    } catch (error) {
        console.log(error)
        return res.status(400).sendStatus(400);
    }
})

export { router as UserRouter }