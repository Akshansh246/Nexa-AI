import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

export async function registerController(req, res) {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ email }, { username }],
    });

    if (isUserAlreadyExists) {
        return res.status(400).json({
        message: "User with this email or username already exists",
        success: false,
        err: "User already exists",
        });
    }

    const user = await userModel.create({
        username,
        email,
        password,
    });

    const emailVerificationToken = jwt.sign(
        {
        email: user.email,
        },
        process.env.JWT_SECRET,
    );

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity AI",
        html: `
                <h2>Hi ${username}!</h2>
                <p>Thankyou for registering at <b>Perplexity AI</b><br>We're excited to have you onboard!</p>
                <p>Please click on the link below to verify your email:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>Best Regards,<br>~Team Perplexity.</p>
            `,
    });

    res.status(201).json({
        message: "User registered Successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    });
}

export async function loginController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({email:email})

    if(!user){
        return res.status(400).json({
            message:"invalid email or password",
            success:false,
            err:"User not found"
        })
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return res.status(400).json({
            message:"invalid email or password",
            success:false,
            err:"Incorrect Password"
        })
    }

    if(!user.verified){
        return res.status(400).json({
            message:"Please verify your email before logging in.",
            success:false,
            err:"Email not verified"
        })
    }

    const token = jwt.sign({
        id:user._id,
        email:user.email
    },process.env.JWT_SECRET,
        {expiresIn:'7d'}
    )

    res.cookie('token', token)

    res.status(200).json({
        message:"Login Successfull",
        success:true,
        user:{
            id:user._id,
            email:user.email,
            username:user.username
        }
    })
}

export async function getMeController(req, res) {
    const userId = req.user.id
    const user = await userModel.findById(userId).select('-password')

    if(!user){
        return res.status(404).json({
            message:"User not found",
            success:false,
            err:"User not Found"
        })
    }

    res.status(200).json({
        message:"User details fetched Successfully",
        success:true,
        user
    })
}

export async function verifyEmailController(req, res) {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
        return res.status(400).json({
            message: "Invalid Token",
            success: false,
            err: "User not Found.",
        });
        }

        user.verified = true;

        await user.save();

        const html = `
                <h1>Email Verified Successfully</h1>
                <p>Your email has been verified. You can now log in to your account</p>
            `;

        return res.send(html);

    } catch (err) {
        return res.status(400).json({
            message: "Invalid or token expired",
            success: false,
            err: err,
        });
    }
}
