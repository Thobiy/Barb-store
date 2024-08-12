
const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const uuid = require("uuid");


const sessions = {};

async function httpLogin(req, res) {

    try {
        const { email, password } = req.body;
    

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

async function httpLogout(req, res) {
    res.clearCookie('auth_cok');
    res.send('Logged out successfully');
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

module.exports = {
    httpLogin,
    httpProtected,
    httpLogout,

};