# 117 条资源的标注核查记录

核查日期：2026-10-28。覆盖全部目录条目，依据官方项目页、数据卡、论文和公开 schema；没有下载并解析全部原始样本。此处核查的是标注内容及时间尺度，不是许可证、全量质量、可下载规模或去重审计。

117 是资源记录数，并非 117 套互不重叠的独立数据集。

状态：公开资料支持 95；部分确认 / 待核字段 10；工具 / 目录 / 环境 12。

性质：衍生 / 二次标注 7；数据集 92；标注工具 3；多源混合集合 6；目录 / 来源关系 8；环境 / 基准入口 1。

分类是“内容 × 时间”的实际配对，不能取两个独立标签集合的笛卡尔积。集合/衍生集列的是已知子集的并集，不保证每个样本具备所有字段。原目录文本保留作对照，不参与自动推断。

关键修正：动作采样率不等于语言频率；阶段文字广播到帧仍为阶段；人体/手持夹爪运动与机器人动作分开；ASR、动作类名与视觉描述分开；工具/目录不继承下游标注；ProcCorpus 与 DeMiAn 按已发布衍生数据收录。

本轮没有足够证据将任何条目列为固定 1 Hz 标注或严格的单步 next_step 语言。空筛选结果是保守证据结论，不是宣称这类数据不存在。

## 时间尺度定义

| 编码 | 名称 | 判定规则 |
|---|---|---|
| frame | 逐帧 / 时间步 | 标签针对各帧或控制时间步；不承诺固定 Hz，也不表示语言每帧独立更新。 |
| second | 固定 1 Hz 标注 | 仅用于官方明确每秒一次的标注；视频抽帧率、特征率和秒单位时间戳均不足以成立。 |
| point | 时间点 / 抽样帧 | 有单个时间点或选定帧索引，无完整区间含义；不假设全帧覆盖。 |
| segment | 事件 / 阶段区间 | 视频或轨迹内部有意义的起止区间；终点可由下一起点推得。阶段标签广播到帧仍归此类。 |
| clip | 独立短片整体 | 标签描述整个发布的短视频 clip；即使附源视频裁剪边界，也不代表内部动作分段。 |
| episode | 整轨迹 / 全视频 | 完整任务轨迹或未分割源视频的整体标注；区别于其内部事件和独立短片。 |
| sequence | 步骤序列（未定位） | 有序步骤文字，但没有已确认的逐步骤时间边界。 |
| static | 静态图像 | 单图/多图样本的空间或语言监督，没有可用视频时间轴。 |
| document | 交错图文文档 | 按阅读顺序组织的文档图文；不是操作时间序列。 |

## 标注内容定义

| 编码 | 名称 | 判定规则 |
|---|---|---|
| action_state | 机器人动作 / 状态 | 实机或仿真机器人的控制量、关节/末端状态；不含人体和手持代理采集器。 |
| effector_motion | 手持夹爪 / 代理运动 | UMI、Stick 等代理采集设备的末端轨迹/开合；需适配后才能成为机器人控制。 |
| human_motion | 人体 / 手部运动 | 人手、身体、头部姿态或关键点；不赋予机器人 A 模态。 |
| action_class | 动作 / 任务类别 | 离散动作类别、模板或任务 ID；不等同实例级自然语言指令。 |
| task_text | 整体任务语言 | 完整目标/任务的自然语言指令或说明；任务在长视频内部时可对应 segment。 |
| stage_text | 阶段 / 步骤语言 | 子任务或操作步骤文字；按实际边界分 segment，未定位列表分 sequence。 |
| stage_struct | 技能 / 结构化阶段 | 步骤 ID、primitive/skill、层级或程序结构；不自动算自由语言。 |
| dense_language | 官方帧级语言 | 官方明确按帧的语言标注；是否连续覆盖或每帧新句仍需查文件。 |
| observed_caption | 视觉内容 / 行为描述 | 对可见视频内容的文字描述；覆盖全片、事件或抽样帧分别分类。 |
| asr | 语音字幕 / 对话转写 | 识别或人工转写的口语；不自动视为可见动作的描述。 |
| next_step | 下一步语言 | 显式预测/规定当前状态之后单一步骤的语言标签；训练用途不能作为证据。 |
| future_plan | 剩余步骤 / 规划语言 | 当前观察下的剩余操作序列或计划；不等同单步下一动作。 |
| spatial | 空间定位 / 几何关系 | 点、框、掩码、对象姿态、接触或有对象绑定的空间关系；单纯物体名称不算。 |
| future_trace | 未来运动轨迹 | 相对当前观察的未来坐标轨迹；不是下一步自然语言。 |
| progress_failure | 进度 / 成败 / 错误 | 完成度、结果标记、错误事件或原因；延续标记不等于成功。 |
| reward | 奖励 / 评价分数 | 数值 reward 或评价分数；与错误原因文字区分。 |
| qa | 问答 / 指令对话 | 明确的问题与答案或多轮指令对话；提到位置不代表输出坐标。 |
| image_text | 图像 / 区域描述 | 静态图像或区域的 caption、alt-text；不涵盖所有含文字的图像任务。 |
| interleaved | 交错图文内容 | 多图与文本按文档组织，不要求图句一一对应。 |

## 待确认项

- **FineVLA-Data**：核对 FineVLA-Data 发布文件中的步骤边界；确认后才能由未定位步骤序列升级为 segment。
- **RoboMIND v1.2 / v2**：下载核对 JSON 的帧覆盖率、重复区间及 v2 schema；目前不能确认独立逐帧新句、1 Hz 或下一步/进度字段。
- **BEHAVIOR-1K 2026 challenge demos**：核对 meta/tasks.parquet 和数据 features，补充任务文本及任何新增阶段字段。
- **BEHAVIOR-1K 2025 challenge demos**：检查任务表实际文本及 annotation 列的语义和覆盖。
- **RH20T**：核对任务描述文件；RoboInter/FineVLA 二次语言不可回填成 RH20T 原生标注。
- **RoboTwin 2.0 unified**：核对该转换版 meta/info.json 和 tasks.jsonl，并确认与 RoboTwin 2.0 的版本对应。
- **NVIDIA GR00T X-Embodiment Sim**：检查具体包的 annotation.human.action.task_description 与 tasks 表，再增加 task_text。
- **RLBench**：确认具体演示下载版本是否保存分割掩码；目前不把配置可生成的空间观测算作已发布标注。
- **EgoSuite-Open100K**：分别核对 EgoDemo/EgoStandard 的已发布 features、语义文本及时间边界；不将规划中的语义层记为已可用。
- **VideoCC3M/12M**：确认 VideoCC12M 的具体版本、下载地址与样本口径；scenic 代码总入口不能证明该版本存在。

## 逐条核查

### 001. RoboInter-Data

**衍生 / 二次标注 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频；阶段 / 步骤语言 @ 事件 / 阶段区间；技能 / 结构化阶段 @ 事件 / 阶段区间；空间定位 / 几何关系 @ 逐帧 / 时间步；未来运动轨迹 @ 逐帧 / 时间步；空间定位 / 几何关系 @ 时间点 / 抽样帧

官方 schema 明列 action/state、instruction_add、substask、primitive_skill、time_clip、目标框及未来 10 步夹爪像素轨迹；contact_frame 是接触事件索引。阶段文字按语义区间分类，不能推出逐帧新句或下一步语言。

**对齐与采样：** IR 可按 frame_id 读取；阶段标签可逐帧广播；掩码在 Annotation_raw 中单独存储。

**覆盖范围：** 含动作的 LeRobot 版与 annotation-only LMDB 的内容不同。

