import pool from '../_connect.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Blog ID is required' });
  }

  try {
    const connection = await pool.getConnection();

    const [blogRows] = await connection.query(
      'SELECT * FROM Blogs WHERE id = ?',
      [id]
    );

    if (blogRows.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Blog not found' });
    }

    const blog = blogRows[0];

    const [paragraphes] = await connection.query(
      'SELECT title, content FROM Paragraphes WHERE blogID = ? ORDER BY id',
      [id]
    );

    connection.release();

    const formattedBlog = {
      id: blog.id,
      image: blog.image,
      title: blog.title,
      paragraphes: paragraphes,
      quote: blog.quote,
      datePosted: formatDate(blog.datePosted),
      category: blog.category,
    };

    return res.status(200).json(formattedBlog);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

function formatDate(datePosted) {
  const date = new Date(datePosted);
  const options = { month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}