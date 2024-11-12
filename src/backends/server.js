import express from 'express'
import cors from 'cors';
//import bodyParser from 'body-parser'
import { initDb, getArticles,getArticleById, createArticle, updateArticle, updatePv } from './dbService.js'


const app = express()
app.use(cors({
    origin: 'http://localhost:9527', // 允许的来源
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的方法
    allowedHeaders: ['Content-Type', 'Authorization', 'x-token'], // 允许的头
}));
app.use(express.json()); // 解析 JSON 格式的请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码的请求体
app.options('*', cors());

// 初始化数据库
await initDb()

// 获取文章列表
app.get('/vue-admin-template/article/list', async (req, res) => {
    try {
        const result = await getArticles(req.query);
        //console.log('Query parameters:', req.query);
        // 将返回格式改为包含 code 字段
        res.json({ code: 20000, data: result });
    } catch (error) {
        res.status(500).json({ code: 50001, message: error.message });
    }
});


// 获取文章详情
app.get('/vue-admin-template/article/detail', async (req, res) => {
    const { id } = req.query;
    try {
        const result = await getArticleById(id);
        if (result) {
            res.json({ code: 20000,data: result });
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (error) {
        res.status(500).json({code: 50001, error: error.message });
    }
});
// 获取浏览量和文章ID
app.get('/vue-admin-template/article/pv', async (req, res) => {
    const { pv, id } = req.query; // 获取浏览量和文章ID
    try {
      const result = await updatePv(id, pv);
      res.json({code: 20000, data: result });
    } catch (error) {
      res.status(500).json({code: 50001, error: error.message });
    }
  });
// 更新文章
app.post('/vue-admin-template/article/update', async (req, res) => {
    try {
        const result = await updateArticle(req.body.id, req.body);
        res.json({code: 20000, data: result });
    } catch (error) {
        res.status(500).json({code: 50001, error: error.message });
    }
});

// 创建新文章
app.post('/vue-admin-template/article/create', async (req, res) => {
    try {
        const result = await createArticle(req.body);
        res.status(201).json({ data: result });
    } catch (error) {
        res.status(500).json({code: 50001, error: error.message });
    }
});

// 启动服务器
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
