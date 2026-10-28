# Embodied Atlas / 具身预训练数据图谱

可在 GitHub Pages 零构建部署的静态研究目录，共 **117 条资源记录**。原目录日期为 2026-10-27，标注分类核查更新于 **2026-10-28**。

本轮覆盖全部 117 条：**95 条公开资料支持、10 条部分确认、12 条工具/目录/环境入口**。这里的“支持”指官方项目文档、数据卡、论文或 schema 支持所列分类，不代表下载解析全部原始样本，也不保证每个样本具备所有字段。

- [逐项核查报告与待确认清单](ANNOTATION_AUDIT.md)
- [完整核查 CSV](data/annotation_audit.csv)：适合表格审阅，含内容×时间配对、证据链接、对齐方式、覆盖范围和待确认项
- [分类词表](data/annotation_taxonomy.json) / [117 条可编辑核查记录](data/annotation_reviews.json)

117 不是 117 套独立且可累加的数据集：其中有 92 个数据集条目、7 个衍生数据条目、6 个多源集合、3 个工具、8 个目录/来源关系及 1 个环境基准入口；数据集条目之间仍可能重叠。

## 分类规则

内容与时间始终作为实际配对保存，例如 `stage_text × segment`。逐帧动作加阶段语言不能组合成不存在的逐帧语言。网页不再从摘要或“建议用途”关键词猜测分类。

时间区分逐帧/时间步、明确 1 Hz、时间点/抽样帧、事件区间、独立短片、整轨迹/全视频、未定位步骤序列、静态图像和交错图文文档。阶段标签即使存入每一帧，仍按阶段语义归类；详细采样与存储信息单列说明。

内容区分机器人控制、手持夹爪代理运动、人体运动、动作类别、任务/阶段语言、结构化技能、帧级语言、视觉描述、语音转写、下一步语言、剩余计划、空间几何、未来轨迹、成败进度、奖励、QA、静态描述和交错图文。动作类名不是自由文本，人体姿态不是机器人动作。

本轮没有证据足以把任意一条列为固定 1 Hz 标注或严格的单步下一步语言；筛选结果可以为空。工具能够产生某种标注，不代表该工具自身发布了这种训练集。空 pairs 也可能表示只确认原始视频和技术元数据，不能当成全量无标注的证明。

网页按已知子集的并集展示标签，具体限制见详情的“覆盖范围”。筛选不同维度取交集，同组多选取并集；模态勾选要求全部满足。A 专指机器人动作/状态；代理和人体运动在各自内容标签下筛选。原目录信号、粒度、规模和许可作为对照保留，规模/许可没有进行本轮全量审计。

## 本轮修正

- FineART、RoboCasa365 等的阶段文本与逐帧控制分开；Ego4D narration 时间点与事件区间分开；移除 Goal-Step 的错误“完成进度”解释。
- ASR、动作类别、视觉 caption、QA、空间定位和交错文档分别分类，补充抽样帧/未定位步骤序列等尺度。
- ProcCorpus 和 DeMiAn 改为已发布的衍生数据；社区主页、数据索引和未指定演示版本的环境不参与标注筛选。
- 50 Salads/Breakfast 改到外部视角视频类，BVD-I 改到图像类；修正 ShareGPT4Video、ViTT、RoboPoint、Visual Genome 等来源入口。
- 修复筛选 CSV 的表头/数据列错位，导出包含完整证据和待确认项；独立 HTML 预览包含相同分类数据与可下载核查表。

## 功能

关键词搜索、类别/时间/内容/证据/模态/优先级筛选、卡片与列表、详情、收藏、四项对比、筛选 CSV 导出、明暗主题、URL 分享。纯静态资源，不依赖外部脚本或数据库。

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

## 更新与检查

在本目录运行：

```bash
python tools/build_data.py
python tools/build_reviews.py
node tools/check_annotations.js
python tools/build_preview.py
```

- `data/catalog.csv`：基础规模、来源链接与原目录文本。保留现有表头。
- `data/annotation_reviews.json`：分类事实来源，每条用目录名称作键。修改 pairs 时必须补充依据、范围或待确认字段。`categoryOverride` 纠正浏览类别，保留原目录类别作对照。
- `data/annotation_taxonomy.json`：统一的内容/时间/证据词表；浏览器与报告共享定义。
- `tools/build_data.py`：生成 `data/datasets.js`。补充链接在 `EXTRA` 中维护。
- `tools/build_reviews.py`：验证 117 条覆盖、枚举、重复配对、证据和模态约束，生成 `facet_reviews.js`、`annotation_taxonomy.js`、`annotation_audit.csv` 与 `ANNOTATION_AUDIT.md`。不要手改这些生成文件。
- `tools/check_annotations.js`：无外部依赖，执行页面实际脚本和事件处理器，检查配对筛选、分类、模态、详情及 CSV 列对齐；这是脚本集成检查，不是浏览器视觉截图测试。
- `tools/build_preview.py`：在上级目录生成 `Embodied_Atlas_Standalone_Preview.html`，内嵌全部数据、分类脚本和核查附件，可离线打开。

发布时提交源 CSV/JSON 和全部生成文件。仅修改 CSV 不会自动改变核查标签，也不会重新引入关键词推断。

## 项目结构

```text
index.html                     主页面
assets/app.js                  筛选、详情、对比与导出
assets/facets.js                绑定显式核查记录，不自动推断
assets/style.css               样式
data/catalog.csv               基础目录
data/annotation_reviews.json   117 条人工整理的来源核查
data/annotation_taxonomy.json  分类定义
data/annotation_audit.csv      生成的完整核查表
ANNOTATION_AUDIT.md             生成的逐项核查报告
tools/                         生成与检查脚本
.github/workflows/deploy.yml    静态 Pages 部署
```

收藏记录仅存于本地浏览器。此目录未执行发布；现有部署工作流保持不变。
