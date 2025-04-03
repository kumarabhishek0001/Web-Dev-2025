import User from "../model/user.model.js"
import crypto from 'crypto' 
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const registerUser = async (req, res) => {
    //getting data from the browser
   const {name, email, password} = req.body

   //checking if all fields are use
   if(!name || !email|| !password){
    return res.status(400).json({
        message : "All feilds are required"
    })
   }
   
   try {
    const existingUser = await User.findOne({email})
    
    //checking if user exist in database already
    if (existingUser) {
        return res.status(400).json({
            message: "user already exists"
        })
    }
    
    //creating user in the database
    const user = await User.create({
        name,
        email,
        password
    })
    console.log(user)

    //checking if something went wrong with user
    if(!user){
        return res.status(400).json({
            message: "User not registerd"
        })
    }
    //validation token genration 
    const token = crypto.randomBytes(32).toString("hex")
    console.log(token);

    //saving validation token in database
    user.verificationToken = token;
    await user.save()


    //send email
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });
    
    const mailOptions = {
        from: process.env.MAILTRAP_SENDERMAIL , // sender address
        to: user.email, // list of receivers
        subject: "Verfication of User", // Subject line
        text: `please paste the link in your browser
        ${process.env.BASE_URL}/api/v1/user/verify${token}`,
    }

    await transporter.sendMail(mailOptions)


    res.status(201).json({
        message : "user registered successfully",
        success : true
    })




   } catch (error) {
    res.status(400).json({
        
        message : "user not registered",
        error,
        success : false,

    })
   }
}

//verify the user
const verifyUser = async (req,res) => {
    
    //get token from url
    const {token} = req.params; //get token from url
    console.log(token)

    //validating token
    if(!token){
        return res.status(400).json({
            message: "Invalid token",
        })
    }
    
    //finding usr in db
    //user here is particulalr user in the whole collection of "User"
    const user =  await User.findOne({verificationToken : token})

    //usesr not found
    if(!user){
        return res.status(400).json({
            message: "Invalid token",
        })
    }

    //setting isVerified to true
    user.isVarified = true;
    user.verificationToken = undefined;
    await user.save()
    //if we have otp then we can take otp from req.body
}

//user login 
const login = async (req, res) => {
    //get data
    const {email, password} = req.body

    //vallidate input
    if(!email || !password){
        return res.status(400).json({
            message : 'all feilds are reqired'
        })
    }

    try {
        //find the email
        const user = await User.findOne({email})

        //if email not present 
        if(!user){
            return res.status(400).json({
                message : 'invalid email or password'
            })
        }

        //hashing the password ince we have stored a hashed password
        const isMatch = bcrypt.compare(password, user.password)
        console.log(isMatch)

        // if no match found
        if(!isMatch){
            return res.status(400).json({
                message : 'invalid email or password'
            });
        }
        //is user verified
        if(!user.isVarified){
            return res.status(400).json({
                message : 'please verify email'
            })
        }

        // genrating jwt token for stateless login
        const token = jwt.sign({id: user._id},
            'shhhhh',{
                expiresIn : '24h'
            }
        )
        //options for cookie
        const cookieOptions = {
            httpOnly: true,// controll goes to the backend and normal user don't have controll over it 
            secure: true,
            maxage: 24*60*60*1000,

        }

        // this is key("token"), value(token) pair with options 
        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            success : true,
            message: "Login successfull",
            user:{
                id: user._id,
                name: user.name,
                role: user.role,
            },
            token,
        })






    } catch (error) {
        
    }

}

export {registerUser, verifyUser, login}