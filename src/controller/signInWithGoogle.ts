
import axios from 'axios';
import { NextFunction, Request, Response } from 'express';


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const REDIRECT_URI = process.env.REDIRECT_URI_GOOGLE
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

export const signInGoogleController = async (req: Request, res: Response, next: NextFunction) => {
  console.log(REDIRECT_URI)
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
}

export const callbackGoogleController = async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    const { data } = await axios.post('<https://oauth2.googleapis.com/token>', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token, id_token } = data;

    // Use access_token or id_token to fetch user profile
    const { data: profile } = await axios.get('<https://www.googleapis.com/oauth2/v1/userinfo>', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // Code to handle user authentication and retrieval using the profile data
    res.redirect('/');
  } catch (error) {
    console.error('Error:', error);
    res.redirect('/login');
  }

}