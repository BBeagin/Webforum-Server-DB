const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'db',
    user: 'proj_user',
    password: 'password',
    database: 'proj_db',
    port: 3306,
    connectionLimit: 10
})

const checkCredentials = async (username, password) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT uid, email, username FROM User WHERE username = ? AND password = MD5(?)', [username, password]);
    connection.release();
    return rows;
}

const registerCheck = async (email, username) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT uid FROM User WHERE email = ? OR username = ?', [email, username]);
    connection.release();
    return rows.length>0;
}

const getUserId = async (email, username, password) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT uid FROM User WHERE email = ? AND username = ? AND password = MD5(?)', [email, username, password]);
    connection.release();
    if (rows.length > 0)
        return rows[0].uid;
    return null;
}

const getEmail = async (uid) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT email FROM User WHERE uid = ?', [uid]);
    connection.release();
    if (rows.length > 0)
        return rows[0].email;
    return null;
}

const getUsername = async (uid) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT username FROM User WHERE uid = ?', [uid]);
    connection.release();
    return rows;
}

const getUserPosts = async (uid) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT title, username, image_content, post_date, belongs_in FROM Post JOIN User ON publisher = uid WHERE publisher = ?', [uid]);
    connection.release();
    return rows;
}

const getUserFeed = async (uid, interval_days) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT title, text_content, image_content, belongs_in, TIMESTAMPDIFF(HOUR, post_date, NOW()) AS post_age, u.username AS username FROM Post JOIN Follows f ON belongs_in = f.followed_community LEFT JOIN Reviews R ON Post.pid = R.pid AND R.review = 1 JOIN User u ON u.uid = publisher WHERE f.follower = ? AND post_date >= DATE_SUB(NOW(), INTERVAL ? DAY) GROUP BY Post.pid ORDER BY COUNT(R.review);', [uid, interval_days]);
    connection.release();
    return rows;
}

const getOwnedCommunities = async (uid) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT name FROM Community WHERE owner = ?', [uid]);
    connection.release();
    return rows;
}

const getFollowedCommunities = async (uid) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT followed_community AS name FROM Follows WHERE follower = ?', [uid]);
    connection.release();
    return rows;
}

const getPopularCommunities = async (limit) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT COUNT(follower) AS follow_count, name FROM Community LEFT JOIN Follows ON name = followed_community GROUP BY name ORDER BY follow_count DESC LIMIT ?', [limit]);
    connection.release();
    return rows;
}

const getAllCommunities = async () => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT name FROM Community ORDER BY name');
    connection.release();
    return rows;
}

const createUser = async (email, username, password) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('INSERT INTO User (email, username, password) VALUES (?, ?, MD5(?))', [email, username, password]);
    connection.release();
    return rows;
}

const createPost = async (title, text_content, image_content, belongs_in, publisher) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('INSERT INTO Post (title, text_content, image_content, belongs_in, publisher) VALUES (?,?,?,?,?)', [title, text_content, ((image_content) ? image_content : null), belongs_in, publisher]);
    connection.release();
    return rows;
}

const changeEmail = async (email, uid, password) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('UPDATE User SET email = ? WHERE uid = ? AND password = MD5(?)', [email, uid, password]);
    connection.release();
    return rows;
}

const changeUsername = async (username, uid, password) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('UPDATE User SET username = ? WHERE uid = ? AND password = MD5(?)', [username, uid, password]);
    connection.release();
    return rows;
}

const changePassword = async (new_pass, uid, password) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('UPDATE User SET password = MD5(?) WHERE uid = ? AND password = MD5(?)', [new_pass, uid, password]);
    connection.release();
    return rows;
}


module.exports = {
    pool,
    checkCredentials,
    registerCheck,
    getUserId,
    getEmail,
    getUsername,
    getUserPosts,
    getUserFeed,
    getOwnedCommunities,
    getFollowedCommunities,
    getPopularCommunities,
    getAllCommunities,
    createUser,
    createPost,
    changeEmail,
    changeUsername,
    changePassword
}