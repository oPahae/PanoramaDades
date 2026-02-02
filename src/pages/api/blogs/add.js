import pool from '../_connect.js';
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
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = formidable({
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    try {
      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
      const quote = Array.isArray(fields.quote) ? fields.quote[0] : fields.quote;
      const paragraphsStr = Array.isArray(fields.paragraphs) ? fields.paragraphs[0] : fields.paragraphs;
      const paragraphs = JSON.parse(paragraphsStr);

      if (!title || !category || !quote || !paragraphs || paragraphs.length === 0) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const imageFile = files.image;
      if (!imageFile) {
        return res.status(400).json({ message: 'Blog image is required' });
      }

      const uploadedFile = Array.isArray(imageFile) ? imageFile[0] : imageFile;
      const originalFilename = uploadedFile.originalFilename || uploadedFile.newFilename;
      const fileExtension = path.extname(originalFilename);

      const connection = await pool.getConnection();

      const [result] = await connection.query(
        'INSERT INTO Blogs (title, category, quote) VALUES (?, ?, ?)',
        [title, category, quote]
      );

      const blogId = result.insertId;
      const imagePath = `/blogs/${blogId}${fileExtension}`;
      const publicImagePath = path.join(process.cwd(), 'public', 'blogs', `${blogId}${fileExtension}`);
      const blogsDir = path.join(process.cwd(), 'public', 'blogs');
      if (!fs.existsSync(blogsDir)) {
        fs.mkdirSync(blogsDir, { recursive: true });
      }
      fs.copyFileSync(uploadedFile.filepath, publicImagePath);
      fs.unlinkSync(uploadedFile.filepath);
      
      await connection.query(
        'UPDATE Blogs SET image = ? WHERE id = ?',
        [imagePath, blogId]
      );

      for (const paragraph of paragraphs) {
        await connection.query(
          'INSERT INTO Paragraphes (title, content, blogID) VALUES (?, ?, ?)',
          [paragraph.title, paragraph.content, blogId]
        );
      }

      connection.release();

      return res.status(201).json({
        message: 'Blog created successfully',
        blogId: blogId,
        imagePath: imagePath
      });

    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
}