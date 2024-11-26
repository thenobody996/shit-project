import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import bcrypt from 'bcrypt'

// 打开数据库连接
let db

async function initDb() {
  db = await open({
    filename: './db/articles.db',
    driver: sqlite3.Database
  })

  // 创建表，如果表不存在
  await db.exec(`
        CREATE TABLE IF NOT EXISTS meetingroom(
            mettingroom_id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            author TEXT,
            isused INTEGER DEFAULT 0,
            pageviews INTEGER DEFAULT 0
        )
    `)
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        privilege INTEGER DEFAULT 0,
        token TEXT NOT NULL,
        face INTEGER DEFAULT 0
        )
    `)
  await db.exec(`CREATE TABLE meetings (
        meeting_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        topic TEXT NOT NULL,
        start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        end_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        meetingroom_id INTEGER NOT NULL,
        FOREIGN KEY (meetingroom_id) REFERENCES meetingroom(meetingroom_id),
        )
    `)
  await db.exec(`CREATE TABLE meeting_attendees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meeting_id INTEGER NOT NULL,
        attendee_id INTEGER NOT NULL,
        FOREIGN KEY (meeting_id) REFERENCES meetings(meeting_id),
        FOREIGN KEY (attendee_id) REFERENCES attendees(attendee_id)
        )
    `)
}

// 获取列表
async function getArticles(query) {
  const { page = 1, limit = 20, sort = 'mettingroom_id', ...filters } = query
  const offset = (page - 1) * limit
  const order = sort.startsWith('-') ? 'DESC' : 'ASC'
  const orderBy = sort.replace(/^\+|-/, '')

  // 基于条件构建查询
  let whereClause = 'WHERE 1=1'
  const params = []

  if (filters.title) {
    whereClause += ' AND title LIKE ?'
    params.push(`%${filters.title}%`)
  }

  // 将 limit 和 offset 添加到 params 的最后
  const rows = await db.all(`
        SELECT * FROM articles 
        ${whereClause} 
        ORDER BY ${orderBy} ${order} 
        LIMIT ? OFFSET ?`,
  ...params, limit, offset
  )

  const countRow = await db.get(`SELECT COUNT(*) as total FROM articles ${whereClause}`, ...params)

  const result = { items: rows, total: countRow.total }
  return result
}

async function getArticleById(id) {
  return await db.get(`SELECT * FROM articles WHERE mettingroom_id = ?`, id)
}

async function createArticle(data) {
  const { title, timestamp, author, isused, pageviews } = data
  const result = await db.run(`
        INSERT INTO articles (title, timestamp, author, isused, pageviews) 
        VALUES (?, ?, ?, ?, ?)
    `, title, timestamp, author, isused, pageviews)
  return { id: result.lastID }
}

async function updateArticle(id, data) {
  const { title, timestamp, author, isused, pageviews } = data
  console.log(data)
  await db.run(`
        UPDATE articles SET title = ?, timestamp = ?, author = ?, isused = ?,
            pageviews = ? WHERE mettingroom_id = ?
    `, title, timestamp, author, isused, pageviews, id)
  return { id }
}

async function updatePv(id, pv) {
  await db.run(`UPDATE articles SET pageviews = pageviews + ? WHERE mettingroom_id = ?`, pv, id)
  return { id }
}

async function deleteArticle(id) {
  await db.run(`DELETE FROM articles WHERE mettingroom_id = ?`, id)
  return { id }
}

// 添加用户认证的查询方法
async function getUserByUsername(username) {
  try {
    // 假设数据库中有用户表 `users`，字段包括 `username` 和 `password`
    const user = await db.get(`SELECT * FROM users WHERE username = ?`, username)
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

// 注册用户时加密密码
async function createUser(username, plainPassword) {
  const hashedPassword = await bcrypt.hash(plainPassword, 10)
  await db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, username, hashedPassword)
}
// Function to get user token based on username
function getUserToken(username) {
  return new Promise((resolve, reject) => {
    db.get('SELECT token FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        console.log(row.token)
        resolve(row ? row.token : null)
      }
    })
  })
}

// Function to get user information based on token
function getUserInfoByToken(token) {
  return new Promise((resolve, reject) => {
    db.get('SELECT roles, introduction, avatar, name FROM users WHERE token = ?', [token], (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}
export { initDb, getArticles, getArticleById, createArticle, updateArticle, deleteArticle, updatePv, createUser, getUserByUsername, getUserInfoByToken, getUserToken }
