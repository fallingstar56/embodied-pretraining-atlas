/* Only explicit source reviews provide annotation pairs; never infer from use cases. */
(() => {
  'use strict';
  const taxonomy = window.ATLAS_TAXONOMY;
  const reviews = window.ATLAS_REVIEWED_FACETS || {};
  const types = new Set(taxonomy.types.map(x=>x[0]));
  const times = new Set(taxonomy.times.map(x=>x[0]));
  (window.ATLAS_DATA || []).forEach(d=>{
    const r = reviews[d.name];
    if (!r) throw new Error('Missing annotation review: '+d.name);
    if (!r.sources.length || r.pairs.some(p=>p.length!==2 || !types.has(p[0]) || !times.has(p[1]))) {
      throw new Error('Invalid annotation review: '+d.name);
    }
    d.facets = {...r, evidence:r.status, evidenceUrl:r.sources[0]};
    d.tags = r.modalities;
    d.category = r.categoryOverride || d.category;
    d.isResource = ['tool','index','benchmark'].includes(r.resourceKind);
  });
})();
