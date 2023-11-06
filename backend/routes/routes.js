const express = require("express");
const router = express.Router();

// const {Router} = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const Post = require('../models/post.model')
const hashedPassword = require("../config/hash");

// the post method which has the /register route to register the user
router.post('/register', async(req, res)=>{
    let name = req.body.name
    let email = req.body.email
    let password = req.body.password

    // password encryption by bcrypt with value *10
    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password, salt)
    // hashedPassword = hashedPassword(password)

    const record = await User.findOne({ email:email })

    if(record){
        return res.status(400).send({
            message: "Email is already exist"
        })
    }
    const user = new User({
        name:name,
        email:email,
        password:hashedPassword
    })

    const result = await user.save()

    // Initializing JWT; according to the calculations below, token will expire in 24 hours; 
    // JWT Token 
    const {_id} = await result.toJSON()
    const token = jwt.sign({_id:_id}, "secret")
    res.cookie("jwt", token,{
        httpOnly:true,
        maxAge:24*60*60*1000
    })

    res.send({
        message: "success"
    })

})

// the post method login '/login' 
router.post('/login', async(req, res)=>{
    // Search for the user in the database
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).send({
            message: "User not found"
        })
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(400).send({
            message: "Password is Incorrect"
        })
    }

    // If it properly connected, the token is generated
    const token = jwt.sign ({ _id:user._id}, "secret")

    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge:24*60*60*1000
    })

    res.send({
        message: "success"
    })
})

// The get '/user' method retrieves the connected user
router.get('/user', async(req, res) =>{
    try {
        const cookie = req.cookies["jwt"]
        const claims = jwt.verify(cookie, "secret")
        if (!claims) {
            return res.status(401).send({
                message: "Unauthenticated"
            })
        }
        const user = await User.findOne({_id:claims._id})
        const {password, ...data} = await user.toJSON()
        res.send(data)
    } catch (error) {
        return res.status(401).send({
            message: "Unauthenticated"
        })
    }
})
/**
 * the last logout post; destroys the token which contains
 * data of logged in user to log out; and sets the times to 0
 */
 
router.post('/logout', (req, res) => {
    res.cookie("jwt", "", {maxAge:0})

    res.send({
        message:"success"
    })
})

router.post('/addPost', async (req, res) =>{
    let title = req.body.title
    let description = req.body.description
    let author = req.body.author

    const record = await User.findOne({ email:author })

    if(!record){
        return res.status(404).send({
            message: "Email not found"
        })
    }

    try {
        const post = new Post ({
            title:title,
            description:description,
            author:author
        })
        const result = await post.save()

        // Initializing JWT; according to the calculations below the token will expire in 24 hours;
        // JWT Token 
        await result.toJSON()

        res.send({
            message: "succes"
        })
    } catch (error) {
        res.status(500).send('Server error')
    }
})
router.get('/getPosts', async (req, res) =>{
    const posts = await Post.find();
    res.status(200).json(posts)
})
router.delete('/deletePost/:id', async (req, res) =>{
    // const post = await User.findOne({ email:author })]
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if(!post){
            return res.status(404).send({
                message: "Post not found"
            })
        }
        res.status(200).json("Post deleted ")       
    } catch (error) {
        res.status(500).send('Error deleting post');
    }

})
module.exports = router