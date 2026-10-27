/* Manually reviewed pairs only. Evidence must describe the exact labelled time scale.
   Do not treat a model that CAN predict next step as a dataset with next-step targets. */
window.ATLAS_REVIEWED_FACETS = {
  'FineART': {
    pairs: [['action_state','frame'],['task_text','episode'],['stage_text','segment']],
    evidence: 'https://huggingface.co/datasets/lerobot/FineART',
    note: 'Subtask rows carry start timestamps and apply to segments. The list is repeated in the per-frame language_persistent column, but this is NOT a unique caption per frame. Robot state/actions are 30 fps.'
  },
  'RoboCasa365': {
    pairs: [['action_state','frame'],['task_text','episode'],['stage_text','frame'],['stage_struct','frame']],
    evidence: 'https://robocasa.ai/docs/build/html/use_cases/subtask_annotations.html',
    note: 'Composite-task demos have per-timestep subtask IDs, stage/skill names and a natural-language instruction. Instructions are stage-conditioned, NOT free-form next-step reasoning generated every frame.'
  },
  'RoboMIND v1.2 / v2': {
    pairs: [['action_state','frame'],['dense_language','frame']],
    evidence: 'https://huggingface.co/datasets/x-humanoid-robomind/RoboMIND',
    note: 'Official release mentions frame-level fine-grained language instruction JSON. This does not establish 1 Hz sampling, nor a verified next-step / progress schema.'
  },
  'RoboInter-Data': {
    pairs: [['action_state','frame'],['task_text','episode'],['stage_text','frame'],['stage_struct','frame'],['spatial','frame'],['future_trace','frame']],
    evidence: 'https://github.com/InternRobotics/RoboInter/blob/main/RoboInterData/lerobot_dataloader/README.md',
    note: 'Per-frame aligned intermediate representations include subtask text, skill labels, boxes, segmentation and future gripper trace. A future pixel trace is not a natural-language next-step instruction.'
  },
  'Ego4D Goal-Step': {
    pairs: [['task_text','episode'],['stage_text','segment'],['progress_failure','segment']],
    evidence: 'https://github.com/facebookresearch/ego4d-goalstep',
    note: 'Goal → step → substep segments with start/end times and completion annotations. These are not periodic per-second natural language instructions.'
  },
  'EPIC-KITCHENS-100': {
    pairs: [['observed_caption','segment'],['stage_struct','segment']],
    evidence: 'https://epic-kitchens.github.io/',
    note: 'Timestamped action segments with narrations and verb/noun labels, not robot actions or next-step guidance.'
  }
};
