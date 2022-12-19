const express = require('express');
const router = express.Router();
const axios = require("axios");
const config = require("../config.js");
// console.log(method.iferror);
router.get('/login', (req, res) => {
    if (!req.query.username || !req.query.password) { // 登录群晖
        throw new Error('请传入用户名和密码')
    }

    axios.get(`${req.api}/entry.cgi?api=SYNO.API.Auth&version=7&method=login&account=${req.query.username}&passwd=${req.query.password}&session=FileStation&format=sid`, { timeout: (config.responseTimeout * 1000) })
        .then(response => { // 判断返回的值是否正确
            return new Promise((resolve, reject) => {
                if (response.data.data) {
                    resolve(response.data);
                } else if (response.data.error.code == 400) {
                    reject(new Error("密码或账号错误"))
                } else if (response.data.error.code == 407) {
                    reject(new Error("IP 地址已被封锁，因为它已达到特定时间允许的登录尝试失败最大数。请修改最大访问次数"))
                }
            });
        })
        .then(response => { // 正确的处理
            // console.log(response);
            req.session.auth = response.data.sid;
            res.send(response)

        }).catch(e => { // 错误的处理
            res.send(e.message)
        })


})

router.get('/logout', (req, res) => {// 登出群晖  BUG
    axios.get(`${req.api}/auth.cgi?api=SYNO.API.Auth&version=7&method=logout&session=FileStation&${req.query.cookie}`, { timeout: (config.responseTimeout * 1000) })
        .then((response) => { // 判断有没有报错，如果报错证明cookie过期
            return new Promise((resolve, reject) => {
                const string = JSON.stringify(response.data).slice(0, 85);
                if (string.includes('"error":{"code":119}') || string.includes('"has_fail":true')) {
                    reject(new Error('登录过期,请重新登录'))
                } else {
                    resolve(response.data)
                }
            });
        })
        .then(response => {
            res.send(response)
        })
        .catch(e => {
            res.send(e.message)
        })
})
module.exports = router;