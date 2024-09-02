
const bcrypt = require("bcrypt");
const Session = require('../models/session.model');
const User = require("../models/user.model");
const uuid = require("uuid");


const sessions = {};


async function httpLogin(req, res) {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // If the user is not found, return an error
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // If the password is incorrect, return an error
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // If the credentials are valid, create a session token
        const sessionToken = uuid.v4();

        // Store the session data in the database
        await Session.create({
            token: sessionToken,
            userId: user._id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1-day expiry
        });

        // Set the session token in an HTTP-only cookie
        res.cookie('auth_cok', sessionToken, {
            httpOnly: true,
            secure: false, // Set to true if you're using HTTPS
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: '/',
        });

        console.log('Cookie set:', sessionToken);

        // Respond with a success message
        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

   


/* initial approach to route login

// async function httpLogin(req, res) {



    try {
 //       const { email, password } = req.body;
    

        //find user by email

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });


//valid password
const isMatch = await bcrypt.compare(password, user.password);
if (isMatch)
    return res.status(401).json({message: "Invalid email or password" });

}


    

// create JWT payload

const sessionToken = uuid.v4();
    const expiresAt = new Date().setFullYear(new Date().getFullYear() +1 )

       //store session into db or state

       sessions[sessionToken] = {
        expiresAt,
        userId: user._id
       };

       res.cookie("auth_cok", sessionToken, {maxAge: expiresAt});

       res.status(200).json({ message: "Welcome" });
        //generate JWT
        //const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          //  expiresIn: "1h",
        //});

        //Respond with JWT
        //res.json({ accessToken });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
    
}

*/

async function httpAuthStatus(req, res) {
    const sessionToken = req.query.token || req.cookies['auth_cok'];

    // Check if the session token exists and has not expired
    if (sessionToken && sessions[sessionToken] && sessions[sessionToken].expiresAt > new Date()) {
        console.log('Authenticated user with session token:', sessionToken);
    
        // Refresh the session cookie by resetting it with the same token
        res.cookie('auth_cok', sessionToken, {
            httpOnly: true,
            secure: false,  // Set to true if using HTTPS
            sameSite: 'Lax',  // Adjust this as per your security needs
            maxAge: 24 * 60 * 60 * 1000,  // 1 day
            path: '/',
        });
    
        return res.status(200).json({ authenticated: true });
    } else {
        if (!sessionToken) {
            console.log('No session token provided.');
        } else if (!sessions[sessionToken]) {
            console.log('Invalid or expired session token:', sessionToken);
        } else {
            console.log('Session token has expired:', sessionToken);
        }
    
        return res.status(200).json({ authenticated: false });
    }
}    


async function httpProtected(req, res){

    const sessionToken = req.cookies["auth_cok"];

    if (!sessionToken) {
        return res.status(401).json({message: "Unauthorized" });

    }
    const currentSession = sessions[sessionToken];

    if (!currentSession) {
       return res.status(401).json({message: "Unuthorized" });
    }

    console.log(currentSession?.expiresAt, new Date()); 
    if (currentSession?.expiresAt < new Date()) {

      return res.status(401).json({message: "Token expired" });
    }


    res.status(200).json({ message: "Access granted" });
    
}

async function httpTest(req, res){
    const sessionToken = uuid.v4();
    
        res.cookie('auth_cok', sessionToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: '/',
        });
        res.send('cookie set');

        
      };


async function httpAddToCart(req, res) {
    const { productId, name, price } = req.body;

    // Initialize the cart if it doesn't exist
    if (!req.session.cart) {
        req.session.cart = [];
    }

   
    const existingProduct = req.session.cart.find(item => item.productId === productId);

    if (existingProduct) {
        // If the product is already in the cart, increment the quantity
        existingProduct.quantity += 1;
    } else {
        // If the product is not in the cart, add it
        req.session.cart.push({
            productId,
            name,
            price,
            quantity: 1,
        });
    }

    res.status(200).json({ cartItemCount: req.session.cart.length });
}

// Fetching the cart details
async function httpGetCart(req, res) {
    const cart = req.session.cart || [];
    res.status(200).json(cart);
}



// Create a new product
async function httpCreateProduct(req, res) {
    try {
        const { name, price, description, imageUrl, stock } = req.body;
        const newProduct = new Product({ name, price, description, imageUrl, stock });
        await newProduct.save();

        res.status(201).json({ message: 'Product created', product: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Get all products
async function httpGetProducts(req, res) {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

    
    
    
    
      


module.exports = {
    httpLogin,
    httpProtected,
    httpAuthStatus,
    httpTest,
    httpAddToCart,
    httpCreateProduct,
    httpGetProducts


};