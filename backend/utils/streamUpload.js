import cloudinary from '../config/cloudinaryConfig.js';

const streamUpload = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,  // Dynamically set folder based on usage
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error(`Cloudinary upload error for folder ${folder}:`, error);
          reject(error);
        } else {
          console.log(`Cloudinary upload result for folder ${folder}:`, result);
          resolve(result);
        }
      }
    );
    stream.end(fileBuffer); // Send the buffer into the stream
  });
};

export default streamUpload;
