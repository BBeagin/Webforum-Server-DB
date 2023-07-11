const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'db',
    user: 'proj_user',
    password: 'password',
    database: 'proj_db',
    port: 3306,
    connectionLimit: 10,
    multipleStatements: true
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

const getUserId = async (username) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT uid FROM User WHERE username = ?', [username]);
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

const getCommunityPosts = async (name) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT P.title, U.username, P.image_content, P.post_date, belongs_in, COUNT(R.reviewer) AS like_count FROM Post P JOIN User U ON P.publisher = U.uid LEFT JOIN Reviews R ON R.pid = P.pid AND review = 1 WHERE belongs_in = ? GROUP BY P.pid ORDER BY like_count DESC', [name]);
    connection.release();
    return rows;
}

const getCommunityDescription = async (name) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT description FROM Community WHERE name = ?', [name]);
    connection.release();
    if (rows.length > 0)
        return rows[0].description;
    return null;
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

const getUserGroups = async (uid) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT G.gid, G.group_name FROM `Group` G JOIN Belongs_to B ON G.gid = B.gid WHERE B.uid = ?', [uid]);
    connection.release();
    return rows;
}

const getGroupMembers = async (gid) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT u.uid, u.username FROM `Group` G JOIN Belongs_to B ON G.gid = B.gid JOIN User u ON B.uid = u.uid WHERE G.gid = ?', [gid]);
    connection.release();
    return rows;
}

const getUserInbox = async (uid) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT u.username, m.text_content FROM Message m JOIN Sends s ON m.msgid = s.msgid JOIN User u ON s.sender = u.uid WHERE s.recipient_user = ? ORDER BY m.send_date DESC', [uid]);
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

const createGroup = async (group_name) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('INSERT INTO `Group` (group_name) VALUES (?); SELECT LAST_INSERT_ID() AS gid;', [group_name]);
    connection.release();
    if (rows.length > 1)
        return rows[1][0].gid;
    return null;
}

const composeMessage_User = async (sender, uid, text_content) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('INSERT INTO `Message` (text_content) VALUES (?); INSERT INTO `Sends` (sender, msgid, recipient_user, u_p_flag) VALUES ( ?, LAST_INSERT_ID(), ?, ?)', [text_content, sender, uid, 'User']);
    connection.release();
    return rows;
}

const joinGroup = async (gid,uid) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('INSERT INTO `Belongs_to` (gid,uid)  VALUES (?, ?); SELECT LAST_INSERT_ID() AS gid;', [gid,uid]);
    connection.release();
    if (rows.length > 0)
        return rows[0].gid;
    return null;
}

const followUC = async (follower, uid, community) => {
    const connection = await pool.getConnection();
    var rows = null;
    if(community) {
        [rows] = await connection.query('INSERT INTO `Follows` (follower, followed_community, u_c_flag) VALUES (?, ?, ?)', [follower, community, 'COMMUNITY'])
    } else if(uid) {
        [rows] = await connection.query('INSERT INTO `Follows` (follower, followed_user, u_c_flag) VALUES (?, ?, ?)', [follower, uid, 'USER'])
    } else
        return null;
    connection.release();
    return rows;
}

const unfollowUC = async (follower, uid, community) => {
    const connection = await pool.getConnection();
    var rows = null;
    if(community) {
        [rows] = await connection.query('DELETE FROM `Follows` WHERE follower = ? AND followed_community = ?', [follower, community])
    } else if(uid) {
        [rows] = await connection.query('DELETE FROM `Follows` WHERE follower = ? AND followed_user = ?', [follower, uid])
    } else
        return null;
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

const leaveGroup = async (uid, gid) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('DELETE FROM Belongs_to WHERE uid = ? AND gid = ?', [uid, gid]);
    connection.release();
    return rows;
}

const deleteGroup = async (gid) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('DELETE FROM `Group` WHERE gid = ?', [gid]);
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
    getCommunityPosts,
    getCommunityDescription,
    getOwnedCommunities,
    getFollowedCommunities,
    getPopularCommunities,
    getAllCommunities,
    getUserGroups,
    getGroupMembers,
    getUserInbox,
    createUser,
    createPost,
    createGroup,
    composeMessage_User,
    joinGroup,
    followUC,
    changeEmail,
    changeUsername,
    changePassword,
    leaveGroup,
    deleteGroup,
    unfollowUC
}