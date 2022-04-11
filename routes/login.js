const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');


// router.use(auth);
router.post('/signup', async (req, res) => {
    const { email, password, username } = req.body;
    let user = await User.findOne({ "email": email });
    try {
        if (user) {
            return res.status(400).json({ "msg": "Invalid Credentials" });
        }
        else {
            const hashed_password = await bcrypt.hash(password, 10);
            user = new User({ email: email, password: hashed_password, username: username });
            await user.save();
            let token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
                expiresIn: 86400
            });
            return res.status(200).json({ token: token });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ "msg": err.message })
    }
});

router.get('/auth', auth, async (req, res) => {
    const user = await User.findOne({ id: req.user.id }).select('-password');
    if (!user) {
        return res.status(400).json({ "msg": "User Not exists" });
    }
    const user_data = { "username": user.username, "profilePicture": user.profilePicture };
    return res.status(200).json({ "msg": user_data });
});


router.get('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ "email": email });
        if (!user) {
            return res.status(400).json({ "msg": "Invalid Credentials" });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ "msg": "Invalid Credentials" });
        }
        let token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
            "expiresIn": 86400
        });
        const user_data = { "username": user.username, "profilePicture": user.profilePicture, "token": token, "id": user.id };
        return res.status(200).json({ "msg": user_data });
    }
    catch (err) {
        return res.status(400).json({ "msg": err.message });
    }
});


module.exports = router;