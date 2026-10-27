# Embodied Atlas / 具身预训练数据图谱

可在 GitHub Pages **零构建部署**的静态数据目录。包含 **117 条**候选数据与研究工具记录（43 个机器人数据条目、22 个第一视角、27 个视频语言、14 个图文空间、11 个工具/目录）。数据来源于《Embodied Pretraining Dataset Catalog》（2026-10-27），补充部分项目链接，并依据原项目页面修正了 RoboSet / FMB 的数量与 Gen-HumanEgo 的分类。

## 功能

- 关键词搜索（数据集名、模态、语言粒度、任务、开放状态）
- 按类别、S/A/B、时间标注粒度、可获取性筛选
- 卡片/列表展示与排序；详尽的条目侧弹窗
- 每个条目的来源链接以及可确认的项目页 / Blog / Code
- 本地收藏、四数据集并排对比、复制单条直达链接
- 导出筛选结果 CSV、明暗主题、手机端响应式；无外部依赖
- URL 参数保留当前筛选条件，便于团队分享

> **研究注意**：公开规模不等于去重后的可用训练量。“公开”只代表原始目录中的获取状态，不表示商用许可已经完成核验。一部分条目是工具、索引、衍生标注，彼此有数据重叠。

## 发布到 GitHub Pages（推荐）

1. 在 GitHub 创建一个新 **Public** 仓库，例如 `embodied-pretraining-atlas`。仓库名可以自行决定。
2. 将本目录**内的全部文件**上传到仓库根目录，包含 `.github/workflows/deploy.yml`、`.nojekyll`、`assets/` 和 `data/`。
3. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
4. 推送到 `main` 分支后，Actions 工作流会部署网站。
5. 部署网址一般是 `https://<你的用户名>.github.io/<仓库名>/`。请以 GitHub Pages 实际显示的网址为准。

> 注意：GitHub Pages 网站默认公开，使用前避免提交未公开数据、内部文件或敏感信息。

### 本地预览

可以直接双击打开 `index.html`，所有查询及 UI 均不依赖远程服务。也可以运行：

```bash
python -m http.server 8080
# open http://localhost:8080
```

## 日常更新数据

**只修改 `data/catalog.csv`**，保持现有列名不变；然后在仓库根目录执行：

```bash
python tools/build_data.py
```

该脚本生成 `data/datasets.js`。提交 CSV 和 `datasets.js` 两个文件到 GitHub，Pages 会自动更新。不需要 npm、不需要数据库。

源表中的 `来源URL` 作为每条数据的默认外部入口。额外项目页、博客与代码 URL 在 `tools/build_data.py` 的 `EXTRA` 字典内维护；如果额外链接未经确认，请不要填入猜测值。

### 原始 CSV 表头

`类别, 数据集, 公开规模（口径见备注）, 训练可用信号, 语言/时间粒度, 建议用途, 优先级, 下载状态, 许可/约束, 重叠/包含关系, 注意事项, 来源URL`

### 收录口径

- 机器人 43；第一视角 22；视频 27；图文 14；工具/目录 11，共 117 条。
- S/A/B 是面向统一 V/L/A 预训练与 Dense Annotation 的工作优先级，并非统一质量评分。
- 标签 `逐帧 / Subtask / Clip / Task` 是从描述文本自动归类的**浏览筛选标签**，不能替代源数据字段校验。
- 如果来源为 Hugging Face 主页、GitHub 仓库或专题汇总站，链接为公开入口，而非一定可直接下载的独立数据集。
- 对 FineVLA / RoboInter / Open X-Embodiment 等二次整合数据，务必以 source episode ID 去重。

## 项目结构

```
index.html                  # 主页面
assets/style.css            # 响应式设计
assets/app.js               # 筛选、详情、比较、收藏逻辑
data/catalog.csv            # 可编辑的源表
data/datasets.js            # 自动生成的前端数据
tools/build_data.py         # CSV → JavaScript 数据
.github/workflows/deploy.yml # GitHub Actions Pages 部署
.nojekyll                   # Pages 静态资源配置
```

站点不采集任何用户数据，收藏记录只保存在当前浏览器 localStorage。全站源码可直接修改或扩展。
