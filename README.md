# 运行本项目必须要遵守一下规则

- node.js版本必须要大于或等于17.5
- 填写好config.js文件

# 除了获取api接口以及user接口无需cookie=sid，其余请求数据必须带上cookie=sid

示例 **http://romain:port/system/info?cookie=sid**

romain为域名

port为端口

**sid为登录后返回的sid**

## /api 简介

all 获取所有群晖api接口

## /user 简介

/login 登录

**保存好返回的sid，后面所有请求都需要用到**

| 参数名称 | 是否必填 | 接口类型 | 说明           |
| -------- | -------- | -------- | -------------- |
| username | true     | string   | 群晖登录用户名 |
| password | true     | string   | 群晖登录密码   |

/logout 退出

## /system 简介

/info 获取系统基本信息

| 参数名称 | 是否必填 | 接口类型 | 说明   |
| -------- | -------- | -------- | ------ |
| cookie   | true     | string   | cookie |

/status 获取系统状态

| 参数名称 | 是否必填 | 接口类型 | 说明   |
| -------- | -------- | -------- | ------ |
| cookie   | true     | string   | cookie |

/network 获取网络信息

| 参数名称 | 是否必填 | 接口类型 | 说明   |
| -------- | -------- | -------- | ------ |
| cookie   | true     | string   | cookie |

/service 获取已启用的服务

| 参数名称 | 是否必填 | 接口类型 | 说明   |
| -------- | -------- | -------- | ------ |
| cookie   | true     | string   | cookie |

/terminal 终端设置

| 参数名称     | 是否必填 | 接口类型 | 说明                           |
| ------------ | -------- | -------- | ------------------------------ |
| cookie       | true     | string   | cookie                         |
| enablessh    | false    | boolean  | 开启或关闭ssh，不填则不更改    |
| enabletelnet | false    | boolean  | 开启或关闭telnet，不填则不更改 |
| sshport      | false    | boolean  | ssh端口，不填则不更改          |

## /cloudsync 简介

/list 获取cloudsync所有已授权的云盘

| 参数名称 | 是否必填 | 接口类型 | 说明   |
| -------- | -------- | -------- | ------ |
| cookie   | true     | string   | cookie |

/settingmsg 获取云盘设置信息

| 参数名称 | 是否必填 | 接口类型 | 说明                       |
| -------- | -------- | -------- | -------------------------- |
| cookie   | true     | string   | cookie                     |
| id       | true     | number   | 网盘的对应id，在list里获取 |

/status 获取云盘状态信息

| 参数名称 | 是否必填 | 接口类型 | 说明                       |
| -------- | -------- | -------- | -------------------------- |
| cookie   | true     | string   | cookie                     |
| id       | true     | number   | 网盘的对应id，在list里获取 |

/property 获取云盘属性信息

| 参数名称 | 是否必填 | 接口类型 | 说明                       |
| -------- | -------- | -------- | -------------------------- |
| cookie   | true     | string   | cookie                     |
| id       | true     | number   | 网盘的对应id，在list里获取 |

/log 同步记录

| 参数名称 | 是否必填 | 接口类型 | 说明                            |
| -------- | -------- | -------- | ------------------------------- |
| cookie   | true     | string   | cookie                          |
| id       | true     | number   | 网盘的对应id，在list里获取      |
| limit    | false    | number   | 一次性获取多少数据，默认为200条 |

/change 更改云盘同步设置

| 参数名称         | 是否必填 | 接口类型 | 说明                       |
| ---------------- | -------- | -------- | -------------------------- |
| cookie           | true     | string   | cookie                     |
| id               | true     | number   | 网盘的对应id，在list里获取 |
| name             | true     | string   | cloudsync里显示的名称      |
| Pollingtime      | true     | number   | 轮询时间                   |
| maxdownloadspeed | true     | number   | 最大下载速度，0为不限速    |
| maxuploadspeed   | true     | number   | 最大上传速度，0为不限速    |

/pause 暂停同步所有云盘

| 参数名称 | 是否必填 | 接口类型 | 说明   |
| -------- | -------- | -------- | ------ |
| cookie   | true     | string   | cookie |

/start 开始同步

| 参数名称 | 是否必填 | 接口类型 | 说明   |
| -------- | -------- | -------- | ------ |
| cookie   | true     | string   | cookie |
