const { default: axios } = require('axios');
const express = require('express')
const router = express.Router();
const config = require("../config.js");
router.get("/list", (req, res) => { // 获取cloudsync列表
    axios.get(`${req.api}/entry.cgi?is_tray=false&group_by="group_by_user"&api=SYNO.CloudSync&method=list_conn&version=1&_sid=${req.session.auth}`, { timeout: (config.responseTimeout * 1000) })
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
            res.send(response);
        })
        .catch(e => {
            res.send(e.message)
        })
})

router.get("/settingmsg", (req, res) => { // 获取items设置信息
    if (!(req.query.id >= 0) || req.query.id == undefined) {
        throw new Error("请添加list的请求id")
    }
    axios.get(`${req.api}/entry.cgi?connection_id=${req.query.id}&api=SYNO.CloudSync&method=get_connection_setting&version=1&_sid=${req.session.auth}`, { timeout: (config.responseTimeout * 1000) })
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
            res.send(response);
        }).catch(e => {
            res.send(e.message)
        })
})

router.get("/status", (req, res) => { // 获取items状态信息
    if (!(req.query.id >= 0) || req.query.id == undefined) {
        throw new Error("请添加list的请求id")
    }
    axios.get(`${req.api}/entry.cgi?connection_id=3&api=SYNO.CloudSync&method=list_sess&version=1&_sid=${req.session.auth}`, { timeout: (config.responseTimeout * 1000) })
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
            res.send(response);
        })
        .catch(e => {
            res.send(e.message)
        })
})

router.get("/property", (req, res) => { // 获取items属性信息
    if (!(req.query.id >= 0) || req.query.id == undefined) {
        throw new Error("请添加list的请求id")
    }
    axios.get(`${req.api}/entry.cgi?connection_id=${req.query.id}&api=SYNO.CloudSync&method=get_property&version=1&_sid=${req.session.auth}`, { timeout: (config.responseTimeout * 1000) })
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
            res.send(response);
        })
        .catch(e => {
            res.send(e.message)
        })
})

router.get("/log", (req, res) => { // 获取items同步记录
    if (!(req.query.id >= 0) || req.query.id == undefined) {
        throw new Error("请添加list的请求id")
    }
    req.query.limit = req.query.limit || 200;
    console.log(req.query.limit);
    axios.get(`${req.api}/entry.cgi?offset=0&limit=${req.query.limit}&connection_id=${req.query.id}&api=SYNO.CloudSync&method=get_log&version=1&_sid=${req.session.auth}`, { timeout: (config.responseTimeout * 1000) })
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
            res.send(response);
        })
        .catch(e => {
            res.send(e.message)
        })
})

router.get("/change", (req, res) => { // 更改items设置
    // 最大上传和下载为0 代表不限速
    if (!(req.query.id >= 0) || (req.query.id == undefined)) {
        throw new Error("请添加list的请求id")
    } else if (!req.query.name || req.query.Pollingtime == undefined || req.query.maxdownloadspeed == undefined || req.query.maxuploadspeed == undefined) {
        throw new Error("必须填写所有参数")
    }
    axios.get(`${req.api}/entry.cgi?connection_id=${req.query.id}&task_name="${req.query.name}"&pull_event_period=${Number(req.query.Pollingtime)}&max_upload_speed=${req.query.maxuploadspeed}&max_download_speed=${req.query.maxdownloadspeed}&storage_class=""&isSSE=false&part_size=128&api=SYNO.CloudSync&method=set_connection_setting&version=1&_sid=${req.session.auth}`, { timeout: (config.responseTimeout * 1000) })
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
            res.send(response);
        })
        .catch(e => {
            res.send(e.message)
        })
})

router.get("/pause", (req, res) => { // 暂停所有items同步
    axios.get(`${req.api}/entry.cgi?api=SYNO.CloudSync&method=pause&version=1&_sid=${req.session.auth}`, { timeout: (config.responseTimeout * 1000) })
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
            res.send(response);
        })
        .catch(e => {
            res.send(e.message)
        })
})

router.get("/start", (req, res) => { // 开始所有items同步
    axios.get(`${req.api}/entry.cgi?api=SYNO.CloudSync&method=resume&version=1&_sid=${req.session.auth}`, { timeout: (config.responseTimeout * 1000) })
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
            res.send(response);
        })
        .catch(e => {
            res.send(e.message)
        })
})

module.exports = router;