**依据：** [来源 1](https://huggingface.co/datasets/InternRobotics/RoboInter-Data)

**原目录粒度（保留对照）：** 逐帧: task/skill/语言/轨迹/接触

### 002. RoboInter-VQA

**衍生 / 二次标注 · 公开资料支持**

**分类：** 问答 / 指令对话 @ 静态图像；空间定位 / 几何关系 @ 静态图像；未来运动轨迹 @ 静态图像

公开 schema 以 images + conversations + gt 组织图像问答，包含空间目标、未来轨迹及规划任务；不能因源数据是机器人视频就标成逐帧控制数据。规划问答不等于固定频率下一步语言。

**依据：** [来源 1](https://huggingface.co/datasets/InternRobotics/RoboInter-VQA)

**原目录粒度（保留对照）：** 时空推理问答

### 003. FineART

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频；阶段 / 步骤语言 @ 事件 / 阶段区间

全任务文本与带起始时间的子任务列表分开；language_persistent 在各帧重复列表，子任务终点由下一起点或轨迹末尾确定。模型预测下一子任务是训练用途，不是原生每秒新指令。

**对齐与采样：** 机器人数据 30 fps；语言按子任务边界更新。

**依据：** [来源 1](https://huggingface.co/datasets/lerobot/FineART)

**原目录粒度（保留对照）：** 连续子任务时间戳；全量人工

### 004. FineVLA-Data

**衍生 / 二次标注 · 部分确认 / 待核字段**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频；阶段 / 步骤语言 @ 步骤序列（未定位）

官方说明 47,159 条轨迹、220,606 个步骤及十维细粒度过程描述；可确认有序步骤，公开项目页尚不足以确认每步 start/end 时间字段。接触位置的文字描述不自动算坐标标注。

**待确认：** 核对 FineVLA-Data 发布文件中的步骤边界；确认后才能由未定位步骤序列升级为 segment。

**依据：** [来源 1](https://finevla.xlang.ai/)

**原目录粒度（保留对照）：** step级十维描述含approach/contact

### 005. AgiBot World 2026

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频；阶段 / 步骤语言 @ 事件 / 阶段区间；技能 / 结构化阶段 @ 事件 / 阶段区间；空间定位 / 几何关系 @ 事件 / 阶段区间；进度 / 成败 / 错误 @ 事件 / 阶段区间；进度 / 成败 / 错误 @ 时间点 / 抽样帧

tasks.jsonl 给整体任务；Task Frame 与 instruction_segments 给子任务/技能区间；bbox 也是带区间的目标标注。is_result_succeed 与 Error/Success/Intervention Frame 支持结果和事件标注。

**对齐与采样：** 区间边界以帧索引存储；错误事件可为单帧。

**覆盖范围：** 精细字段为可选层，不能假设所有 episode 都齐全。

**依据：** [来源 1](https://huggingface.co/datasets/agibot-world/AgiBotWorld2026)

**原目录粒度（保留对照）：** task/subtask/skill/错误帧

### 006. RoboMIND v1.2 / v2

**数据集 · 部分确认 / 待核字段**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频；官方帧级语言 @ 逐帧 / 时间步

数据卡明确 v1.1/v1.2 的 language_description_annotation_json 是 frame-level fine-grained instructions；HDF5 有动作和状态。v2 指向另一个发布集合，不将 v1.2 的覆盖范围自动外推到全部 v2。

**覆盖范围：** 帧级语言结论依据 v1.1/v1.2 更新说明。

**待确认：** 下载核对 JSON 的帧覆盖率、重复区间及 v2 schema；目前不能确认独立逐帧新句、1 Hz 或下一步/进度字段。

**依据：** [来源 1](https://huggingface.co/datasets/x-humanoid-robomind/RoboMIND)

**原目录粒度（保留对照）：** 官方说明提供帧级language JSON

### 007. Galaxea Open-World

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频；阶段 / 步骤语言 @ 事件 / 阶段区间

官方卡说明中英双语细粒度 subtask language，LeRobot schema 分离状态、动作与任务元数据。子任务语言归阶段，不按机器人采样率升级为独立帧语言。

**覆盖范围：** 细粒度覆盖按各任务压缩包核对。

**依据：** [来源 1](https://huggingface.co/datasets/OpenGalaxea/Galaxea-Open-World-Dataset)

**原目录粒度（保留对照）：** 细粒度subtask语言

### 008. RoboCasa365

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频；阶段 / 步骤语言 @ 事件 / 阶段区间；技能 / 结构化阶段 @ 事件 / 阶段区间

官方 subtask_idx/name/stage/lang 按 timestep 存储；同一 subtask_idx 的连续帧构成一个语义阶段。标签由仿真状态生成，不是下一步推理句。

**对齐与采样：** subtask_lang 与 actions/states 逐帧对齐，但阶段内重复。

**覆盖范围：** 附加标签生成流程覆盖 300 个 composite tasks；标准 pretrain_human300 / leaderboard 数据不能视为已自带这些标签。

**依据：** [来源 1](https://robocasa.ai/docs/build/html/use_cases/subtask_annotations.html) · [来源 2](https://robocasa.ai/)

**原目录粒度（保留对照）：** 2026更新: 每帧subtask/atomic skill/stage

### 009. BEHAVIOR-1K 2026 challenge demos

**数据集 · 部分确认 / 待核字段**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步

2026 卡确认 LeRobot v3、100 tasks、30 fps 演示；仅凭任务数和格式不能确认自然语言内容或细粒度 annotation 列。

**待确认：** 核对 meta/tasks.parquet 和数据 features，补充任务文本及任何新增阶段字段。

**依据：** [来源 1](https://huggingface.co/datasets/behavior-1k/2026-challenge-demos)

**原目录粒度（保留对照）：** episode / annotations；细粒度需检查

### 010. BEHAVIOR-1K 2025 challenge demos

**数据集 · 部分确认 / 待核字段**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步

2025 数据卡列出 30 fps、state/action 与 task_index；任务索引本身不足以证明自然语言字段，亦不证明阶段语言。

**待确认：** 检查任务表实际文本及 annotation 列的语义和覆盖。

**依据：** [来源 1](https://huggingface.co/datasets/behavior-1k/2025-challenge-demos)

**原目录粒度（保留对照）：** episode language

### 011. AgiBot World Beta

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频；阶段 / 步骤语言 @ 事件 / 阶段区间；技能 / 结构化阶段 @ 事件 / 阶段区间

官方 task_info JSON 文档包含任务名，以及 action_config 中带 start/end 的原子技能和语言指令。原目录只写任务级遗漏了文档中的步骤层；key_frame 的详细字段需单独核对。

**覆盖范围：** 按 schema 支持分类，不保证每条轨迹 action_config 非空；Alpha 卡仍含历史语言补全 TODO。

**依据：** [来源 1](https://huggingface.co/datasets/agibot-world/AgiBotWorld-Beta)

**原目录粒度（保留对照）：** 整体task为主；部分精细字段

### 012. AgiBot World Alpha

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频；阶段 / 步骤语言 @ 事件 / 阶段区间；技能 / 结构化阶段 @ 事件 / 阶段区间

官方 task_info JSON 文档包含任务名，以及 action_config 中带 start/end 的原子技能和语言指令。原目录只写任务级遗漏了文档中的步骤层；key_frame 的详细字段需单独核对。

**覆盖范围：** 按 schema 支持分类，不保证每条轨迹 action_config 非空；Alpha 卡仍含历史语言补全 TODO。

**依据：** [来源 1](https://huggingface.co/datasets/agibot-world/AgiBotWorld-Alpha)

**原目录粒度（保留对照）：** 任务级

### 013. RoboInter-Tool（非数据集）

**标注工具 · 工具 / 目录 / 环境**

**分类：** 不适用

RoboInter 的半自动标注代码与工具入口；工具输出能力不能算已经发布的一份额外训练集。数据另见 RoboInter-Data/VQA。

**依据：** [来源 1](https://huggingface.co/datasets/InternRobotics/RoboInter-Data) · [来源 2](https://github.com/InternRobotics/RoboInter)

**原目录粒度（保留对照）：** 逐帧IR工具

### 014. FineVLA-Tool（非数据集）

**标注工具 · 工具 / 目录 / 环境**

**分类：** 不适用

FineVLA 数据构建工具：统一源数据、筛选及十维步骤描述；不重复计为数据集，也不把工具能力加入数据标注筛选。

**依据：** [来源 1](https://finevla.xlang.ai/) · [来源 2](https://github.com/xlang-ai/FineVLA)

**原目录粒度（保留对照）：** 步骤十维+人工核验规范

### 015. Open X-Embodiment

**多源混合集合 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频

OXE 是多来源 RLDS 轨迹集合；可确认逐步控制和带任务语言的子集，不能认为所有子集共享语言密度、动作语义或采样率。

**覆盖范围：** 这些标签为已知子集的并集，不是全部成员的共有字段。

**依据：** [来源 1](https://github.com/google-deepmind/open_x_embodiment)

**原目录粒度（保留对照）：** 多为episode-level

### 016. DROID

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频

DROID 的语言按 episode 描述任务；官方更新说明约 95% 成功轨迹各有三条文本。机器人控制序列不等于逐帧语言。

**覆盖范围：** 三条任务文本是成功轨迹子集的覆盖口径。

**依据：** [来源 1](https://droid-dataset.github.io/)

**原目录粒度（保留对照）：** episode级; 成功片段有3条caption

### 017. BridgeData V2

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频

官方明确每条轨迹配一条自然语言任务指令；与视觉和控制序列配对，不包含由此可推导的阶段或下一步语言标签。

**依据：** [来源 1](https://rail-berkeley.github.io/bridgedata/)

**原目录粒度（保留对照）：** episode instruction

### 018. RH20T

**数据集 · 部分确认 / 待核字段**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步

官方列出同步视觉、力、音频、动作与对应人类示范。任务列表可用于区分任务，但本次资料不足以确认原始 RH20T 每 episode 的自然语言字段。

**待确认：** 核对任务描述文件；RoboInter/FineVLA 二次语言不可回填成 RH20T 原生标注。

**依据：** [来源 1](https://rh20t.github.io/)

**原目录粒度（保留对照）：** episode/task为主

### 019. InternData-A1

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频

官方提供 LeRobot task 表、episode 数据及 30 fps 的 state/action features；项目是混合仿真与真实数据，原目录仅写仿真不完整。未确认步骤语言。

**覆盖范围：** 各 embodiment/schema 可能不同。

**依据：** [来源 1](https://huggingface.co/datasets/InternRobotics/InternData-A1)

**原目录粒度（保留对照）：** task级

### 020. RoboTwin 2.0 unified

**数据集 · 部分确认 / 待核字段**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步

指定 lerobot/robotwin_unified 仓库预览显示 30 fps ALOHA 演示，但无 dataset card；不能把 RoboTwin 论文的所有语言能力自动转成此转换版的字段。

**待确认：** 核对该转换版 meta/info.json 和 tasks.jsonl，并确认与 RoboTwin 2.0 的版本对应。

**依据：** [来源 1](https://huggingface.co/datasets/lerobot/robotwin_unified)

**原目录粒度（保留对照）：** task级

### 021. RoboCasa 2024

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频

2024 RoboCasa 论文描述任务指令与人类/生成演示；本条锁定 2024 数据，不继承 365 后续新增的 subtask 标注流程。

**覆盖范围：** 2024 发布版本。

**依据：** [来源 1](https://robocasa.ai/assets/robocasa_rss24.pdf)

**原目录粒度（保留对照）：** task级

### 022. RoboMimic

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；动作 / 任务类别 @ 整轨迹 / 全视频；奖励 / 评价分数 @ 逐帧 / 时间步

原生 robomimic HDF5 是按任务组织的 states/actions/rewards/dones；env_name 为任务标识。框架后来支持 language-conditioned learning 不证明原始各数据集自带自然语言。

**依据：** [来源 1](https://robomimic.github.io/docs/datasets/overview.html)

**原目录粒度（保留对照）：** task级

### 023. MimicGen

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；动作 / 任务类别 @ 整轨迹 / 全视频

MimicGen 从少量示范生成按任务组织的控制轨迹；任务名称、生成用子任务分解不等于发布了自然语言阶段注释。

**依据：** [来源 1](https://mimicgen.github.io/) · [来源 2](https://robomimic.github.io/docs/datasets/overview.html)

**原目录粒度（保留对照）：** task级

### 024. LIBERO

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频

LIBERO API 提供 task.language 与对应 BDDL 任务和演示；指令描述整个任务，即便任务含多个操作也不能直接当作有边界的阶段语言。

**依据：** [来源 1](https://github.com/Lifelong-Robot-Learning/LIBERO/blob/master/README.md?plain=1) · [来源 2](https://arxiv.org/abs/2306.03310)

**原目录粒度（保留对照）：** episode task

### 025. CALVIN

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；阶段 / 步骤语言 @ 事件 / 阶段区间

CALVIN 为连续 play 轨迹配短时语言目标；任务评测按多条指令组成长序列。动作 30 Hz，不意味着语言按 30 Hz 独立标注。

**覆盖范围：** 语言只覆盖选定的 play 区间。

**依据：** [来源 1](https://github.com/mees/calvin) · [来源 2](https://github.com/mees/calvin/blob/main/dataset/README.md)

**原目录粒度（保留对照）：** 多步episode/subgoal

### 026. TACO-Play

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频

公开 RLDS 转换 schema 含 natural_language_instruction 和多种控制动作；文字可由结构化任务同义表达生成。逐 step 存储不能推出逐 step 新语义。

**覆盖范围：** 此结论针对 OXE/TFDS 导出版；原始连续 play 的额外结构未统一。

**依据：** [来源 1](https://github.com/tensorflow/datasets/blob/master/docs/catalog/taco_play.md)

**原目录粒度（保留对照）：** 语言和游玩过程

### 027. Language Table

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频

官方按语言重标后的 episode 发布真实及仿真数据；人工与脚本语言来源不同。对原始连续交互中的片段而言，这些导出 episode 各有目标指令。

**依据：** [来源 1](https://github.com/google-research/language-table)

**原目录粒度（保留对照）：** episode task

### 028. RT-1 / Fractal

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频

任务自然语言作为条件，图像/动作按 timestep 配对；RT-1 的时间步控制频率不能作为语言标注频率。

**依据：** [来源 1](https://robotics-transformer1.github.io/)

**原目录粒度（保留对照）：** episode instruction

### 029. BC-Z

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频

官方说明按自然语言任务条件采集 100 类操控示范；自然语言或人类视频是任务条件，未说明步骤边界语言。

**依据：** [来源 1](https://sites.google.com/view/bc-z/home)

**原目录粒度（保留对照）：** episode task

### 030. RoboNet

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步

RoboNet 为机器人视觉与动作经验数据库，用于预测/控制；未发现可确认的自然语言监督，不从机器人任务用途推断语言标签。

**依据：** [来源 1](https://www.robonet.wiki/)

**原目录粒度（保留对照）：** action-level

### 031. RoboSet

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频

官方 RoboSet 页面除控制演示外明确说明 task 由 language instruction 定义；原目录仅 action-level 漏记任务语言。活动由多个 task 组成不证明帧级阶段边界。

**依据：** [来源 1](https://robopen.github.io/roboset/)

**原目录粒度（保留对照）：** action-level

### 032. ALOHA Unleashed

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；动作 / 任务类别 @ 整轨迹 / 全视频

公开项目描述按任务采集多相机双臂控制示范；可确认关节/控制轨迹与任务分组，不把网页的任务介绍当作数据文件中的自然语言标注。

**依据：** [来源 1](https://aloha-unleashed.github.io/)

**原目录粒度（保留对照）：** task-level

### 033. ALOHA Static

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；动作 / 任务类别 @ 整轨迹 / 全视频

公开项目描述按任务采集多相机双臂控制示范；可确认关节/控制轨迹与任务分组，不把网页的任务介绍当作数据文件中的自然语言标注。

**依据：** [来源 1](https://tonyzhaozh.github.io/aloha/)

**原目录粒度（保留对照）：** task-level

### 034. Mobile ALOHA

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；动作 / 任务类别 @ 整轨迹 / 全视频

公开项目描述按任务采集多相机双臂控制示范；可确认关节/控制轨迹与任务分组，不把网页的任务介绍当作数据文件中的自然语言标注。

**依据：** [来源 1](https://mobile-aloha.github.io/)

**原目录粒度（保留对照）：** task-level

### 035. Dobb-E

**数据集 · 公开资料支持**

**分类：** 手持夹爪 / 代理运动 @ 逐帧 / 时间步；动作 / 任务类别 @ 整轨迹 / 全视频

HoNY 训练集由手持 Stick 采集，官方列 30 fps RGB-D、6D 夹爪位姿和开合角；它是代理末端动作示范，不能写成机器人实测关节动作或自然语言任务集。

**覆盖范围：** Dobb-E 的 HoNY 数据；机器人部署结果另算。

**依据：** [来源 1](https://dobb-e.com/)

**原目录粒度（保留对照）：** task-level

### 036. FastUMI-100K

**数据集 · 公开资料支持**

**分类：** 手持夹爪 / 代理运动 @ 逐帧 / 时间步；动作 / 任务类别 @ 整轨迹 / 全视频

UMI 手持夹爪演示以 20 fps 发布，7D/14D 相对末端 state/action 和按任务组织目录。数值被命名 action 仍需区分手持代理轨迹和机器人执行命令。

**依据：** [来源 1](https://huggingface.co/datasets/fastumi100k/fastumi100k)

**原目录粒度（保留对照）：** task级

### 037. 10Kh RealOmni

**数据集 · 公开资料支持**

**分类：** 手持夹爪 / 代理运动 @ 逐帧 / 时间步；动作 / 任务类别 @ 整轨迹 / 全视频

Gen DAS Gripper 采集的 MCAP 提供同步夹爪开合、VIO eef_pose 和任务/技能目录。公开 topic 列表未建立自然语言事件字段。

**覆盖范围：** 不能将营销说明中的 annotations 直接解释成 dense language。

**依据：** [来源 1](https://huggingface.co/datasets/genrobot2025/10Kh-RealOmin-OpenData)

**原目录粒度（保留对照）：** 任务/事件部分描述

### 038. Gen-HumanEgo

**数据集 · 公开资料支持**

**分类：** 人体 / 手部运动 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频；阶段 / 步骤语言 @ 事件 / 阶段区间

官方列逐帧手部关键点/MANO，以及有时间边界的 video→task→subtask 语义标注。人体运动不是机器人控制；深度图是视觉模态，不单独等同于物体框标签。

**依据：** [来源 1](https://huggingface.co/datasets/genrobot2025/Gen-HumanEgo)

**原目录粒度（保留对照）：** Video→Task→Subtask 时间边界、语义描述

### 039. Galaxea / RoboCOIN source

**目录 / 来源关系 · 工具 / 目录 / 环境**

**分类：** 不适用

本条名称混合 Galaxea 与 RoboCOIN，来源实际是 FineVLA 的源数据统计表，不能定义唯一数据版本或公共标注 schema。保留为来源关系记录，不重复算一套细粒度标注。

**依据：** [来源 1](https://finevla.xlang.ai/)

**原目录粒度（保留对照）：** 部分细粒度

### 040. Open-H-Embodiment

**多源混合集合 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步

Open-H 是医疗/手术及超声机器人多来源集合；官方明确视频与运动学按行对齐，未保证全部来源有自然语言。H 不代表 humanoid 或 human 手部数据。

**覆盖范围：** 不同医疗来源独立核对语义字段。

**依据：** [来源 1](https://huggingface.co/datasets/nvidia/PhysicalAI-Robotics-Open-H-Embodiment)

**原目录粒度（保留对照）：** 分数据源

### 041. NVIDIA GR00T X-Embodiment Sim

**数据集 · 部分确认 / 待核字段**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；动作 / 任务类别 @ 整轨迹 / 全视频

官方提供跨机器人与人形仿真任务轨迹；按任务命名的数据包可确认任务身份，但不由任务名猜测逐步语言。

**待确认：** 检查具体包的 annotation.human.action.task_description 与 tasks 表，再增加 task_text。

**依据：** [来源 1](https://huggingface.co/datasets/nvidia/PhysicalAI-Robotics-GR00T-X-Embodiment-Sim)

**原目录粒度（保留对照）：** task-level

### 042. LeRobot SO-100 / SO-101 community

**目录 / 来源关系 · 工具 / 目录 / 环境**

**分类：** 不适用

SO-100/SO-101 community 只指社区数据族，当前入口是组织主页；不同上传者的任务、fps、语言和控制字段不可合并为同一数据集事实。

**依据：** [来源 1](https://huggingface.co/lerobot)

**原目录粒度（保留对照）：** 普遍episode task

### 043. ManiSkill2/3 trajectories

**多源混合集合 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；动作 / 任务类别 @ 整轨迹 / 全视频；进度 / 成败 / 错误 @ 逐帧 / 时间步

官方演示格式含 actions/env_states 和任务 env_id；success/fail 为可选逐 timestep 布尔值。可回放渲染 RGB-D 不等于原始压缩包有图像或自然语言。

**覆盖范围：** 主要依据 ManiSkill3 schema；v2/不同任务应分别检查。

**依据：** [来源 1](https://github.com/mani-skill/ManiSkill/blob/main/docs/source/user_guide/datasets/demos.md)

**原目录粒度（保留对照）：** task-level

### 044. RLBench

**多源混合集合 · 部分确认 / 待核字段**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频

RLBench 提供任务 variation 描述和逐步 Observation 演示，含视觉、机器人状态，分割/深度取决于观测配置。生成环境与某个固定下载版本应区分。

**覆盖范围：** 空间标签为配置可生成观测；具体演示包需检查保存配置。

**待确认：** 确认具体演示下载版本是否保存分割掩码；目前不把配置可生成的空间观测算作已发布标注。

**依据：** [来源 1](https://github.com/stepjam/RLBench)

**原目录粒度（保留对照）：** task-level

### 045. MetaWorld

**环境 / 基准入口 · 工具 / 目录 / 环境**

**分类：** 不适用

给出的官方仓库是 Meta-World 环境/benchmark，API 可产生 state/action/reward，但未指定任何固定演示数据发行版。排除出已发布标注筛选。

**依据：** [来源 1](https://github.com/Farama-Foundation/Metaworld)

**原目录粒度（保留对照）：** task-level

### 046. FMB functional manipulation

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；技能 / 结构化阶段 @ 事件 / 阶段区间

FMB 的 primitive 是每 timestep 一个字符串类别，动作/状态也逐步对齐；阶段内类别重复，属于结构化技能而非自然语言 caption。

**对齐与采样：** primitive 数组长度 N，与动作对齐；语义粒度为技能阶段。

**依据：** [来源 1](https://functional-manipulation-benchmark.github.io/dataset/)

**原目录粒度（保留对照）：** 逐时间步primitive字符串标签（非自然语言Caption）

### 047. HA-Ego-500

**数据集 · 公开资料支持**

**分类：** 阶段 / 步骤语言 @ 事件 / 阶段区间；技能 / 结构化阶段 @ 事件 / 阶段区间

官方描述含操作步骤时间边界、阶段与逐手状态；可见物体清单不是坐标框。平均步骤时长不构成固定每秒语言标注。

**依据：** [来源 1](https://ego500.humanarchive.ai/)

**原目录粒度（保留对照）：** 逐步，近秒级结构化标签

### 048. Ego4D Narrations

**数据集 · 公开资料支持**

**分类：** 视觉内容 / 行为描述 @ 时间点 / 抽样帧；视觉内容 / 行为描述 @ 事件 / 阶段区间

narration_pass 的 narration_text 关联单个 timestamp_sec/frame；summary_text 另有 start_sec/end_sec。点叙述与区间摘要分开，不把全部旁白当动作边界。

**依据：** [来源 1](https://ego4d-data.org/docs/data/annotations-schemas/)

**原目录粒度（保留对照）：** 动作叙述带时间戳

### 049. Ego4D Goal-Step

**数据集 · 公开资料支持**

**分类：** 整体任务语言 @ 事件 / 阶段区间；阶段 / 步骤语言 @ 事件 / 阶段区间；技能 / 结构化阶段 @ 事件 / 阶段区间

goal 与 step 都有 start/end 和描述/类别；长视频内部可有多个目标。is_continued 表示跨片段延续，不能解释为成功/失败或完成进度。

**依据：** [来源 1](https://github.com/facebookresearch/ego4d-goalstep)

**原目录粒度（保留对照）：** Goal→Step层级时间戳

### 050. Ego-Exo4D V2

**数据集 · 公开资料支持**

**分类：** 人体 / 手部运动 @ 时间点 / 抽样帧；视觉内容 / 行为描述 @ 时间点 / 抽样帧；阶段 / 步骤语言 @ 事件 / 阶段区间；技能 / 结构化阶段 @ 事件 / 阶段区间；进度 / 成败 / 错误 @ 时间点 / 抽样帧

Atomic descriptions 是带时间点的文字；keystep 有起止时间、步骤 ID 和说明；EgoPose 是人体/手部姿态。不同标注来自不同子集。 EgoPose 仅在有有效标注的 frame_number 给姿态，不承诺全帧；专家的良好执行/改进建议也是时间点。

**覆盖范围：** V2 包含 V1 延续和新增标注；并非每个视频都有所有层。

**依据：** [来源 1](https://docs.ego-exo4d-data.org/annotations/) · [来源 2](https://docs.ego-exo4d-data.org/annotations/atomic_descriptions/) · [来源 3](https://docs.ego-exo4d-data.org/annotations/keystep/) · [来源 4](https://docs.ego-exo4d-data.org/annotations/ego_pose/) · [来源 5](https://docs.ego-exo4d-data.org/annotations/proficiency_estimation/)

**原目录粒度（保留对照）：** keystep, narrations, 3D hand

### 051. EPIC-KITCHENS-100

**数据集 · 公开资料支持**

**分类：** 视觉内容 / 行为描述 @ 事件 / 阶段区间；动作 / 任务类别 @ 事件 / 阶段区间

动作 narration 配 start/end 时间及 verb/noun 类别；文字是区间动作描述，不是逐帧独立指令，也不含由此自动推导的下一步语言。

**依据：** [来源 1](https://github.com/epic-kitchens/epic-kitchens-100-annotations)

**原目录粒度（保留对照）：** 动作seg时间戳

### 052. EPIC-KITCHENS VISOR

**数据集 · 公开资料支持**

**分类：** 空间定位 / 几何关系 @ 时间点 / 抽样帧；空间定位 / 几何关系 @ 逐帧 / 时间步

VISOR 提供稀疏人工像素掩码及传播得到的密集掩码，并有手物交互关系；不继承 EPIC 全套自然语言，也不是机器人动作。

**对齐与采样：** 人工关键帧与插值/传播帧必须区分；密集层非逐帧人工标注。

**依据：** [来源 1](https://epic-kitchens.github.io/VISOR/)

**原目录粒度（保留对照）：** 逐帧/片段空间

### 053. HoloAssist

**数据集 · 公开资料支持**

**分类：** 人体 / 手部运动 @ 逐帧 / 时间步；动作 / 任务类别 @ 事件 / 阶段区间；语音字幕 / 对话转写 @ 事件 / 阶段区间；进度 / 成败 / 错误 @ 事件 / 阶段区间；视觉内容 / 行为描述 @ 整轨迹 / 全视频；视觉内容 / 行为描述 @ 事件 / 阶段区间

同步手/头姿态与视线；细粗粒度动作、对话及错误/干预类型标注。对话指导可用于辅助任务，但不等于统一每秒下一步指令。 原始 schema 还提供全视频 Narration 和区间 Action sentence。

**覆盖范围：** 对话转写归口语文本；错误标注以动作/干预区间为单位。

**依据：** [来源 1](https://holoassist.github.io/) · [来源 2](https://holoassist.github.io/data_links/README.html)

**原目录粒度（保留对照）：** 动作/错误/干预

### 054. EgoDex

**数据集 · 公开资料支持**

**分类：** 人体 / 手部运动 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频

30 Hz 头部、身体和手部 transforms；HDF5 attributes 的 llm_description/llm_description2 是轨迹描述，不是每帧新句。

**对齐与采样：** 姿态逐帧，自动语言在 episode 属性中。

**依据：** [来源 1](https://github.com/apple-aiml-research/ml-egodex)

**原目录粒度（保留对照）：** task+hand trajectory

### 055. Assembly101

**数据集 · 公开资料支持**

**分类：** 人体 / 手部运动 @ 逐帧 / 时间步；动作 / 任务类别 @ 事件 / 阶段区间；技能 / 结构化阶段 @ 事件 / 阶段区间

官方含粗细两级装配动作区间与 3D 手姿态；动作标签不能自动等同自然语言描述。项目另有错误检测标注发布，具体错误区间字段本次未纳入。

**依据：** [来源 1](https://assembly-101.github.io/)

**原目录粒度（保留对照）：** 细动作segment

### 056. EgoSuite-Open100K

**数据集 · 部分确认 / 待核字段**

**分类：** 人体 / 手部运动 @ 逐帧 / 时间步

官方分期发布姿态/视频，语义事件标注为选定子集；100K 是目标集合名，首批 10K 与全部规模不可混用。

**待确认：** 分别核对 EgoDemo/EgoStandard 的已发布 features、语义文本及时间边界；不将规划中的语义层记为已可用。

**依据：** [来源 1](https://huggingface.co/blog/LightwheelAI/egosuite-open100k)

**原目录粒度（保留对照）：** 选定子集有event labels

### 057. Egocentric-10K

**数据集 · 公开资料支持**

**分类：** 未确认本词表中的标注

官方 Egocentric-10K 卡的公开结构为视频及相机/工厂/时长等技术元数据；未找到可确认的任务句、动作区间或人体姿态标注。无标签表示本次未确认所列监督，不等于视频不可用。

**依据：** [来源 1](https://huggingface.co/datasets/builddotai/Egocentric-10K)

**原目录粒度（保留对照）：** 稀疏任务描述

### 058. Egocentric-100K

**数据集 · 公开资料支持**

**分类：** 未确认本词表中的标注

官方 Egocentric-100K 卡的公开结构为视频及相机/工厂/时长等技术元数据；未找到可确认的任务句、动作区间或人体姿态标注。无标签表示本次未确认所列监督，不等于视频不可用。

**依据：** [来源 1](https://huggingface.co/datasets/builddotai/Egocentric-100K)

**原目录粒度（保留对照）：** 标签稀疏/需重标

### 059. EgoVerse

**数据集 · 公开资料支持**

**分类：** 人体 / 手部运动 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频；阶段 / 步骤语言 @ 事件 / 阶段区间

官方 Zarr v3 schema 将 task_description 与 annotations 分开；后者为 text/start_idx/end_idx 的子步骤区间。头部和左右手运动按帧存储；不是逐帧独立语言。

**对齐与采样：** annotation_v1 使用半开帧区间 [start_idx,end_idx)。

**覆盖范围：** annotations 是可选层，允许为空、重叠或不覆盖整条轨迹；不能把规范要求视为全量覆盖。

**依据：** [来源 1](https://egoverse.ai/) · [来源 2](https://github.com/GaTech-RL2/EgoVerse/blob/main/CONTRIBUTING_DATA.md)

**原目录粒度（保留对照）：** task级为主

### 060. EgoSteer-Egocentric

**衍生 / 二次标注 · 公开资料支持**

**分类：** 人体 / 手部运动 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频

原始或估计的人手轨迹转换成统一表示；每 episode 有最多五条 LLM 生成指令。actions 中下一帧人体状态不是机器人实测动作；填充关节也不是有效机器人控制。

**对齐与采样：** 30 Hz 人体状态；语言按 episode。

**依据：** [来源 1](https://huggingface.co/datasets/EgoSteer/EgoSteer-Egocentric)

**原目录粒度（保留对照）：** 任务/运动表征

### 061. EgoSteer-RealWorld

**数据集 · 公开资料支持**

**分类：** 机器人动作 / 状态 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频；阶段 / 步骤语言 @ 步骤序列（未定位）

实机轨迹附三层指令：动作目标、手物描述和有序功能步骤。第三层是整条轨迹中的步骤列表，未确认逐步骤时间边界；不能升级为 segment。

**依据：** [来源 1](https://huggingface.co/datasets/EgoSteer/EgoSteer-RealWorld)

**原目录粒度（保留对照）：** task/干预

### 062. ARCTIC

**数据集 · 公开资料支持**

**分类：** 人体 / 手部运动 @ 逐帧 / 时间步；空间定位 / 几何关系 @ 逐帧 / 时间步

同步 3D 手部和可动对象网格/姿态及动态接触标签；人体运动与物体几何均按帧，没有据此确认任务语言。

**依据：** [来源 1](https://arctic.is.tue.mpg.de/)

**原目录粒度（保留对照）：** 手与物体3D动作

### 063. OakInk2

**数据集 · 公开资料支持**

**分类：** 人体 / 手部运动 @ 逐帧 / 时间步；空间定位 / 几何关系 @ 逐帧 / 时间步；整体任务语言 @ 整轨迹 / 全视频；阶段 / 步骤语言 @ 事件 / 阶段区间；技能 / 结构化阶段 @ 事件 / 阶段区间

全身/手部/物体运动与任务语言；program_info 的左右手区间映射 primitive，desc_info 按区间给 seg_desc。程序依赖图不等于下一步自然语言标签。

**覆盖范围：** 程序图/描述的覆盖依具体任务与发布文件。

**依据：** [来源 1](https://oakink.net/v2/) · [来源 2](https://github.com/oakink/OakInk2)

**原目录粒度（保留对照）：** 手物事件

### 064. HOI4D

**数据集 · 公开资料支持**

**分类：** 人体 / 手部运动 @ 逐帧 / 时间步；空间定位 / 几何关系 @ 逐帧 / 时间步；动作 / 任务类别 @ 事件 / 阶段区间

逐帧手/物体姿态与全景分割；动作分割是连续区间类别。没有证据把动作类名解释为自由语言旁白。

**对齐与采样：** 动作类别可广播到帧，其语义单位仍是动作区间。

**依据：** [来源 1](https://hoi4d.github.io/)

**原目录粒度（保留对照）：** 对象交互段

### 065. MECCANO

**数据集 · 公开资料支持**

**分类：** 动作 / 任务类别 @ 事件 / 阶段区间；空间定位 / 几何关系 @ 时间点 / 抽样帧

工业装配动作起止区间与类别；active-object 标注针对抽取帧提供边界框。未来动作预测是评测用途，不是下一步文字标注。

**覆盖范围：** 同步视线/深度流不单独归为机器人状态。

**依据：** [来源 1](https://github.com/fpv-iplab/MECCANO) · [来源 2](https://iplab.dmi.unict.it/legacy/MECCANO/)

**原目录粒度（保留对照）：** 动作时间戳

### 066. 50 Salads

**数据集 · 公开资料支持**

**分类：** 动作 / 任务类别 @ 事件 / 阶段区间

沙拉制作 RGB-D/加速度数据配动作分段类别；固定外部视角，不是第一人称。动作标签不是步骤自由文本。

**依据：** [来源 1](https://discovery.dundee.ac.uk/en/datasets/50-salads/)

**原目录粒度（保留对照）：** 细动作segment

### 067. Breakfast Actions

**数据集 · 公开资料支持**

**分类：** 动作 / 任务类别 @ 整轨迹 / 全视频；动作 / 任务类别 @ 事件 / 阶段区间

10 类整体早餐活动与 48 类细粒度动作单元；多外部相机拍摄，原目录第一视角分类不准确。类名不等同自然语言任务指令。

**依据：** [来源 1](https://serre.lab.brown.edu/breakfast-actions-dataset.html)

**原目录粒度（保留对照）：** 动作段

### 068. Action100M

**数据集 · 公开资料支持**

**分类：** 视觉内容 / 行为描述 @ 整轨迹 / 全视频；视觉内容 / 行为描述 @ 事件 / 阶段区间；视觉内容 / 行为描述 @ 时间点 / 抽样帧；阶段 / 步骤语言 @ 事件 / 阶段区间；动作 / 任务类别 @ 事件 / 阶段区间

层级节点含 start/end、parent/level、动作与描述，叶节点中间帧还有图像描述；root 是全视频摘要。层级密集语义不代表固定 1 Hz 语言。

**覆盖范围：** 公开仓库当前展示约 10% 预览，不能把总目标规模当完整已下载量。

**依据：** [来源 1](https://github.com/facebookresearch/Action100M)

**原目录粒度（保留对照）：** 层级片段及细节caption

### 069. LAION-BVD-V-55M

**数据集 · 公开资料支持**

**分类：** 视觉内容 / 行为描述 @ 独立短片整体

官方 BVD-V 为 captioned video clips；整 clip 的描述不等同内部阶段边界或逐帧文字。

**依据：** [来源 1](https://projects.laion.ai/bvd/download.html) · [来源 2](https://laion.ai/projects/)

**原目录粒度（保留对照）：** 场景级切片

### 070. LAION-BVD-I-300M

**数据集 · 公开资料支持**

**分类：** 图像 / 区域描述 @ 静态图像

BVD-I 是从视频取得的带描述图像；发布单元为图文对，不因来源是视频而变成带时序语言的轨迹。

**依据：** [来源 1](https://projects.laion.ai/bvd/download.html) · [来源 2](https://laion.ai/projects/)

**原目录粒度（保留对照）：** 帧级/scene-shift

### 071. LAION-BVD RAW

**数据集 · 公开资料支持**

**分类：** 未确认本词表中的标注

RAW 是原始视频池，与 BVD-V/I 标注衍生集分开；不能把衍生集 caption 回填为 RAW 自带标注。

**依据：** [来源 1](https://projects.laion.ai/bvd/download.html)

**原目录粒度（保留对照）：** 无密集过程标签

### 072. Panda-70M

**数据集 · 公开资料支持**

**分类：** 视觉内容 / 行为描述 @ 独立短片整体

发布单位为短视频与合成 caption；模型筛选/场景切分不构成动作阶段标签。

**依据：** [来源 1](https://snap-research.github.io/Panda-70M/)

**原目录粒度（保留对照）：** 短视频caption

### 073. HD-VILA-100M

**数据集 · 公开资料支持**

**分类：** 语音字幕 / 对话转写 @ 独立短片整体

100M 视频 clip 与语音识别文本配对；字幕对齐的是说话内容，不能当作人工视觉行为描述或细粒度阶段指令。

**依据：** [来源 1](https://github.com/microsoft/XPretrain/tree/main/hd-vila-100m)

**原目录粒度（保留对照）：** ~13s clip

### 074. InternVid / InternVid-10M

**数据集 · 公开资料支持**

**分类：** 视觉内容 / 行为描述 @ 独立短片整体

InternVid-10M-FLT JSONL 明列 videoID、timestamps、generated caption 与相似度；timestamps 定位整个裁剪单元，不提供内部连续阶段文本。

**覆盖范围：** 明确核查 10M-FLT；不同筛选版本不能重复累加。

**依据：** [来源 1](https://huggingface.co/datasets/OpenGVLab/InternVid)

**原目录粒度（保留对照）：** clip-level

### 075. HowTo100M

**数据集 · 公开资料支持**

**分类：** 语音字幕 / 对话转写 @ 事件 / 阶段区间

YouTube ASR 字幕按语音区间配视频；字幕与可见操作可能有时差，不能标为人工步骤/视觉叙述。

**依据：** [来源 1](https://www.di.ens.fr/willow/research/howto100m/)

**原目录粒度（保留对照）：** 字幕片段时间戳

### 076. VidChapters-7M

**数据集 · 公开资料支持**

**分类：** 阶段 / 步骤语言 @ 事件 / 阶段区间

用户章节标题与章节时间边界；章节是语义区间，不一定是机器人子任务，也不代表逐帧语言。

**依据：** [来源 1](https://antoyang.github.io/vidchapters.html)

**原目录粒度（保留对照）：** 层级长视频章节

### 077. YouCook2

**数据集 · 公开资料支持**

**分类：** 阶段 / 步骤语言 @ 事件 / 阶段区间；空间定位 / 几何关系 @ 时间点 / 抽样帧

烹饪过程有 start/end 及英文祈使步骤句；另外发布 YouCook2-BB 的采样帧物体框。框只属于附加层，原始步骤文本不含逐帧坐标。

**覆盖范围：** 步骤 Train/Val；Test 公开边界但文本不可一概视为可用；BB 是单独下载。

**依据：** [来源 1](https://youcook2.eecs.umich.edu/) · [来源 2](https://youcook2.eecs.umich.edu/download)

**原目录粒度（保留对照）：** 步骤起止秒数

### 078. FineVideo

**数据集 · 公开资料支持**

**分类：** 视觉内容 / 行为描述 @ 整轨迹 / 全视频；视觉内容 / 行为描述 @ 事件 / 阶段区间；语音字幕 / 对话转写 @ 事件 / 阶段区间；视觉内容 / 行为描述 @ 时间点 / 抽样帧

视频摘要和带 start/end timestamp 的场景描述；口语转写独立于视觉描述。场景情绪/主题等丰富字段不是逐秒行为标签。 narrativeProgression/keyMoments 另有时间点描述。

**依据：** [来源 1](https://huggingface.co/datasets/HuggingFaceFV/finevideo)

**原目录粒度（保留对照）：** 分场景及长文描写

### 079. Molmo2-Cap

**数据集 · 公开资料支持**

**分类：** 视觉内容 / 行为描述 @ 整轨迹 / 全视频；视觉内容 / 行为描述 @ 事件 / 阶段区间；视觉内容 / 行为描述 @ 时间点 / 抽样帧

video/merged caption 是全视频；clip_timestamps/captions 是子片段；frame_timestamps/indices 与 frame_captions 对应抽样帧。三层分开，不能把抽帧描述称全帧覆盖。

**依据：** [来源 1](https://huggingface.co/datasets/allenai/Molmo2-Cap)

**原目录粒度（保留对照）：** clip级、细节丰富

### 080. Molmo2-VideoPoint

**数据集 · 公开资料支持**

**分类：** 空间定位 / 几何关系 @ 时间点 / 抽样帧

点坐标与 timestamps 对应，另有对象查询与计数。视频重编码到 2 FPS 是取样网格，不证明每一帧都有标签，也不是每秒一次语言；VideoTrack 的轨迹不能移入本条。

**对齐与采样：** 稀疏点标注，2 FPS 视频时间网格。

**依据：** [来源 1](https://huggingface.co/datasets/allenai/Molmo2-VideoPoint)

**原目录粒度（保留对照）：** 时空指点

### 081. Molmo2-CapQA

**数据集 · 公开资料支持**

**分类：** 问答 / 指令对话 @ 整轨迹 / 全视频

官方实际名称为 Molmo2-VideoCapQA：全视频多选视觉问答；关于位置的问题不等于提供物体坐标标签。保留目录旧名便于兼容。

**依据：** [来源 1](https://huggingface.co/datasets/allenai/Molmo2-VideoCapQA)

**原目录粒度（保留对照）：** clip级理解

### 082. LLaVA-Video-178K

**数据集 · 公开资料支持**

**分类：** 视觉内容 / 行为描述 @ 独立短片整体；问答 / 指令对话 @ 独立短片整体

合成整段视频描述及开放/多选问答；1 FPS 抽帧用于模型输入，不是逐秒独立语言监督。

**依据：** [来源 1](https://huggingface.co/datasets/lmms-lab/LLaVA-Video-178K)

**原目录粒度（保留对照）：** 生成标注时1FPS看帧

### 083. LLaVA-OneVision-2 video data

**数据集 · 公开资料支持**

**分类：** 视觉内容 / 行为描述 @ 独立短片整体

视频子集提供多长度片段与描述；数据包中的独立图像/空间数据不自动赋予本视频条目逐帧空间标签。

**覆盖范围：** 仅本条所指 video data；30/60/180 秒等是片段长度，不是语言频率。

**依据：** [来源 1](https://huggingface.co/datasets/mvp-lab/LLaVA-OneVision-2-Data)

**原目录粒度（保留对照）：** 多尺度时间片段

### 084. ShareGPT4Video

**数据集 · 公开资料支持**

**分类：** 视觉内容 / 行为描述 @ 独立短片整体；视觉内容 / 行为描述 @ 时间点 / 抽样帧

官方 40K schema 有 timestamp、keyframe 和按 idx 的 captions，支持视频描述及关键帧描述；4.8M 扩充集与人工辅助 40K 不同。原目录误连到图像版 ShareGPT4V。

**对齐与采样：** 关键帧抽样不等于全帧语言。

**依据：** [来源 1](https://huggingface.co/datasets/ShareGPT4Video/ShareGPT4Video) · [来源 2](https://github.com/ShareGPT4Omni/ShareGPT4Video)

**原目录粒度（保留对照）：** 片段/单视频描述

### 085. ActivityNet Captions

**数据集 · 公开资料支持**

**分类：** 视觉内容 / 行为描述 @ 事件 / 阶段区间

每个事件描述有独立 start/end，可重叠且长短不一；dense caption 的 dense 指事件覆盖，不是固定采样频率。

**依据：** [来源 1](https://arxiv.org/abs/1705.00754)

**原目录粒度（保留对照）：** dense event segments

### 086. COIN

**数据集 · 公开资料支持**

**分类：** 动作 / 任务类别 @ 整轨迹 / 全视频；技能 / 结构化阶段 @ 事件 / 阶段区间

任务类别与带起止时间的步骤 ID/步骤名；规范化步骤名称归结构化阶段，不按自由撰写自然语言句子处理。

**依据：** [来源 1](https://coin-dataset.github.io/) · [来源 2](https://github.com/coin-dataset/annotation)

**原目录粒度（保留对照）：** instruction steps

### 087. CrossTask

**数据集 · 公开资料支持**

**分类：** 阶段 / 步骤语言 @ 步骤序列（未定位）；阶段 / 步骤语言 @ 事件 / 阶段区间；技能 / 结构化阶段 @ 事件 / 阶段区间

每个任务有有序步骤说明；18 个 primary tasks 另有步骤区间，related tasks 不具相同边界覆盖。1 Hz 特征不是 1 Hz 语言。

**覆盖范围：** 区间标签仅 primary annotated videos；未定位步骤列表是 sequence。

**依据：** [来源 1](https://github.com/DmZhukov/CrossTask)

**原目录粒度（保留对照）：** weak step boundary

### 088. ViTT

**数据集 · 公开资料支持**

**分类：** 阶段 / 步骤语言 @ 事件 / 阶段区间

ViTT 的 timestamp 是步骤/章节起点，tag 为文字；终点由下一起点或视频结尾界定。与只有发生点、无区间意义的 narration 不同。

**对齐与采样：** 毫秒起点；按相邻边界重建区间。

**依据：** [来源 1](https://github.com/google-research-datasets/Video-Timeline-Tags-ViTT)

**原目录粒度（保留对照）：** step titles

### 089. MSR-VTT

**数据集 · 公开资料支持**

**分类：** 视觉内容 / 行为描述 @ 独立短片整体

短 clip 各有多条独立人工描述，描述整个 clip；不附各句对应的内部事件边界。

**依据：** [来源 1](https://www.microsoft.com/en-us/research/publication/msr-vtt-a-large-video-description-dataset-for-bridging-video-and-language/)

**原目录粒度（保留对照）：** clip-level

### 090. Something-Something V2

**数据集 · 公开资料支持**

**分类：** 动作 / 任务类别 @ 独立短片整体；视觉内容 / 行为描述 @ 独立短片整体

174 个动作模板类别及代入对象名的实例模板；它是整 clip 的模板化文字，不是自由 dense caption，也不含由对象名推导的定位坐标。

**依据：** [来源 1](https://www.qualcomm.com/developer/software/something-something-v-2-dataset)

**原目录粒度（保留对照）：** short atomic clips

### 091. Kinetics-700

**数据集 · 公开资料支持**

**分类：** 动作 / 任务类别 @ 独立短片整体

700 个动作类别对应约 10 秒 clip；动作类名不当作自由语言 caption 或机器人动作监督。

**依据：** [来源 1](https://arxiv.org/abs/1907.06987)

**原目录粒度（保留对照）：** 短动作class

### 092. WebVid-10M

**数据集 · 公开资料支持**

**分类：** 视觉内容 / 行为描述 @ 独立短片整体

短视频与网络文字描述配对；1 FPS CLIP features 不等于逐秒 caption。官方于 2024-02-23 撤下 URL 与 caption 下载，仓库仍在不代表原数据继续分发。

**依据：** [来源 1](https://github.com/m-bain/webvid)

**原目录粒度（保留对照）：** 单clip描述

### 093. VideoCC3M/12M

**数据集 · 部分确认 / 待核字段**

**分类：** 视觉内容 / 行为描述 @ 独立短片整体

VideoCC 用图文语料弱匹配挖掘短视频，文本并非逐视频人工精标。可确认 VideoCC/3M 类配对；目录合写的 12M 版本尚缺唯一数据发布依据。

**待确认：** 确认 VideoCC12M 的具体版本、下载地址与样本口径；scenic 代码总入口不能证明该版本存在。

**依据：** [来源 1](https://www.ecva.net/papers/eccv_2022/papers_ECCV/papers/136740396.pdf)

**原目录粒度（保留对照）：** clip-level

### 094. EgoVLP human corpora

**衍生 / 二次标注 · 公开资料支持**

**分类：** 视觉内容 / 行为描述 @ 独立短片整体

实际可定位的语料是 EgoVLP 发布的 EgoClip：从 Ego4D narration 时间附近构造 clip-text 对。clip 边界由抽取策略产生，不等同人工动作起止。

**覆盖范围：** EgoClip；不将 EgoMCQ 评测集问答自动加入整个训练语料。

**依据：** [来源 1](https://github.com/showlab/EgoVLP)

**原目录粒度（保留对照）：** clip-level

### 095. DataComp-1B

**数据集 · 公开资料支持**

**分类：** 图像 / 区域描述 @ 静态图像

图像 URL 与网络文本/过滤元数据；检测框等筛选附属信息不能直接等同专门的空间监督集。

**依据：** [来源 1](https://huggingface.co/datasets/mlfoundations/datacomp_1b)

**原目录粒度（保留对照）：** 单图caption

### 096. Re-LAION-5B

**数据集 · 公开资料支持**

**分类：** 图像 / 区域描述 @ 静态图像

重新筛选的 LAION 图像 URL/文本元数据；属于静态图文对，不含任务时间结构。

**依据：** [来源 1](https://laion.ai/blog/relaion-5b/)

**原目录粒度（保留对照）：** 单图描述

### 097. OBELICS

**数据集 · 公开资料支持**

**分类：** 交错图文内容 @ 交错图文文档

网页中的图片与文字按文档顺序交错组织；不是所有文本与单张图片一一配对，更没有视频时间轴。

**依据：** [来源 1](https://huggingface.co/datasets/HuggingFaceM4/OBELICS) · [来源 2](https://huggingface.co/blog/obelics)

**原目录粒度（保留对照）：** 多图文上下文

### 098. MINT-1T

**数据集 · 公开资料支持**

**分类：** 交错图文内容 @ 交错图文文档

HTML/PDF/arXiv 文档的交错图文序列；document 顺序是阅读结构，不是操作阶段或时序视频。

**依据：** [来源 1](https://github.com/mlfoundations/MINT-1T)

**原目录粒度（保留对照）：** 网页/pdf交错

### 099. ShareGPT4V-PT

**数据集 · 公开资料支持**

**分类：** 图像 / 区域描述 @ 静态图像

ShareCaptioner 生成的长图像描述用于预训练；描述详细度不构成时间密度，不能标成 dense temporal language。

**依据：** [来源 1](https://github.com/ShareGPT4Omni/ShareGPT4V/blob/master/docs/Data.md)

**原目录粒度（保留对照）：** 丰富图片描述

### 100. LLaVA-1.5 665K

**多源混合集合 · 公开资料支持**

**分类：** 问答 / 指令对话 @ 静态图像；图像 / 区域描述 @ 静态图像

665K mix 是图像指令/问答与描述的混合集合；部分记录纯文本。原链接名为 Instruct-150K，但具体 665K 文件及训练文档定义版本，不按仓库名误判规模。

**覆盖范围：** 各子集字段不同；不是每条问答都同时带 caption。

**依据：** [来源 1](https://github.com/haotian-liu/LLaVA) · [来源 2](https://huggingface.co/datasets/liuhaotian/LLaVA-Instruct-150K/blob/main/llava_v1_5_mix665k.json)

**原目录粒度（保留对照）：** 问答

### 101. PixMo-Points

**数据集 · 公开资料支持**

**分类：** 空间定位 / 几何关系 @ 静态图像

图像中的对象文字引用、点坐标和计数；核心是 pointing/grounding，不因含文字就泛化为整图 caption。

**依据：** [来源 1](https://huggingface.co/datasets/allenai/pixmo-points)

**原目录粒度（保留对照）：** 空间定位

### 102. RoboPoint-data

**多源混合集合 · 公开资料支持**

**分类：** 空间定位 / 几何关系 @ 静态图像；问答 / 指令对话 @ 静态图像

RoboPoint 原始混合数据有空间指向、检测与 VQA；原目录 Ai2 链接是重打包版本，规模和子集需分别计算。

**依据：** [来源 1](https://huggingface.co/datasets/wentao-yuan/robopoint-data) · [来源 2](https://huggingface.co/datasets/allenai/Molmo2-ER-RoboPoint)

**原目录粒度（保留对照）：** 空间指点

### 103. Visual Genome

**数据集 · 公开资料支持**

**分类：** 图像 / 区域描述 @ 静态图像；空间定位 / 几何关系 @ 静态图像；问答 / 指令对话 @ 静态图像

区域描述、对象框/属性/关系及问答是不同静态标注层。旧 visualgenome.org 当前内容与研究无关，替换为作者论文和代码入口。

**依据：** [来源 1](https://hci.stanford.edu/publications/paper.php?id=335) · [来源 2](https://github.com/ranjaykrishna/visual_genome_python_driver)

**原目录粒度（保留对照）：** 空间关系

### 104. COCO Captions

**数据集 · 公开资料支持**

**分类：** 图像 / 区域描述 @ 静态图像

每图多个人工 caption；本条只指 COCO Captions，不继承 COCO 独立实例分割、关键点等任务的标签。

**依据：** [来源 1](https://arxiv.org/abs/1504.00325) · [来源 2](https://cocodataset.org/)

**原目录粒度（保留对照）：** 单图语言

### 105. GQA

**数据集 · 公开资料支持**

**分类：** 问答 / 指令对话 @ 静态图像；空间定位 / 几何关系 @ 静态图像

基于场景图的组合推理问答，场景图含对象与关系；QA 和 scene graph 下载属于不同层，不能把问句中的空间词直接当坐标。

**依据：** [来源 1](https://cs.stanford.edu/people/dorarad/gqa/download.html) · [来源 2](https://arxiv.org/abs/1902.09506)

**原目录粒度（保留对照）：** 空间推理

### 106. RefCOCO / RefCOCOg

**数据集 · 公开资料支持**

**分类：** 空间定位 / 几何关系 @ 静态图像

指代表达绑定 COCO 对象 annotation ID/区域，属于 referring expression grounding；不归普通整图描述。

**依据：** [来源 1](https://github.com/lichengunc/refer)

**原目录粒度（保留对照）：** 空间grounding

### 107. COYO-700M

**数据集 · 公开资料支持**

**分类：** 图像 / 区域描述 @ 静态图像

网络图像与 alt-text 配对，附质量/过滤元数据；无任务时间边界或机器人状态。

**依据：** [来源 1](https://github.com/kakaobrain/coyo-dataset)

**原目录粒度（保留对照）：** 单图

### 108. CC3M / CC12M

**数据集 · 公开资料支持**

**分类：** 图像 / 区域描述 @ 静态图像

CC3M/CC12M 是 image URL + caption 对；两个集合版本分别维护，不是视频字幕或连续步骤。

**依据：** [来源 1](https://github.com/google-research-datasets/conceptual-captions) · [来源 2](https://github.com/google-research-datasets/conceptual-12m)

**原目录粒度（保留对照）：** 单图

### 109. FLORA TempSeg+Captioner

**标注工具 · 工具 / 目录 / 环境**

**分类：** 不适用

FLORA 是 TempSeg/Captioner/Rewarder 等标注模型与处理流程；可生成区间、文字与分数，不因此成为一套已发布训练数据。

**依据：** [来源 1](https://github.com/NVIDIA/Flora)

**原目录粒度（保留对照）：** 自动动作分段和caption

### 110. ProcVLM / ProcCorpus-60M

**衍生 / 二次标注 · 公开资料支持**

**分类：** 空间定位 / 几何关系 @ 逐帧 / 时间步；阶段 / 步骤语言 @ 事件 / 阶段区间；进度 / 成败 / 错误 @ 逐帧 / 时间步；剩余步骤 / 规划语言 @ 逐帧 / 时间步

ProcCorpus 是已发布的二次合成标注，不应只归工具：包含 bbox、当前子任务、进度及剩余步骤推理。帧索引定位当前观察，阶段文字可在多帧重复；剩余计划不同于单一下一步指令。

**对齐与采样：** 按 dataset/episode/frame 索引 JSON；阶段语义与帧存储频率分开。

**覆盖范围：** 发布排除部分源集；原视频分开获取，不自动包含所有机器人 action。

**依据：** [来源 1](https://procvlm.github.io/) · [来源 2](https://huggingface.co/datasets/ce-amtic/ProcCorpus-60M)

**原目录粒度（保留对照）：** 帧级进度/剩余动作

### 111. DeMiAn

**衍生 / 二次标注 · 公开资料支持**

**分类：** 视觉内容 / 行为描述 @ 整轨迹 / 全视频；整体任务语言 @ 整轨迹 / 全视频；机器人动作 / 状态 @ 逐帧 / 时间步

DeMiAn 已另行发布 annotations JSONL 和 RoboCasa365 非图像训练文件；annotations 含多方面文字，RoboCasa 版含逐帧 action parquet 与每 episode reasoning。dense 指描述维度，不能推断为逐秒或逐阶段文本。

**覆盖范围：** 图像 packed 文件需从原 RoboCasa 重建；MolmoBot 与 RoboCasa 子集标注不同，不能声称各条都有全部字段。

**依据：** [来源 1](https://github.com/pearls-lab/demian/blob/main/data/README.md) · [来源 2](https://huggingface.co/datasets/PEARLS-Lab/DeMiAn_data)

**原目录粒度（保留对照）：** dense description

### 112. RoboticsCenter dataset list

**目录 / 来源关系 · 工具 / 目录 / 环境**

**分类：** 不适用

数据发现/聚合目录，链接到其他项目；本身没有可统一赋予的样本标注 schema。目录中提到的标注能力不计为该条自己的训练监督。

**依据：** [来源 1](https://www.roboticscenter.ai/datasets/manipulation)

**原目录粒度（保留对照）：** 索引

### 113. RobotData index

**目录 / 来源关系 · 工具 / 目录 / 环境**

**分类：** 不适用

数据发现/聚合目录，链接到其他项目；本身没有可统一赋予的样本标注 schema。目录中提到的标注能力不计为该条自己的训练监督。

**依据：** [来源 1](https://robotdata.dev/datasets)

**原目录粒度（保留对照）：** 索引

### 114. Claru Physical AI index

**目录 / 来源关系 · 工具 / 目录 / 环境**

**分类：** 不适用

数据发现/聚合目录，链接到其他项目；本身没有可统一赋予的样本标注 schema。目录中提到的标注能力不计为该条自己的训练监督。

**依据：** [来源 1](https://claru.ai/datasets)

**原目录粒度（保留对照）：** 索引

### 115. OpenBot dataset catalog

**目录 / 来源关系 · 工具 / 目录 / 环境**

**分类：** 不适用

数据发现/聚合目录，链接到其他项目；本身没有可统一赋予的样本标注 schema。目录中提到的标注能力不计为该条自己的训练监督。

**依据：** [来源 1](https://openbot.ai/datasets)

**原目录粒度（保留对照）：** 索引

### 116. LeRobot datasets / Hub

**目录 / 来源关系 · 工具 / 目录 / 环境**

**分类：** 不适用

数据发现/聚合目录，链接到其他项目；本身没有可统一赋予的样本标注 schema。目录中提到的标注能力不计为该条自己的训练监督。

**依据：** [来源 1](https://huggingface.co/lerobot)

**原目录粒度（保留对照）：** 标准加载

### 117. Awesome ego data

**目录 / 来源关系 · 工具 / 目录 / 环境**

**分类：** 不适用

数据发现/聚合目录，链接到其他项目；本身没有可统一赋予的样本标注 schema。目录中提到的标注能力不计为该条自己的训练监督。

**依据：** [来源 1](https://github.com/Joeland4/awesome-ego-data)

**原目录粒度（保留对照）：** 索引
