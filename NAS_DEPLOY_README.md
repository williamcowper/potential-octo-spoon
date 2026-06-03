## 在 NAS 上通过 Docker 部署（自动化方案）

我为你生成了一套 Docker/CCompose 部署文件，分支：feature/echarts-firestore

结构（已提交到仓库）：
- api/                -> 后端 Express 服务（REST API，数据保存在 api/data/db.json）
- Dockerfile.frontend -> 前端多阶段构建，最终静态文件由 nginx 提供
- nginx.conf          -> nginx 配置，/api/* 转发到后端
- docker-compose.yml  -> 一键启动 web (nginx) + api

快速部署步骤（在你的 NAS 上执行）：
1. 把仓库克隆到 NAS（或在已有目录拉取最新分支）：
   git clone https://github.com/williamcowper/potential-octo-spoon.git
   cd potential-octo-spoon
   git checkout feature/echarts-firestore

2. 在 NAS 上启动服务（确认已安装 Docker + docker-compose）：
   docker-compose up -d --build

3. 等待构建完成后（首次构建会拉取 node/nginx 镜像并完成打包），在浏览器打开：
   http://<NAS_IP>/
   你应该能看到前端页面，前端会通过 /api 请求访问后端，后端数据保存在仓库的 api/data/db.json（已挂载为卷）。

将站点对公网开放（可选）
- 如果你要让互联网上的人访问该站点，需要在路由器上做端口转发：将公网端口（建议 80/443）转到 NAS 的 80 端口。
- 强烈建议使用反向代理 + TLS（Let's Encrypt）。如果你的 NAS 有反代/反向代理面板（例如 Synology 的 Reverse Proxy 或者 Traefik），可以把域名和证书配置好后指向 NAS 的 80/443。

安全建议
- 当前后端没有认证，任何人访问你的公网地址都能通过 API 增删改数据。如果你要公开访问，建议在后端添加简单的编辑口令或 API key（我可以帮你加）。
- 数据保存在 api/data/db.json，建议定期备份该文件。

我接下来可以做的事（我会代劳）：
- 如果你允许，我会在仓库上合并这些部署文件到 feature/echarts-firestore（我已推送）并帮助你完成第一次在 NAS 的 docker-compose up 命令（我会给你逐步命令）。
- 我也可以为后端添加一个简单的编辑口令：在 docker-compose.yml 中添加环境变量 EDIT_KEY=your_secret，然后在 API 接口里校验请求中 header x-edit-key===EDIT_KEY 才允许写操作（我可以立刻添加）。

告诉我下一步：
- 你想我现在把"编辑口令"功能也加上吗？（是/否）
- 你是否需要我一步步带你在 NAS 上执行 docker-compose up？（需要/不需要）

如果你同意，我会把编辑口令的支持直接加到后端并更新 docker-compose.yml 以示例 ENV。然后我会告诉你如何在 NAS 上运行并把公网域名/端口转发的常见步骤写清楚。
