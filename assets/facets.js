/* Conservative catalogue-level candidates plus explicitly reviewed (type, time) pairs.
   Never combine independent type and time columns into imaginary annotations. */
(() => {
  'use strict';
  const records = Array.isArray(window.ATLAS_DATA) ? window.ATLAS_DATA : [];
  const reviews = window.ATLAS_REVIEWED_FACETS || {};
  const TYPES = new Set(['action_state','task_text','stage_text','stage_struct','dense_language','observed_caption','next_step','spatial','future_trace','progress_failure','qa','image_text']);
  const TIMES = new Set(['frame','second','segment','episode','static']);
  const match = (s,rx)=>rx.test(String(s||'').toLowerCase());
  function infer(d) {
    const pairs=[];
    const gran=String(d.granularity||'').toLowerCase();
    const sig=String(d.signals||'').toLowerCase();
    const stage=match(gran, /subtask|stage|step|子任务|阶段|步骤|层级|分段|片段边界/);
    const lang=match(sig+' '+gran, /语言|英文|中文|lang|caption|instruction|描述|文本|字幕|叙述|narration|\+l\b/);
    const frame=match(gran, /逐帧|每帧|frame.level|per.frame|frame级|逐时间步|每个时间步/);
    const second=match(gran, /每\s*1\s*(?:s|秒)|每秒|1hz|秒级/);
    const clip=match(gran, /clip|片段|segment|narration|caption|字幕|时间戳|时间边界/);
    const episode=match(gran, /episode|task.level|task级|任务级|整段|完整任务/);
    const add=(type,time)=>{if(TYPES.has(type)&&TIMES.has(time)&&!pairs.some(x=>x[0]===type&&x[1]===time))pairs.push([type,time]);};
    // These are *candidates* extracted from source-catalog descriptions, not assertions about raw files.
    if(d.category==='image'){
      add('image_text','static');
      if(match(sig+' '+gran,/box|bbox|mask|分割|空间|ground|point|定位|关系|affordance|姿态/))add('spatial','static');
    } else {
      if(d.category==='robot' && match(sig,/action|joint|关节|机器人动作|状态|state|eef|末端/)){
        if(frame || match(gran,/action.level|逐时间步/))add('action_state','frame');
      }
      if(stage){
        if(lang)add('stage_text',frame?'frame':'segment');
        else add('stage_struct',frame?'frame':'segment');
      }
      if(episode&&lang)add('task_text','episode');
      if(frame&&lang&&!stage)add('dense_language','frame');
      if(second&&lang)add('dense_language','second');
      if(clip&&lang&&!stage)add('observed_caption','segment');
      if(match(sig+' '+gran,/bbox|bounding|分割|segmentation|affordance|接触点|point|空间关系|物体框/))add('spatial',frame?'frame':'segment');
      if(match(gran,/未来轨迹|future.trace|motion.trace|未来末端/))add('future_trace',frame?'frame':'segment');
      if(match(gran,/问答|vqa|qa|question/))add('qa',clip?'segment':'episode');
      if(match(gran,/进度|completion|failure|失败原因|错误分析/))add('progress_failure',stage?'segment':'episode');
      // next_step is deliberately never inferred from a generic 'next step' *use case*.
      if(match(gran,/逐秒下一步语言|每秒下一步语言|next.step language label|next.step instruction annotation/))add('next_step',second?'second':frame?'frame':'segment');
    }
    return pairs;
  }
  records.forEach(d=>{
    const review=reviews[d.name];
    if(review){
      if(!review.evidence || !/^https:\/\//.test(review.evidence))throw new Error('Missing evidence URL for '+d.name);
      const cleanPairs=(review.pairs||[]).filter(x=>x.length===2&&TYPES.has(x[0])&&TIMES.has(x[1]));
      if(cleanPairs.length!==(review.pairs||[]).length || !cleanPairs.length)throw new Error('Invalid reviewed facets for '+d.name);
      d.facets={pairs:cleanPairs,evidence:'reviewed',evidenceUrl:review.evidence,note:review.note||''};
    }else{
      const pairs=infer(d);
      d.facets={pairs,evidence:pairs.length?'catalog':'unknown',evidenceUrl:'',note:pairs.length?'根据目录摘要保守推断，尚未逐项核验原始标注字段和时间戳。':'暂缺足够字段，不能判断可用的标注类型和时间尺度。'};
    }
    // Robot action (A) is not the same as human hand motion or spatial poses in image datasets.
    d.tags=(d.tags||[]).filter(x=>x!=='A' || d.category==='robot');
  });
})();
