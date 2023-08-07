import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { user } from "./database/schema.js";
import database from "./database/mongodb.js";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import { playlist } from "./database/schema.js";
import jwt from "jsonwebtoken";
import authenticateToken from "./auth/auth.js";
import cors from 'cors';


const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());




app.listen(process.env.PORT || 5000, async () => {
  console.log(`listening on PORT`);
  await database();
});

app.get("/", async(req, res) => {
  await database();
  const foundUser = await user.findOne({ username:"sooraj__mehta2" });
console.log("foundu ",foundUser);
 res.json(foundUser);
});

app.post("/login", async (req, res) => {
  try {
    const foundUser = await user.findOne({ username: req.body.username });
    if (foundUser) {
      try {
        const isPasswordMatch = await bcrypt.compare(
          req.body.password,
          foundUser.password
        );

        if (isPasswordMatch) {
          const token = jwt.sign(
            { username: foundUser.username },
            "your_secret_key_here", // Change this to a strong secret key
            { expiresIn: "1h" } // Token expiration time
          );

          res
            .status(200)
            .json({
              status: 200,
              username: foundUser.username,
              email: foundUser.email,
              success: true,
              message: "Login successful!",
              token:token,
            });
        } else {
          res
            .status(401)
            .json({
              status: 401,
              success: false,
              message: "Invalid password.",
            });
        }
      } catch (error) {
        res
          .status(401)
          .json({ status: 401, success: false, message: "Invalid password." });
      }
    } else {
      res
        .status(404)
        .json({ status: 404, success: false, message: "User not found." });
    }
  } catch (err) {
    console.error("User not found", err);
    res
      .status(404)
      .json({ status: 404, success: false, message: "User not found." });
  }
});

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const resp = await user.findOne({ username: req.body.username });

  if (resp) {
    return res
      .status(409)
      .json({
        status: 409,
        success: false,
        message: "Username already exists.",
      });
  }


  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const data = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };
    const newuser = new user(data);
    const response = await newuser.save();
    console.log("got :: " + response);
    return res.status(200).json({ status: 200 });
  } catch (err) {
    console.log(err);
    return { status: 500 };
  }
});




app.post('/playlist',authenticateToken, async (req,res)=>{

  console.log("auto hoga");
  
 try{
  const newPlaylist = new playlist(req.body);
  const resp=await newPlaylist.save();
  return res
  .status(200)
  .json({
    id:resp._id,
    status: 200,
    success: true,
    message: "movie saved successfully",
  });

 }
 catch(err){
  console.log(err);
  return err;

 }
  



});

app.put('/playlist',authenticateToken, async (req, res) => {
  
 console.log(req.body);
  try {
    // Find the playlist based on name and username
    const existingPlaylist = await playlist.findOne({ name:req.body.playlist, username: req.body.username });

    if (!existingPlaylist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check if the movie already exists in the playlist
    const movieExists = existingPlaylist.movies.some(movie => movie.name.toString() === req.body.movie);

    if (movieExists) {
      return res.status(400).json({ message: 'Movie already exists in the playlist' });
    }

    // Add the new movie to the playlist's movies array
    existingPlaylist.movies.push({ name:req.body.movie,poster:req.body.poster });

    // Save the updated playlist
    await existingPlaylist.save();

    return res.status(200).json({ message: 'Movie added to playlist successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/playlists/:username',authenticateToken, async (req, res) => {
  console.log("request aai");
  const username = req.params.username;
  console.log(username);
  try {
    // Find all playlists of the specified user
    const playlists = await playlist.find({ username: username });
  console.log(playlists)
    return res.status(200).json(playlists);
  } catch (error) {
    console.error(error);
    return res.json({ });
  }
});
app.get('/public/playlists',authenticateToken, async (req, res) => {
  
  try {
    // Find all public playlists
    const publicPlaylists = await playlist.find({ isPublic: true });

    return res.status(200).json(publicPlaylists);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/playlist/:playlistname',authenticateToken, async (req, res) => {
  const playlistname = req.params.playlistname;

  try {
      // Find the playlist by name
      const data = await playlist.findOne({ name: playlistname });

      if (!data) {
          return res.status(404).json({ message: 'Playlist not found' });
      }

      return res.status(200).json(data.movies);
  } catch (error) {
      console.error('Error fetching playlist:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});


