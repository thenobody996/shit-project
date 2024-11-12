import request from '@/utils/localrequest';

/**
 * 获取文章列表
 * @param {Object} query - 查询参数
 * @returns {Promise<{ code: number, data: { items: Array, total: number } }>}
 */
export function fetchList(query) {
  return request({
    url: '/vue-admin-template/article/list',
    method: 'get',
    params: query
  }).then(response => {
    
    // 确保返回的数据格式符合 { data: { items, total } }
    return {code:20000, data: { items: response.items, total: response.total } };
  });
}

/**
 * 获取文章详情
 * @param {number} id - 文章ID
 * @returns {Promise<{ code: number, data: Object }>}
 */
export function fetchArticle(id) {
  return request({
    url: '/vue-admin-template/article/detail',
    method: 'get',
    params: { id }
  }).then(response => {
    if (response) {
      return {code:20000, data: response }; // 返回 { code: 20000, data: article }
    }
    throw new Error('No data returned from server');
  });
}

/**
 * 获取文章浏览量
 * @param {number} pv - 浏览量参数
 * @returns {Promise<{ code: number, data: { pvData: Array } }>}
 */
export function fetchPv(pv) {
  return request({
    url: '/vue-admin-template/article/pv',
    method: 'get',
    params: { pv }
  }).then(response => {
    if (response) {
      return {code:20000, data: response }; // 返回 { code: 20000, data: { pvData } }
    }
    throw new Error('No data returned from server');
  });
}

/**
 * 创建新文章
 * @param {Object} data - 文章数据
 * @returns {Promise<{ code: number, data: string }>}
 */
export function createArticle(data) {
  return request({
    url: '/vue-admin-template/article/create',
    method: 'post',
    data
  }).then(response => {
    if (response && response.data) {
      return {code:20000, data: 'success' }; // 返回 { code: 20000, data: 'success' }
    }
    throw new Error('Failed to create article');
  });
}

/**
 * 更新文章
 * @param {Object} data - 文章数据
 * @returns {Promise<{ code: number, data: string }>}
 */
export function updateArticle(data) {
  return request({
    url: '/vue-admin-template/article/update',
    method: 'post',
    data
  }).then(response => {
      console.log(response);
      return {code:20000, data: 'success' }; // 返回 { code: 20000, data: 'success' }
  });
}
