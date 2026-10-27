#!/usr/bin/env python3
"""Build the browsing data from the editable master catalog CSV.
Usage: python tools/build_data.py
Only stdlib required. Links not manually confirmed are kept as source records.
"""
import csv, json, re, pathlib, urllib.parse
ROOT = pathlib.Path(__file__).resolve().parents[1]
INPUT = ROOT/'data/catalog.csv'
OUTPUT = ROOT/'data/datasets.js'

# Curated supplementary links. Original sources remain available on every entry.
# Keep only observed/known public URLs. Never manufacture publication links.
EXTRA = {
'RoboInter-Data': [('项目页','https://lihaohn.github.io/RoboInter.github.io/'),('代码','https://github.com/InternRobotics/RoboInter')],
'RoboInter-VQA': [('项目页','https://lihaohn.github.io/RoboInter.github.io/'),('代码','https://github.com/InternRobotics/RoboInter')],
'FineART': [('数据集','https://huggingface.co/datasets/lerobot/FineART')],
'FineVLA-Data': [('代码','https://github.com/xlang-ai/FineVLA')],
'AgiBot World 2026': [('项目页','https://agibot-world.com/')],
'RoboMIND v1.2 / v2': [('项目页','https://x-humanoid-robomind.github.io/')],
'Galaxea Open-World': [('项目页','https://opengalaxea.github.io/G0/'),('论文','https://arxiv.org/abs/2509.00576')],
'Galaxea / RoboCOIN source': [('项目页','https://opengalaxea.github.io/G0/'),('代码','https://github.com/RoboCoin-BAAI/RoboCoin')],
'RoboCasa365': [('项目页','https://robocasa.ai/'),('代码','https://github.com/robocasa/robocasa')],
'RoboCasa 2024': [('代码','https://github.com/robocasa/robocasa')],
'BEHAVIOR-1K 2026 challenge demos': [('项目页','https://behavior.stanford.edu/')],
'BEHAVIOR-1K 2025 challenge demos': [('项目页','https://behavior.stanford.edu/')],
'AgiBot World Beta': [('项目页','https://opendrivelab.com/AgiBot-World/'),('代码','https://github.com/OpenDriveLab/AgiBot-World')],
'AgiBot World Alpha': [('项目页','https://opendrivelab.com/AgiBot-World/'),('代码','https://github.com/OpenDriveLab/AgiBot-World')],
'RoboInter-Tool（非数据集）': [('项目页','https://lihaohn.github.io/RoboInter.github.io/')],
'FineVLA-Tool（非数据集）': [('项目页','https://finevla.xlang.ai/')],
'Open X-Embodiment': [('项目页','https://robotics-transformer-x.github.io/')],
'DROID': [('代码','https://github.com/droid-dataset/droid')],
'BridgeData V2': [('代码','https://github.com/rail-berkeley/bridge_data_v2')],
'RoboTwin 2.0 unified': [('项目页','https://robotwin-platform.github.io/doc/'),('代码','https://github.com/robotwin-Platform/RoboTwin')],
'RoboMimic': [('代码','https://github.com/ARISE-Initiative/robomimic')],
'MimicGen': [('代码','https://github.com/NVlabs/mimicgen_environments')],
'LIBERO': [('代码','https://github.com/Lifelong-Robot-Learning/LIBERO')],
'CALVIN': [('代码','https://github.com/mees/calvin')],
'Language Table': [('项目页','https://interactive-language.github.io/')],
'ALOHA Unleashed': [('代码','https://github.com/google-deepmind/aloha_unleashed')],
'Mobile ALOHA': [('代码','https://github.com/MarkFzp/mobile-aloha')],
'Dobb-E': [('代码','https://github.com/notmahi/dobb-e')],
'ManiSkill2/3 trajectories': [('代码','https://github.com/haosulab/ManiSkill')],
'RLBench': [('项目页','https://sites.google.com/view/rlbench')],
'FMB functional manipulation': [('项目页','https://functional-manipulation-benchmark.github.io/'),('数据集','https://functional-manipulation-benchmark.github.io/dataset/'),('代码','https://github.com/rail-berkeley/fmb')],
'RoboSet': [('项目页','https://robopen.github.io/roboset/')],
'Gen-HumanEgo': [('博客','https://www.genrobot.ai/blog/gen-human-ego'),('项目页','https://www.genrobot.ai/data/open-dataset')],
'Ego4D Narrations': [('项目页','https://ego4d-data.org/')],
'Ego4D Goal-Step': [('项目页','https://ego4d-data.org/')],
'Ego-Exo4D V2': [('项目页','https://ego-exo4d-data.org/')],
'EPIC-KITCHENS-100': [('代码','https://github.com/epic-kitchens')],
'EgoDex': [('代码','https://github.com/apple-aiml-research/ml-egodex')],
'Assembly101': [('项目页','https://assembly-101.github.io/')],
'EgoSuite-Open100K': [('博客','https://huggingface.co/blog/LightwheelAI/egosuite-open100k')],
'EgoVerse': [('项目页','https://egoverse.ai/')],
'Action100M': [('代码','https://github.com/facebookresearch/Action100M')],
'LAION-BVD-V-55M': [('项目页','https://projects.laion.ai/bvd/'),('数据集','https://huggingface.co/datasets/laion/BVD-V-55M')],
'LAION-BVD-I-300M': [('项目页','https://projects.laion.ai/bvd/')],
'LAION-BVD RAW': [('项目页','https://projects.laion.ai/bvd/')],
'Panda-70M': [('代码','https://github.com/snap-research/Panda-70M')],
'HD-VILA-100M': [('项目页','https://github.com/microsoft/XPretrain')],
'HowTo100M': [('项目页','https://www.di.ens.fr/willow/research/howto100m/')],
'FineVideo': [('博客','https://huggingface.co/blog/fine-video')],
'Molmo2-Cap': [('项目页','https://allenai.org/molmo'),('博客','https://allenai.org/blog/molmo2')],
'Molmo2-VideoPoint': [('博客','https://allenai.org/blog/molmo2')],
'Molmo2-CapQA': [('项目页','https://allenai.org/molmo')],
'ActivityNet Captions': [('项目页','https://cs.stanford.edu/people/ranjaykrishna/densevid/')],
'COIN': [('代码','https://github.com/coin-dataset/annotation')],
'ViTT': [('博客','https://research.google/blog/introducing-vitt-a-dataset-for-video-tutorials/')],
'MSR-VTT': [('项目页','https://www.microsoft.com/en-us/research/publication/msr-vtt-a-large-video-description-dataset-for-bridging-video-and-language/')],
'Something-Something V2': [('项目页','https://www.qualcomm.com/developer/software/something-something-v-2-dataset')],
'WebVid-10M': [('项目页','https://github.com/m-bain/webvid')],
'DataComp-1B': [('项目页','https://www.datacomp.ai/')],
'OBELICS': [('项目页','https://huggingface.co/blog/obelics')],
'MINT-1T': [('项目页','https://mint1t.github.io/')],
'ShareGPT4V-PT': [('代码','https://github.com/ShareGPT4Omni/ShareGPT4V/blob/master/docs/Data.md')],
'PixMo-Points': [('项目页','https://allenai.org/molmo')],
'RoboPoint-data': [('项目页','https://allenai.org/molmo')],
'Visual Genome': [('代码','https://github.com/ranjaykrishna/visual_genome_python_driver')],
'COCO Captions': [('项目页','https://cocodataset.org/')],
'GQA': [('项目页','https://cs.stanford.edu/people/dorarad/gqa/')],
'FLORA TempSeg+Captioner': [('项目页','https://research.nvidia.com/labs/gear/flora/')],
'ProcVLM / ProcCorpus-60M': [('项目页','https://procvlm.github.io/')],
'DeMiAn': [('项目页','https://pearls-lab.github.io/demian/')],
}
# Fixed misdirecting/general source links when an exact project page is known.
FIX_SOURCE = {
 'RoboSet':'https://robopen.github.io/roboset/',
 'FMB functional manipulation':'https://functional-manipulation-benchmark.github.io/',
 'MSR-VTT':'https://www.microsoft.com/en-us/research/publication/msr-vtt-a-large-video-description-dataset-for-bridging-video-and-language/',
}
TOOL_NAMES={'RoboInter-Tool（非数据集）','FineVLA-Tool（非数据集）'}

