import pool from '../_connect';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  let insertedRoomId = null;
  let roomDirectory = null;

  try {
    // Parse form data
    const form = formidable({
      multiples: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Extract form data
    const roomData = {
      title: fields.title?.[0] || fields.title,
      category: fields.category?.[0] || fields.category,
      description: fields.description?.[0] || fields.description,
      priceUSD: parseInt(fields.priceUSD?.[0] || fields.priceUSD),
      priceCHF: parseInt(fields.priceCHF?.[0] || fields.priceCHF),
      beds: parseInt(fields.beds?.[0] || fields.beds),
      guests: parseInt(fields.guests?.[0] || fields.guests),
      view: fields.view?.[0] || fields.view,
      space: parseInt(fields.space?.[0] || fields.space),
      status: fields.status?.[0] || fields.status || 'available',
      wifi: fields.wifi?.[0] === 'true' || fields.wifi === true,
      safe: fields.safe?.[0] === 'true' || fields.safe === true,
      rainShower: fields.rainShower?.[0] === 'true' || fields.rainShower === true,
      airConditioning: fields.airConditioning?.[0] === 'true' || fields.airConditioning === true,
      heater: fields.heater?.[0] === 'true' || fields.heater === true,
      hairDryer: fields.hairDryer?.[0] === 'true' || fields.hairDryer === true,
    };

    // Validate required fields
    if (!roomData.title || !roomData.category || !roomData.description || 
        !roomData.priceUSD || !roomData.priceCHF || !roomData.beds || 
        !roomData.guests || !roomData.view || !roomData.space) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Insert room into database (without image path yet)
    const [result] = await pool.query(
      `INSERT INTO Rooms (
        title, category, description, priceUSD, priceCHF, 
        beds, guests, view, space, status,
        wifi, safe, rainShower, airConditioning, heater, hairDryer
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        roomData.title,
        roomData.category,
        roomData.description,
        roomData.priceUSD,
        roomData.priceCHF,
        roomData.beds,
        roomData.guests,
        roomData.view,
        roomData.space,
        roomData.status,
        roomData.wifi,
        roomData.safe,
        roomData.rainShower,
        roomData.airConditioning,
        roomData.heater,
        roomData.hairDryer,
      ]
    );

    insertedRoomId = result.insertId;

    // Create directory for room images: /public/rooms/{roomId}/
    const publicDir = path.join(process.cwd(), 'public');
    roomDirectory = path.join(publicDir, 'rooms', insertedRoomId.toString());
    
    if (!fs.existsSync(roomDirectory)) {
      fs.mkdirSync(roomDirectory, { recursive: true });
    }

    // Handle main image
    const mainImage = files.mainImage?.[0] || files.mainImage;
    let mainImagePath = null;

    if (mainImage) {
      const mainImageExt = path.extname(mainImage.originalFilename || mainImage.newFilename);
      const mainImageName = `main${mainImageExt}`;
      const mainImageDestination = path.join(roomDirectory, mainImageName);
      
      // Copy main image to destination
      fs.copyFileSync(mainImage.filepath, mainImageDestination);
      
      // Store relative path for database: /rooms/{roomId}/main.{ext}
      mainImagePath = `/rooms/${insertedRoomId}/${mainImageName}`;

      // Update room with main image path
      await pool.query(
        'UPDATE Rooms SET image = ? WHERE id = ?',
        [mainImagePath, insertedRoomId]
      );
    }

    // Handle additional images
    const additionalImages = files.additionalImages;
    const imageUrls = [];

    if (additionalImages) {
      const imagesArray = Array.isArray(additionalImages) ? additionalImages : [additionalImages];
      
      for (let i = 0; i < imagesArray.length; i++) {
        const image = imagesArray[i];
        const imageExt = path.extname(image.originalFilename || image.newFilename);
        const imageName = `${i + 1}${imageExt}`; // Start from 1
        const imageDestination = path.join(roomDirectory, imageName);
        
        // Copy image to destination
        fs.copyFileSync(image.filepath, imageDestination);
        
        // Store relative path: /rooms/{roomId}/{number}.{ext}
        const imageUrl = `/rooms/${insertedRoomId}/${imageName}`;
        imageUrls.push(imageUrl);
      }

      // Insert image URLs into Images table
      if (imageUrls.length > 0) {
        const imageValues = imageUrls.map(url => [url, insertedRoomId]);
        await pool.query(
          'INSERT INTO Images (url, roomID) VALUES ?',
          [imageValues]
        );
      }
    }

    // Clean up temporary files
    if (mainImage) {
      fs.unlinkSync(mainImage.filepath);
    }
    if (additionalImages) {
      const imagesArray = Array.isArray(additionalImages) ? additionalImages : [additionalImages];
      imagesArray.forEach(image => {
        if (fs.existsSync(image.filepath)) {
          fs.unlinkSync(image.filepath);
        }
      });
    }

    res.status(201).json({
      message: 'Room added successfully',
      roomId: insertedRoomId,
      mainImage: mainImagePath,
      additionalImages: imageUrls,
    });

  } catch (error) {
    console.error('Error adding room:', error);

    // Rollback: Delete the room if it was created
    if (insertedRoomId) {
      try {
        await pool.query('DELETE FROM Rooms WHERE id = ?', [insertedRoomId]);
      } catch (deleteError) {
        console.error('Error during rollback:', deleteError);
      }
    }

    // Rollback: Delete the room directory if it was created
    if (roomDirectory && fs.existsSync(roomDirectory)) {
      try {
        fs.rmSync(roomDirectory, { recursive: true, force: true });
      } catch (dirError) {
        console.error('Error deleting directory:', dirError);
      }
    }

    res.status(500).json({ 
      message: 'Failed to add room',
      error: error.message 
    });
  }
}