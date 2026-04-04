const request = require('supertest');
const app = require('../server'); // 引入你的 Express app
const mongoose = require('mongoose');

describe('Tour API Endpoints', () => {
  
  // 測試前：確保資料庫連線 (選擇性)
  
  // 🔴 測試案例 1：檢查 GET /api/tours 是否回傳 200 狀態碼
  it('should fetch all tours successfully', async () => {
    const res = await request(app).get('/api/tours');
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true); // 預期回傳的是一個陣列
  });

  // 🔴 測試案例 2：嘗試進入一個不存在的頁面應該回傳 404
  it('should return 404 for non-existing routes', async () => {
    const res = await request(app).get('/api/unexisting-path');
    expect(res.statusCode).toEqual(404);
  });

  // 測試完畢後關閉資料庫連線，防止測試不結束
  afterAll(async () => {
    await mongoose.connection.close();
  });
});