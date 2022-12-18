const express = require('express')
const router = express.Router();
router.get("/info", (req, res) => { // 获取系统基本信息

    fetch(`${req.api}/entry.cgi?stop_when_error=false&mode="sequential"&compound=[{"api":"SYNO.Core.System","method":"info","version":3},{"api":"SYNO.Core.QuickConnect","method":"get","version":2},{"api":"SYNO.Core.Hardware.FanSpeed","method":"get","version":1}]&api=SYNO.Entry.Request&method=request&version=1&_sid=${req.query.cookie}`)
        .then(data => data.json())
        .then(response => {
            res.send(response);
        })
})

router.get("/status", (req, res) => { // 获取系统状态
    fetch(`${req.api}/entry.cgi?api=SYNO.Core.System.Utilization&method=get&version=1&_sid=${req.query.cookie}`)
        .then(data => data.json())
        .then(response => {
            res.send(response);
        })
})


router.get("/network", (req, res) => { // 获取网络基本信息

    fetch(`${req.api}/entry.cgi?stop_when_error=false&mode="sequential"&compound=[{"api":"SYNO.Core.System","method":"info","version":1,"type":"network"},{"api":"SYNO.Core.DDNS.Record","method":"list","version":1}]&api=SYNO.Entry.Request&method=request&version=1&_sid=${req.query.cookie}`)
        .then(data => data.json())
        .then(response => {
            res.send(response);
        })
})

router.get("/service", (req, res) => { // 获取获取已启用的服务
    fetch(`${req.api}/entry.cgi?stop_when_error=false&mode="parallel"&compound=[{"api":"SYNO.Core.Service","method":"get","version":3,"additional":["active_status"]},{"api":"SYNO.Core.Package","method":"list","version":1,"additional":["status"]}]&api=SYNO.Entry.Request&method=request&version=1&_sid=${req.query.cookie}`)
        .then(data => data.json())
        .then(response => {
            res.send(response);
        })
})

router.get("/terminal", (req, res) => { // 终端设置
    if (req.query.enablessh == undefined && req.query.enabletelnet == undefined && req.query.sshport == undefined) {
        throw new Error("请输入至少一个参数");
    }
    // 先获取原来的数据
    fetch(`${req.api}/entry.cgi?stop_when_error=false&mode="sequential"&compound=[{"api":"SYNO.Core.Terminal","method":"get","version":3},{"api":"SYNO.Core.SNMP","method":"get","version":1}]&api=SYNO.Entry.Request&method=request&version=1&_sid=${req.query.cookie}`)
        .then(data => data.json())
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
            console.log(`${req.api}/entry.cgi?stop_when_error=false&mode="sequential"&compound=${compound}&api=SYNO.Entry.Request&method=request&version=1&_sid=${req.query.cookie}`);
            fetch(`${req.api}/entry.cgi?stop_when_error=false&mode="sequential"&compound=${compound}&api=SYNO.Entry.Request&method=request&version=1&_sid=${req.query.cookie}`)
                .then(data => data.json())
                .then(response => {
                    res.send(response);
                })
        })



})
module.exports = router;