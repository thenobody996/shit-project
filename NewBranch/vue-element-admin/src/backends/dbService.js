import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// 打开数据库连接
let db;

async function initDb() {
    db = await open({
        filename: './db/articles.db',
        driver: sqlite3.Database
    });

    // 创建表，如果表不存在
    await db.exec(`
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            author TEXT,
            reviewer TEXT,
            importance INTEGER,
            pageviews INTEGER DEFAULT 0,
            status TEXT DEFAULT 'draft',
            type TEXT,
            remark TEXT
        )
    `);
}

// 获取文章列表
async function getArticles(query) {
    const { page = 1, limit = 20, sort = 'id', ...filters } = query;
    const offset = (page - 1) * limit;
    const order = sort.startsWith('-') ? 'DESC' : 'ASC';
    const orderBy = sort.replace(/^\+|-/, '');

    // 基于条件构建查询
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (filters.title) {
        whereClause += ' AND title LIKE ?';
        params.push(`%${filters.title}%`);
    }
    if (filters.importance) {
        whereClause += ' AND importance = ?';
        params.push(filters.importance);
    }
    if (filters.type) {
        whereClause += ' AND type = ?';
        params.push(filters.type);
    }

    // 将 limit 和 offset 添加到 params 的最后
    const rows = await db.all(`
        SELECT * FROM articles 
        ${whereClause} 
        ORDER BY ${orderBy} ${order} 
        LIMIT ? OFFSET ?`, 
        ...params, limit, offset
    );

    const countRow = await db.get(`SELECT COUNT(*) as total FROM articles ${whereClause}`, ...params);
  
    return { items: rows, total: countRow.total };
}

// 获取文章详情
async function getArticleById(id) {
    return await db.get(`SELECT * FROM articles WHERE id = ?`, id);
}

// 添加新文章
async function createArticle(data) {
    const { title, timestamp, author, reviewer, importance, pageviews, status, type, remark } = data;
    const result = await db.run(`
        INSERT INTO articles (title, timestamp, author, reviewer, importance, pageviews, status, type, remark) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, title, timestamp, author, reviewer, importance, pageviews, status, type, remark);
    return { id: result.lastID };
}
// 更新文章
async function updateArticle(id, data) {
    const { title, timestamp, author, reviewer, importance, pageviews, status, type, remark } = data;
    await db.run(`
        UPDATE articles SET title = ?, timestamp = ?, author = ?, reviewer = ?, importance = ?, 
            pageviews = ?, status = ?, type = ?, remark = ? WHERE id = ?
    `, title, timestamp, author, reviewer, importance, pageviews, status, type, remark, id);
    return { id };
}

async function updatePv(id, pv) {
  await db.run(`UPDATE articles SET pageviews = pageviews + ? WHERE id = ?`, pv, id);
  return { id };
}

// 删除文章
async function deleteArticle(id) {
    await db.run(`DELETE FROM articles WHERE id = ?`, id);
    return { id };
}

export { initDb, getArticles, getArticleById, createArticle, updateArticle, deleteArticle ,updatePv};
