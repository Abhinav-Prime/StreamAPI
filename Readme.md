
YouTube Backend Clone
This is a YouTube backend clone built using Node.js, Express.js, MongoDB, and other modern web development technologies. The clone implements core features such as video uploads, video streaming, user authentication, comments, and likes, mimicking the functionality of the popular video-sharing platform.

Features
User Authentication: JWT-based authentication for users to sign up, log in, and manage their profiles.
Video Upload: Allows users to upload videos with title, description, and thumbnail.
Comments: Users can leave comments on videos, and the video owners can reply to those comments.
Likes/Dislikes: Like or dislike videos and comments.
Subscriptions: Subscribe to user channels and receive updates on new videos.
Recommendation System: Suggest videos to users based on their viewing history.
Technologies Used
Node.js: Server-side JavaScript runtime.
Express.js: Web framework for building APIs and server-side applications.
MongoDB: NoSQL database for data storage.
Mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js.
JWT (JSON Web Token): For user authentication.
Multer: Middleware for handling multipart/form-data, used for file uploads.
Cloudinary/AWS S3: For video storage (optional, can be set up locally).
Prerequisites
Node.js (v14.x or above)
MongoDB (Ensure MongoDB is running locally or provide a connection string)

1.Installation
Clone the repository:
git clone https://github.com/Abhinav-Prime/youtube-backend-clone.git
cd youtube-backend-clone

2.Install dependencies:
npm install

3.Set up environment variables:
Create a .env file in the root directory and add the following variables:s
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name> # Optional for video storage
CLOUDINARY_API_KEY=<cloudinary-api-key>       # Optional
CLOUDINARY_API_SECRET=<cloudinary-api-secret> # Optional

4.Start the server
npm start

* Contributing
Pull requests are welcome! Please make sure to follow the contribution guidelines.



