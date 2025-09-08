import { google } from 'googleapis';
import stream from 'stream'; // Required to handle the image data

/**
 * Controller to handle Google Drive image uploads.
 * It receives an authorization code and image data from the frontend,
 * exchanges the code for an access token, and then uploads the image.
 */
export const uploadToDrive = async (req, res) => {
  try {
    // 1. Get necessary data from the request body
    const { code, imageData, imageName } = req.body;

    // Validate that required data is present
    if (!code || !imageData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Authorization code and image data are required.' 
      });
    }

    // 2. Configure the OAuth2 client with your app's credentials
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // 3. Exchange the authorization code for access and refresh tokens
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // 4. Initialize the Google Drive API client
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });

    // 5. Prepare the image for upload
    // Convert the base64 data URL into a Buffer
    const imageBuffer = Buffer.from(imageData.split(",")[1], 'base64');
    
    // Create a readable stream from the Buffer for the API
    const imageStream = new stream.PassThrough();
    imageStream.end(imageBuffer);

    // 6. Execute the file upload to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: imageName || `imagify-art-${Date.now()}.png`, 
        mimeType: 'image/png',
      },
      media: {
        mimeType: 'image/png',
        body: imageStream,
      },
      fields: 'id, name, webViewLink', // Specify fields to get in the API response
    });

    // 7. Send a success response back to the frontend
    res.status(200).json({
      success: true,
      message: 'Image uploaded to Google Drive successfully!',
      file: response.data,
    });

  } catch (error) {
    console.error('❌ Error uploading to Google Drive:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload image to Google Drive.' 
    });
  }
};