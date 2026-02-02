import pool from '../_connect.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const connection = await pool.getConnection();

    const [blogs] = await connection.query(`
      SELECT 
        b.id,
        b.image,
        b.title,
        b.quote,
        b.category,
        b.datePosted,
        COUNT(p.id) as paragraphCount,
        COALESCE(SUM(CHAR_LENGTH(p.content)), 0) AS letters
      FROM Blogs b
      LEFT JOIN Paragraphes p ON b.id = p.blogID
      GROUP BY b.id
      ORDER BY b.datePosted DESC
    `);

    connection.release();

    const formattedBlogs = blogs.map(blog => ({
      id: blog.id,
      image: blog.image,
      title: blog.title,
      quote: blog.quote,
      category: blog.category,
      datePosted: formatDate(blog.datePosted),
      paragraphCount: blog.paragraphCount,
      letters: blog.letters,
    }));

    return res.status(200).json(formattedBlogs);
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