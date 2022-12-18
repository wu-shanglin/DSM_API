const express = require('express')
const router = express.Router();
router.get('/login', (req, res) => {
    if (!req.query.username || !req.query.password) { // 登录群晖
        res.send('请传入用户名和密码')
    }
    fetch(`${req.api}/entry.cgi?api=SYNO.API.Auth&version=7&method=login&account=${req.query.username}&passwd=${req.query.password}&session=FileStation&format=sid`)
        .then(data => data.json())
        .then(response => {
            res.send(response)
        })
})


router.get('/logout', (req, res) => {// 登出群晖
    fetch(`${req.api}/auth.cgi?api=SYNO.API.Auth&version=7&method=logout&session=FileStation`)
        .then(data => data.json())
        .then(response => {
            res.send(response)
        })
})
module.exports = router;