def cat(label, name):
    if name in TOOL_NAMES or label.startswith('T｜'):
        return 'tool'
    if label.startswith('R｜'): return 'robot'
    if label.startswith('H｜'): return 'ego'
    if label.startswith('VL｜'): return 'video'
    if label.startswith('I｜'): return 'image'
    return 'tool'

def granularity(s):
    s=s.lower()
    if any(k in s for k in ('逐帧','每帧','frame-level','per-frame','frame级','每秒')):return 'frame'
    if any(k in s for k in ('subtask','子任务','step','阶段','阶段描述','步骤','片段边界','segment')):return 'stage'
    if any(k in s for k in ('clip','caption','字幕','dense','narration','时间戳','时空')):return 'clip'
    if any(k in s for k in ('task-level','task级','episode','视频级','instruction')):return 'task'
    return 'other'

def linkkind(url):
    host=urllib.parse.urlsplit(url).netloc.lower()
    if host=='huggingface.co' and '/datasets/' in url: return '数据集'
    if host=='github.com': return '代码'
    if '/blog/' in url or host.startswith('research.google'):return '博客'
    if 'robotdata.dev' in host or 'robottraining.jobs' in host or 'claru.ai' in host:return '索引入口'
    return '项目页'

def slug(s):
    out=re.sub(r'[^a-z0-9]+','-',s.lower().replace('v1.2 / v2','v1-v2'))
    return out.strip('-') or 'entry'

