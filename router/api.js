const express = require('express')
const router = express.Router();
const axios = require("axios");

router.get("/all", (req, res) => { // 获取所有api接口
    axios.get(`${req.domain}/webapi/query.cgi?api=SYNO.API.Info&version=1&method=query&query=all`)
        .then(response => {
            const { data: data } = response.data;
            res.send(data)
        }).catch(err => res.send(err)
        )
})
module.exports = router;