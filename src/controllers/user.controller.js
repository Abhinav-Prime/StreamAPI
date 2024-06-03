import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cludinary.js'
import { ApiResponse } from "../utils/Apiresponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens=async(userId)=>
{
  try{
   const  user= await User.findById(userId)
   const accessToken=user.generateAccessToken()
   const refreshToken=user.generateRefreshToken()
  user.refreshToken=refreshToken
  await user.save({validateBeforeSave:false})
  return {accessToken,refreshToken}

  }
  catch(error)
  {
    throw new ApiError(500,"something went wrong while generating access and refresh tokens")
  }
}


const registerUser = asyncHandler(async (req, res) =>{
   
  //get user details from frontend
  //validation-not empty
  //check if user already exists
  //check for images ,avatar
  //upload them to cloudinary,avatar
  //create user object-create entry in db
  //remove password and refresh token field
  //check for user creation
  //retunr res
  const {fullName,email,username,password}=req.body
 
  // if(fullName==="")
  //   throw new ApiError(400,"fullname is required")
  if([fullName,email,username,password].some((field)=>field?.trim()===""))
    {
      throw new ApiError(400,"All fields are required")
    }
   const existedUSer= await User.findOne({
      $or:[{username},{email}]
    })
    if(existedUSer)
      {
        throw new ApiError(409,"user with email or username alreay exists")
      }
      
     const avatarLocalPath= req.files?.avatar[0]?.path;
   
       const coverImageLocalPath= req.files?.coverImage[0]?.path;

     if(!avatarLocalPath)
      {
        throw new ApiError(400,"avatar file is required")
      }

      const avatar =await uploadOnCloudinary(avatarLocalPath)
        const coverImage=await uploadOnCloudinary(coverImageLocalPath)

      if(!avatar)
        {
          throw new ApiError(400,"avatar file is required")
        }
       const user=await User.create({
          fullName,
          avatar:avatar?.url,
           coverImage:coverImage?.url,
          email,
          password,
          username:username.toLowerCase()

        })

       const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
       )
       if(!createdUser)
        {
          throw new ApiError(500,"something went wrong wile registering the user")
        }

return res.status(201).json(
  new ApiResponse(200,createdUser,"User registered succesfully")
)

});

const loginUser=asyncHandler(async (req,res)=>{
  //req body =>data
  //username or email
  //find the usser
  //password check
  //access and refresh token
  //send cookie
  const {email,username,password}=req.body
  if(!username && !email)
    {
      throw new ApiError(400,"username or email is required")
    }
   const user=await User.findOne({
      $or:[{username},{email}]
    })
    if(!user)
      {
        throw new ApiError(404,"User does not exist");
      }
      const isPasswordValid=await user.isPasswordCorrect(password)
      if(!isPasswordValid)
        {
          throw new ApiError(401,"Invalid password");
        }
//now making access refresh token
  const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)
  const loggedInUser =await User.findById(user._id).select("-password -refreshToken")
  const options={
    httpOnly:true,
    secure:true
  }
  return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(200,{
      user:loggedInUser,accessToken,refreshToken
    },"user logged in successfully")
  )
}
)

  
  const logoutUser=asyncHandler(async(req,res)=>
{
User.findByIdAndUpdate(
  req.user._id,
  {
    $set:{
      refreshToken:undefined
    }
  },{
    new:true
  }
)
const options={
  httpOnly:true,
  secure:true
}
return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"User logged out"))
})

//endpoint for refresh token
const refreshAccessToken=asyncHandler(async(req,res)=>
{
const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
if(!incomingRefreshToken){
  throw new ApiError(401,"unauthorized request")
}
try {
  const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  const user=await User.findById(decodedToken?._id)
  if(!user){
    throw new ApiError(401,"invalid refresh token")}
    if(incomingRefreshToken!==user?.refreshToken)
      {
        throw new ApiError(401,"request token is expired or used already")
      }
      const options={
        httpOnly:true,
        secure:true
      }
     const {accessToken,newrefreshToken}= await generateAccessAndRefreshTokens(user._id)
      return res.
      status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",newrefreshToken).json(
        new ApiResponse(200,
          {accessToken,refreshToken:newrefreshToken},
          "access Token Refreshed"
        )
      )
  
} catch (error) {
  throw new ApiError(401,
  "Invalid token"
  )
}
})

export { registerUser,loginUser ,logoutUser,refreshAccessToken};