def main():
    with INPUT.open(encoding='utf-8-sig',newline='') as file:
        rows=list(csv.DictReader(file))
    records=[]; ids=set()
    for ix,row in enumerate(rows):
        name=row['数据集'].strip(); source=FIX_SOURCE.get(name,row['来源URL'].strip())
        assert source.startswith('https://'), (name,source)
        rid=slug(name)
        if rid in ids:rid+=f'-{ix+1}'
        ids.add(rid)
        links=[]
        for label,url in [(linkkind(source),source)]+EXTRA.get(name,[]):
            if url not in [x['url'] for x in links] and url.startswith('https://'):
                links.append({'type':label,'url':url})
        category=cat(row['类别'],name)
        tags=[]
        modality=row['训练可用信号'].lower()
        if any(x in modality for x in ['rgb','image','video','视觉','多视角','图像','仿真','camera','照片','frame','keyframe']):tags.append('V')
        if any(x in modality for x in ['language','文本','语言','caption','instruction','问答','qa','+l','字幕','描述','text','task','narration']):tags.append('L')
        if any(x in modality for x in ['action','动作','state','轨迹','pose','+a','eef','关节','motion']):tags.append('A')
        if not tags: tags=['V','L'] if category in ('ego','video','image') else []
        records.append({
            'id':rid,'name':name,'category':category,'priority':row['优先级'].strip(),
            'size':row['公开规模（口径见备注）'].strip(),'signals':row['训练可用信号'].strip(),
            'granularity':row['语言/时间粒度'].strip(),'grain':granularity(row['语言/时间粒度']),
            'use':row['建议用途'].strip(),'access':row['下载状态'].strip(),
            'license':row['许可/约束'].strip(),'overlap':row['重叠/包含关系'].strip(),
            'caveat':row['注意事项'].strip(),'links':links,'source':source,'tags':tags,
            'isResource': category=='tool','originalCategory':row['类别']
        })
    assert len(records)==117 and len(ids)==117
    text='/* Generated by tools/build_data.py; edit data/catalog.csv instead. */\nwindow.ATLAS_DATA = '+json.dumps(records,ensure_ascii=False,separators=(',',':'))+';\n'
    OUTPUT.write_text(text,encoding='utf-8')
    print('Generated',len(records),'records',len(text),'bytes', {key:sum(x['category']==key for x in records) for key in ('robot','ego','video','image','tool')})
if __name__=='__main__':main()
