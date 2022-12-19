const axios = require('axios');
const express = require('express')
const router = express.Router();
const config = require("../config")
router.get("/info", (req, res) => { // 获取系统基本信息
    axios.get(`${req.api}/entry.cgi?stop_when_error=false&mode="sequential"&compound=[{"api":"SYNO.Core.System","method":"info","version":3},{"api":"SYNO.Core.QuickConnect","method":"get","version":2},{"api":"SYNO.Core.Hardware.FanSpeed","method":"get","version":1}]&api=SYNO.Entry.Request&method=request&version=1&_sid=${req.session.auth}`, { timeout: (config.responseTimeout * 1000) })
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
        .catch((e) => {
            res.send(e.message)
        })
})

router.get("/status", (req, res) => { // 获取系统状态
    axios.get(`${req.api}/entry.cgi?api=SYNO.Core.System.Utilization&method=get&version=1&_sid=${req.session.auth}`, { timeout: (config.responseTimeout * 1000) })
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


router.get("/network", (req, res) => { // 获取网络基本信息

    axios.get(`${req.api}/entry.cgi?stop_when_error=false&mode="sequential"&compound=[{"api":"SYNO.Core.System","method":"info","version":1,"type":"network"},{"api":"SYNO.Core.DDNS.Record","method":"list","version":1}]&api=SYNO.Entry.Request&method=request&version=1&_sid=${req.session.auth}`, { timeout: (config.responseTimeout * 1000) })
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

router.get("/service", (req, res) => { // 获取获取已启用的服务
    axios.get(`${req.api}/entry.cgi?stop_when_error=false&mode="parallel"&compound=[{"api":"SYNO.Core.Service","method":"get","version":3,"additional":["active_status"]},{"api":"SYNO.Core.Package","method":"list","version":1,"additional":["status"]}]&api=SYNO.Entry.Request&method=request&version=1&_sid=${req.session.auth}`, { timeout: (config.responseTimeout * 1000) })
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

router.get("/terminal", (req, res) => { // 终端设置
    if (req.query.enablessh == undefined && req.query.enabletelnet == undefined && req.query.sshport == undefined) {
        throw new Error("请输入至少一个参数");
    }
    // 先获取原来的数据
    axios.get(`${req.api}/entry.cgi?stop_when_error=false&mode="sequential"&compound=[{"api":"SYNO.Core.Terminal","method":"get","version":3},{"api":"SYNO.Core.SNMP","method":"get","version":1}]&api=SYNO.Entry.Request&method=request&version=1&_sid=${req.session.auth}`, { timeout: (config.responseTimeout * 1000) })
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
            let enable_telnet = response.data.result[0].data.enable_telnet;
            let enable_ssh = response.data.result[0].data.enable_ssh;
            let ssh_port = response.data.result[0].data.ssh_port;

            // 处理配置数据
            enable_ssh = Boolean(enable_ssh);
            enable_telnet = Boolean(enable_telnet);
            ssh_port = Number(ssh_port);

            req.query.enablessh = req.query.enablessh == undefined ? enable_ssh : req.query.enablessh;
            req.query.enabletelnet = req.query.enabletelnet == undefined ? enable_telnet : req.query.enabletelnet;
            req.query.sshport = req.query.sshport == undefined ? ssh_port : req.query.sshport;

            // 发起请求
            let compound = `[{ "api": "SYNO.Core.Terminal", "method": "set", "version": "3", "enable_telnet": ${req.query.enabletelnet}, "enable_ssh": ${req.query.enablessh}, "ssh_port": ${req.query.sshport} }, { "api": "SYNO.Core.SNMP", "method": "set", "version": "1", "enable_snmp": false }, { "api": "SYNO.Core.Terminal", "method": "get", "version": 3 }, { "api": "SYNO.Core.SNMP", "method": "get", "version": 1 }]`;
            axios.get(`${req.api}/entry.cgi?stop_when_error=false&mode="sequential"&compound=${compound}&api=SYNO.Entry.Request&method=request&version=1&_sid=${req.session.auth}`, { timeout: (config.responseTimeout * 1000) })
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
        })
        .catch(e => {
            res.send(e.message)
        })
})
router.get("/shutdown", (req, res) => { // 关机
    (req.query.force == undefined) && (req.query.force = false);
    req.query.force = Boolean(req.query.force);
    axios.get(`${req.api}/entry.cgi?force=${req.query.force}&local=true&firmware_upgrade=false&cache_check_shutdown=true&api=SYNO.Core.System&method=shutdown&version=2&_sid=${req.session.auth}`, { timeout: (config.responseTimeout * 1000) })
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
router.get("/reboot", (req, res) => { // 重启
    (req.query.force == undefined) && (req.query.force = false);
    req.query.force = Boolean(req.query.force);
    axios.get(`${req.api}/entry.cgi?force=${req.query.force}&local=true&firmware_upgrade=false&cache_check_shutdown=false&api=SYNO.Core.System&method=reboot&version=2&_sid=${req.session.auth}`, { timeout: (config.responseTimeout * 1000) })
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