const User = require("../schema/userSchema")
const express = require("express")
const router = express.Router();
const jwt = require("jsonwebtoken")
const jwtkey = "user";

router.post("/", async (req, res) => {
    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname,
        role: req.body.role,
        mobile: req.body.mobile,
        address: req.body.address
    })
    const doesExit = await User.findOne({ email: user.email })
    if (doesExit) {
        res.json("already 6")
    }
    const result = await user.save();
    res.status(200).json(result)
})

router.post("/login", async (req, res) => {
    const user = await User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    })
    try {
        if (req.body.email && req.body.password) {
            const doesExit = await User.findOne({ email: user.email })
            if (doesExit.password === user.password) {
                jwt.sign({ doesExit }, jwtkey, { expiresIn: "5000s" }, (err, token) => {
                    if (err) {
                        res.status(404).json("error occure")
                    } else {
                        res.json({ doesExit, auth: token });
                    }
                })
            } else {
                res.status(404).json("Not Found")
            }
        } else if (req.body.username && req.body.password) {
            const doesExit = await User.findOne({ username: user.username })
            if (doesExit.password === user.password) {
                jwt.sign({ doesExit }, jwtkey, { expiresIn: "5000s" }, (err, token) => {
                    if (err) {
                        res.status(404).json("error occure")
                    } else {
                        res.json({ doesExit, auth: token });
                    }
                })
            } else {
                res.status(404).json("Not Found")
            }
        }
        else {
            res.status(404).json("please enter credentials")
        }
    } catch (error) {
        res.status(400).json(error);
    }
})

router.get("/search/:key", async (req, res) => {
    try {
        let result = await User.find({
            "$or": [
                { fullname: new RegExp(req.params.key, "i") },
                { mobile: new RegExp(req.params.key, "i") },
                { _id: new RegExp(req.params.key, "i") },
                { address: new RegExp(req.params.key, "i") },
            ]
        })
        res.json({ result });
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/sort",paginatedResult(User),async(req,res)=>{
    try {
        res.json(res.paginatedResult)
    } catch (error) {
        res.status(500).json(error)
    }
})

function paginatedResult(modal) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {}

        if (endIndex < await modal.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        } 
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        
        try {
            results.results = await modal.find().sort({fullname:1}).limit(limit).skip(startIndex).exec();
            res.paginatedResult = results;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}




module.exports = router;