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
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const form = formidable({
      multiples: true,
      maxFileSize: 10 * 1024 * 1024,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const roomId = fields.id?.[0] || fields.id;
    if (!roomId) {
      return res.status(400).json({ message: 'Room ID is required' });
    }

    const [existingRooms] = await pool.query('SELECT * FROM Rooms WHERE id = ?', [roomId]);
    if (existingRooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const existingRoom = existingRooms[0];

    const getFieldValue = (field) => {
      if (Array.isArray(field)) return field[0];
      return field;
    };
    const getBooleanValue = (field, defaultValue = true) => {
      const value = getFieldValue(field);
      if (value === undefined || value === null) return defaultValue;
      return value === 'true' || value === true || value == 1;
    };

    const roomData = {
      title: getFieldValue(fields.title),
      category: getFieldValue(fields.category),
      description: getFieldValue(fields.description),
      priceMAD: parseInt(getFieldValue(fields.priceMAD)),
      priceUSD: parseInt(getFieldValue(fields.priceUSD)),
      priceCHF: parseInt(getFieldValue(fields.priceCHF)),
      beds: parseInt(getFieldValue(fields.beds)),
      guests: parseInt(getFieldValue(fields.guests)),
      view: getFieldValue(fields.view),
      space: parseInt(getFieldValue(fields.space)),
      status: getFieldValue(fields.status) || 'available',
      wifi: getBooleanValue(fields.wifi, existingRoom.wifi),
      safe: getBooleanValue(fields.safe, existingRoom.safe),
      rainShower: getBooleanValue(fields.rainShower, existingRoom.rainShower),
      airConditioning: getBooleanValue(fields.airConditioning, existingRoom.airConditioning),
      heater: getBooleanValue(fields.heater, existingRoom.heater),
      hairDryer: getBooleanValue(fields.hairDryer, existingRoom.hairDryer),
    };

    if (!roomData.title || !roomData.category || !roomData.description || 
        !roomData.priceMAD || !roomData.priceUSD || !roomData.priceCHF ||
        !roomData.beds || !roomData.guests || !roomData.view || !roomData.space) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const publicDir = path.join(process.cwd(), 'public');
    const roomDirectory = path.join(publicDir, 'rooms', roomId.toString());
    if (!fs.existsSync(roomDirectory)) {
      fs.mkdirSync(roomDirectory, { recursive: true });
    }

    let mainImagePath = existingRoom.image;
    const keepMainImage = getFieldValue(fields.keepMainImage) === 'true';
    const mainImage = files.mainImage?.[0] || files.mainImage;
    if (mainImage) {
      if (existingRoom.image) {
        const oldMainImagePath = path.join(publicDir, existingRoom.image);
        if (fs.existsSync(oldMainImagePath)) {
          fs.unlinkSync(oldMainImagePath);
        }
      }
      const mainImageExt = path.extname(mainImage.originalFilename || mainImage.newFilename);
      const mainImageName = `main${mainImageExt}`;
      const mainImageDestination = path.join(roomDirectory, mainImageName);
      fs.copyFileSync(mainImage.filepath, mainImageDestination);
      mainImagePath = `/rooms/${roomId}/${mainImageName}`;

      fs.unlinkSync(mainImage.filepath);
    } else if (!keepMainImage) {
      if (existingRoom.image) {
        const oldMainImagePath = path.join(publicDir, existingRoom.image);
        if (fs.existsSync(oldMainImagePath)) {
          fs.unlinkSync(oldMainImagePath);
        }
      }
      mainImagePath = null;
    }

    const imagesToDeleteStr = getFieldValue(fields.imagesToDelete) || '[]';
    const imagesToDelete = JSON.parse(imagesToDeleteStr);
    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach(imageUrl => {
        const imagePath = path.join(publicDir, imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
      await pool.query('DELETE FROM Images WHERE url IN (?) AND roomID = ?', [imagesToDelete, roomId]);
    }

    const additionalImages = files.additionalImages;
    const newImageUrls = [];
    if (additionalImages) {
      const imagesArray = Array.isArray(additionalImages) ? additionalImages : [additionalImages];
      const [existingImages] = await pool.query(
        'SELECT url FROM Images WHERE roomID = ? ORDER BY id DESC',
        [roomId]
      );
      let maxNumber = 0;
      existingImages.forEach(img => {
        const filename = path.basename(img.url, path.extname(img.url));
        const num = parseInt(filename);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      });
      for (let i = 0; i < imagesArray.length; i++) {
        const image = imagesArray[i];
        const imageNumber = maxNumber + i + 1;
        const imageExt = path.extname(image.originalFilename || image.newFilename);
        const imageName = `${imageNumber}${imageExt}`;
        const imageDestination = path.join(roomDirectory, imageName);
        fs.copyFileSync(image.filepath, imageDestination);
        const imageUrl = `/rooms/${roomId}/${imageName}`;
        newImageUrls.push(imageUrl);
        fs.unlinkSync(image.filepath);
      }
      if (newImageUrls.length > 0) {
        const imageValues = newImageUrls.map(url => [url, roomId]);
        await pool.query(
          'INSERT INTO Images (url, roomID) VALUES ?',
          [imageValues]
        );
      }
    }

    await pool.query(
      `UPDATE Rooms SET 
        title = ?,
        category = ?,
        description = ?,
        priceMAD = ?,
        priceUSD = ?,
        priceCHF = ?,
        beds = ?,
        guests = ?,
        view = ?,
        space = ?,
        status = ?,
        image = ?,
        wifi = ?,
        safe = ?,
        rainShower = ?,
        airConditioning = ?,
        heater = ?,
        hairDryer = ?
      WHERE id = ?`,
      [
        roomData.title,
        roomData.category,
        roomData.description,
        roomData.priceMAD,
        roomData.priceUSD,
        roomData.priceCHF,
        roomData.beds,
        roomData.guests,
        roomData.view,
        roomData.space,
        roomData.status,
        mainImagePath,
        roomData.wifi,
        roomData.safe,
        roomData.rainShower,
        roomData.airConditioning,
        roomData.heater,
        roomData.hairDryer,
        roomId,
      ]
    );

    res.status(200).json({
      message: 'Room updated successfully',
      roomId: roomId,
      mainImage: mainImagePath,
      newImages: newImageUrls,
      deletedImages: imagesToDelete.length,
    });

  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ 
      message: 'Failed to update room',
      error: error.message 
    });
  }
}