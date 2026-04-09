# 吾光療域 Landing Page — 使用說明

## 專案結構

```
wulit-landing/
├── index.html          ← 網頁入口
├── package.json        ← 專案設定
├── vite.config.js      ← 打包設定
├── public/
│   └── images/         ← ★ 把老吾的照片放這裡
└── src/
    ├── main.jsx        ← React 入口（不用動）
    └── App.jsx         ← ★ 主要頁面（文案和圖片在這裡改）
```

---

## 第一次使用（只做一次）

### Step 1 — 安裝 Node.js
前往 https://nodejs.org 下載「LTS」版本安裝。

### Step 2 — 用 Cursor 開啟專案
1. 下載並安裝 Cursor（cursor.com）
2. 打開 Cursor → File → Open Folder → 選擇 `wulit-landing` 這個資料夾

### Step 3 — 安裝依賴套件
在 Cursor 底部的 Terminal 輸入：
```
npm install
```
等它跑完（大概 30 秒）。

### Step 4 — 在本地預覽
```
npm run dev
```
打開瀏覽器，前往 http://localhost:5173 即可預覽。

---

## 替換真實照片

1. 把照片放進 `public/images/` 資料夾
2. 打開 `src/App.jsx`，找到 `ImgPh` 元件
3. 每個 `<ImgPh>` 旁邊都有註解說明怎麼換圖，照著做即可

---

## 部署上線（Vercel，免費）

1. 前往 vercel.com，用 GitHub 帳號登入
2. 點「Add New Project」→「Import Git Repository」
3. 把 `wulit-landing` 資料夾上傳後，Vercel 自動完成部署
4. 你會得到一個 `xxx.vercel.app` 的網址

---

## 需要改什麼文案？

所有文案都在 `src/App.jsx` 最上方的 DATA 區塊：
- `TAGS` — 四個 pills 的文字
- `FEATS` — 三個亮點的標題和描述
- `STEPS` — 預約流程三個步驟
- `QA` — 五組常見問題

顏色值在最上方的 `C` 物件裡，全部對齊品牌 design skill。

---

*by Claude for Wul.it × Yichun｜2026.04*
