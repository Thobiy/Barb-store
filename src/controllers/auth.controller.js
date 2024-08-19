
const bcrypt = require("bcrypt");

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
        console.log('Setting cookie:', sessionToken);

        // Store session data (e.g., in an in-memory object or a database)
        sessions[sessionToken] = {
            userId: user._id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1-day expiry
        };

        // Set the session token in an HTTP-only cookie
        res.cookie('auth_cok', sessionToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: '/',
        });

        console.log('cookie set:', sessionToken);
        console.log('Set-Cookie Header:', res.getHeader('Set-Cookie'));

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
    const sessionToken = req.cookies["auth_cok"];

    if (!sessionToken) {
        return res.status(200).json({authenticated: false });

    }
    

    const currentSession = sessions[sessionToken];

    if(!currentSession  || currentSession.expiresAt < new Date()) {
        return res.status(200).json({authenticated: false });

    }
    return res.status(200).json({ authenticated: true });
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
    
      


module.exports = {
    httpLogin,
    httpProtected,
    httpAuthStatus,
    httpTest

};