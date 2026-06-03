# Job Toolbox — React + ECharts + Firestore

已为你在分支 `feature/echarts-firestore` 提交一个最小可用的 React + Vite + TypeScript 项目，实现：

- 图表（ECharts）创建 / 列表 / 编辑标题 / 删除
- 使用 Firebase Firestore (集合 `charts`) 做在线持久化（`onSnapshot` 实时监听）

我已按你要求创建分支并推送代码到仓库（请在 GitHub 仓库查看分支）。下面是部署与使用说明。

---

## 重要：为什么需要 Firebase

为了让“任何人打开网页即可查询和修改”，该项目默认使用 Firestore 存储图表数据。你需要创建一个 Firebase 项目并将配置写入 Vercel 环境变量（下一节）。我在 README 提供了 Firestore 公共读写规则示例（允许所有人读写），但请注意：这会允许任何人增删改数据，存在被恶意擦除或篡改的风险。

## 已提交的分支

branch: `feature/echarts-firestore`

包含主要文件：
- src/ (React 应用代码)
- public/original.html (你给的单文件页面备份)
- README.md (本文件)

---

## 如何创建 Firebase（快速步骤）
1. 打开 https://console.firebase.google.com/ 并创建一个项目。
2. 在项目设置 -> 添加 Web 应用，记录下配置（apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId）。
3. 在 Firestore Database 中，创建数据库（测试模式或使用以下安全规则）。

### 推荐的临时测试规则（公开读写 — 风险提示）
在 Firestore 控制台的 Rules 标签中，替换为：

```
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

这会允许任何人读写，请在部署完成并测试后尽快收紧权限。

---

## 在 Vercel 上部署（推荐）
1. 在 https://vercel.com/ 登录并选择 "Import Project" -> 从 GitHub 导入仓库 `williamcowper/potential-octo-spoon`。
2. 在导入流程中，选择分支 `feature/echarts-firestore`。
3. 在 Environment Variables (环境变量) 中添加以下变量（来自你在 Firebase 控制台的 Web app 配置）：
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID
4. 完成导入，Vercel 会自动构建并部署站点。

部署后，你将得到一个公共 URL，任何人打开该页面即可查看和编辑图表（受 Firestore 规则约束）。

---

## 如果你不想用 Firebase（仅本地方案）
- 我也可以把应用改为仅使用 localStorage（数据只保存在浏览器），但这不满足你要求的“任何人打开都可修改”的需求。

---

## 我已做的工作（总结）
- 在仓库创建分支 `feature/echarts-firestore` 并提交最小 React + Vite 项目。
- 实现了一个 Charts 页面用于 CRUD 图表并实时预览。

---

如果你愿意，我可以接下来把项目连接到 Vercel 并完成部署，但我需要你把该仓库在 Vercel 导入（或者邀请我的账号为 collaborator 或提供一个一次性 Vercel deploy token）。

你之前授权我向仓库推送（已完成）。接下来的两种方式：

A) 你在 Vercel 控制台导入仓库并设定 Firebase 环境变量 -> 我将帮助你检查部署并把最终 URL 发给你。

B) 或者，你把 Vercel 项目邀请我为 collaborator（或提供一次性 token），我可以替你完成导入部署并立即把 URL 发给你。

我建议你选择 A（你仅需在 Vercel 控制台点击 Import 并粘入 Firebase 配置）。如果你希望我替你完成，请发一条消息告诉我并提供邀请/token（如果你愿意）。

---

如果你现在希望我继续自动完成 Vercel 部署，请回复并告诉我是否要使用我的协助（我会说明如何邀请或发送 token）。否则我会等待你在 Vercel 上点击 Import 并把部署 URL 发回我以便我验证并继续后续改进。
