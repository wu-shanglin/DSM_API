"use strict"
const express = require('express');
const cors = require('cors');
const app = express();
const session = require("express-session");
const config = require("./config.js");
app.use('/', express.static('./page'));
app.use(cors());
app.use(session({
    secret: "DSM-api",
    resave: false,
    saveUninitialized: true
}))
// 处理config.js
app.use(function (req, res, next) {
    if (config.https) {
        req.domain = `https://${config.domain}:${config.port}`
    } else {
        req.domain = `http://${config.domain}:${config.port}`
    }
    req.api = req.domain + '/webapi';
    next();
})

// 获取api接口
const api_router = require('./router/api.js');
app.use('/api', api_router);
// 用户
const user_router = require("./router/user.js");
app.use('/user', user_router);
// 系统
const info_router = require("./router/system.js");
app.use('/system', info_router);
// cloudsync
const cloudsync_router = require("./router/cloudsync.js");
app.use('/cloudsync', cloudsync_router);
// 接受错误，防止项目崩溃
app.use((err, req, res, next) => {
    res.send(err.message);
})

app.listen(config.apiPort)