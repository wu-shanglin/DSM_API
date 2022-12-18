const express = require('express')
const router = express.Router();
router.get("/all", (req, res) => { // 获取所有api接口
    fetch(`${req.domain}/webapi/query.cgi?api=SYNO.API.Info&version=1&method=query&query=all`)
        .then(data => data.json())
        .then(response => {
            res.send(response.data)
        })
})

module.exports = router;