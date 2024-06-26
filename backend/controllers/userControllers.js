// This file is for Handeling the user Login and Registration 

const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

// /api/user
// This function is used in the userRoutes.js file to register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // For the user to be registered, the name, email and password must be provided
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill in all fields');
    }

    // We are Checking if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // If the user does not exist, we create a new user
    const user = await User.create({
        name,
        email,
        password
    });

    // If the user is created, we send the user data and a token
    if (user) {
        res.status(201);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');  // Gracefully handeling the error if the user is not created
    }
}
);


// This function is used in the userRoutes.js file to authenticate a user
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// /api/user?search=   


/* const allUsers = asyncHandler(async (req, res) => {
    const search = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
        ]
    } : {};
    const users = await User.find(search)
        .find(
            {
                _id: { $ne: req.user._id }
            }
        )
    // Send back a JSON response with the users
    res.json(users);
}); */
const allUsers = asyncHandler(async (req, res) => {
    const { search } = req.query;
    const query = {};

    // If there's a search query, add it to the query object
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
        ];
    }

    // Exclude the logged-in user from the search results
    query._id = { $ne: req.user._id };

    // Fetch users based on the constructed query
    const users = await User.find(query);

    // Send back a JSON response with the users
    console.log(users);
    console.log(typeof(users));

    res.json(users);
});
module.exports = { registerUser, authUser, allUsers };

/* 
Use of express-async-handler package:

--> With express-async-handler

const asyncHandler = require('express-async-handler')

express.get('/', asyncHandler(async (req, res, next) => {
    const bar = await foo.findAll();
    res.send(bar) // res.send sends a response in the form of a JSON object
})); 

--> Without express-async-handler

express.get('/',(req, res, next) => {
    foo.findAll()
    .then ( bar => {
       res.send(bar)
     } )
    .catch(next); // error passed on to the error handling route
})

*/