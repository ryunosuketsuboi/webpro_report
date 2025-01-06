"use strict";
const express = require("express");
const app = express();

let bbs = [];  // データを保存する簡易メモリデータベース

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON形式のリクエストを処理

// 投稿数を確認
app.post("/check", (req, res) => {
  res.json({ number: bbs.length });
});

// 投稿を取得
app.post("/read", (req, res) => {
  const start = Number(req.body.start);
  console.log("read -> " + start);
  if (start === 0) {
    res.json({ messages: bbs });
  } else {
    res.json({ messages: bbs.slice(start) });
  }
});

// 新しい投稿を作成
app.post("/post", (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    console.error("Invalid input: Missing name or message");
    return res.status(400).json({ status: "error", message: "Missing name or message" });
  }

  console.log("New post ->", { name, message });
  bbs.push({ name, message, timestamp: new Date().toISOString() });
  res.json({ number: bbs.length });
});

// サーバーを起動
app.listen(8080, () => console.log("BBS app listening on port 8080!"));
