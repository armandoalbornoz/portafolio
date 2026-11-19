// Reading content is drawn from the supplied résumé and project reports.
import {mountProjectEvidence} from './project-evidence.js?v=20261119-03';
export const caseStudies={
 'overcooked-ai':{
  area:'Cooperative reinforcement learning',kind:'Georgia Tech · CS 7642',
  overview:'I trained two agents to prepare and deliver soup in Overcooked using multi-agent PPO. I tested the implementation on Cramped Room, Coordination Ring, and Counter Circuit, with three training seeds for each layout.',
  sections:[
   {title:'Training the agents',paragraphs:['Both agents use one shared actor, which takes each agent’s own observation and chooses among six actions. A centralized critic receives their concatenated observations during training. The actor and critic each have two 128-unit hidden layers with tanh activations.','I trained a separate team for each layout and seed: 3,000 episodes per run, with a fixed 400-step horizon. PPO updates use four episodes at a time, generalized advantage estimation, and a clipped policy objective. Across the three layouts, that is nine training runs and 27,000 episodes.']},
   {title:'Reward shaping',paragraphs:['The training reward includes intermediate bonuses for placing ingredients in a pot, picking up dishes, and collecting soup, along with cooking-start and exploration bonuses. These signals give the agents feedback before they complete a delivery.','I measured evaluation performance using soups delivered. Shaped training reward is not the evaluation score.']},
   {title:'Evaluation',paragraphs:['I evaluated each trained checkpoint over 100 consecutive episodes, for 900 evaluation episodes in total. Cramped Room averaged 9.53 soups per episode across the three seeds, and Coordination Ring averaged 7.98.','Counter Circuit exposed a reliability problem. Seed 0 averaged 7.03 soups, but seeds 1 and 2 delivered none in evaluation and also ended training without deliveries. The three-seed average was 2.34.']}
  ]
 },
 'mri-stroke-segmentation':{
  area:'3D medical imaging',kind:'Machine learning project',
  overview:'I built an adaptive MONAI pipeline for brain MRI, with dataset-aware preprocessing and GPU-calibrated training patches, and evaluated it with lightweight 3D segmentation models.',
  sections:[
   {title:'Adaptive preprocessing',paragraphs:['ATLAS 3.0 contains 1,453 T1-weighted MRI scans from 55 sites, with different dimensions, voxel spacing, and intensity ranges.','I developed a dataset-aware pipeline inspired by nnU-Net to replace the early fixed-volume baseline. A dataset fingerprint records scan geometry and foreground statistics. The planner selects voxel spacing from the dataset and tests candidate patch sizes with a complete training step on the chosen model, batch size, and GPU.','Scans and masks are reoriented to RAS, resampled, and cropped to the nonzero foreground. MRI intensities are z-score normalized over nonzero voxels. This deterministic preprocessing is cached separately from random training transforms.']},
   {title:'Patch sampling and inference',paragraphs:['Training uses dynamically sampled 3D patches. The configuration sets a 0.33 probability of centering a patch on a lesion voxel; other patches are sampled from the brain region. Flips, rotations, and Gaussian noise augment the training samples.','Full-volume inference uses sliding windows with 50% overlap and Gaussian blending. The pipeline supports restoring predictions to the original image geometry.','The approach shares dataset-aware planning and patch-based training with nnU-Net, while keeping our own model architectures and training code.']},
   {title:'Model results',paragraphs:['We evaluated a baseline encoder-decoder without skip connections, V-Net-style additive skips, and U-Net-style concatenated skips. The later experiments improved test Dice for all three custom models over the fixed-volume baseline.','Our best U-Net had 390K parameters and reached 0.5355 test Dice. The nnU-Net benchmark reached 0.6032 with 383M parameters.'],table:{headers:['Model','Parameters','Test Dice'],rows:[['U-Net','390K','0.5355'],['nnU-Net','383M','0.6032']]},note:'Dice measures overlap with the reference masks; higher is better. The adaptive pipeline changes preprocessing, sampling, augmentation, and inference together, so these experiments do not isolate the effect of preprocessing alone.'}
  ]
 },
 'ml-evaluation-study':{
  area:'Machine learning',kind:'Georgia Tech · four reports',
  overview:'These four reports cover supervised learning, optimization, unsupervised learning, and reinforcement learning. I used Adult income and Wine quality for prediction, and Blackjack and CartPole for sequential decisions.',
  sections:[
   {title:'Supervised learning',paragraphs:['I compared decision trees, kNN, linear and RBF SVMs, and MLPs on 42,222 Adult records and 6,497 Wine records. I used stratified train/test splits and three-fold cross-validation, with preprocessing fit only on training folds.','The tuned MLP led on Adult with PR-AUC 0.7808. kNN led on Wine with macro F1 0.4654. I used different metrics because Adult is an imbalanced binary problem and Wine has imbalanced quality classes.']},
   {title:'Optimization',paragraphs:['I tested randomized hill climbing, simulated annealing, and a genetic algorithm on the final layer of an existing MLP. Each run received 2,000 objective evaluations, repeated over five seeds. Hill climbing had the lowest validation loss on both datasets, contrary to my initial hypothesis.','The full-network experiment compared seven optimizers across ten seeds. Adam without bias correction reached the loss target about 45% sooner and in 66% fewer steps than SGD. Neither the optimizer changes nor regularization beat the earlier Adult baseline’s test F1 of 0.6859.']},
   {title:'Unsupervised learning',paragraphs:['I compared K-Means and Gaussian mixtures before and after PCA, ICA, and random projection. Cluster counts were selected without labels; I then used ARI and NMI to check agreement with the known classes.','I also trained the Adult network on reduced and cluster-derived features. PCA reduced its inputs from 87 to 24 with a small drop in PR-AUC. Cluster-only inputs performed much worse than the original features; adding cluster features produced little improvement.']},
   {title:'Reinforcement learning',paragraphs:['I compared Value Iteration, Policy Iteration, SARSA, and Q-learning over five seeds. Blackjack used an exact finite model. For CartPole, I tested several discretizations of the continuous state space.','I evaluated the selected tabular policies separately from their training runs. On CartPole, Q-learning had the higher final training return, while SARSA had the higher frozen greedy-evaluation return. Grid resolution also changed results substantially, particularly for Policy Iteration in this implementation.']}
  ]
 },
 'delaunay-research':{
  area:'Computational geometry',kind:'University of Florida · team research',
  overview:'I studied the construction and refinement of order-2 Delaunay triangulations in a team research project at the University of Florida.',
  sections:[
   {title:'Paraboloid construction',paragraphs:['The construction lifts planar points onto z = x² + y², then computes barycenters of the lifted points. Projecting the relevant lower hull connects this three-dimensional construction back to the order-2 mosaic.','An early attempt averaged points before lifting. Reversing those operations corrected the geometry. Our custom incremental hull implementation ran into coplanar points in its initial simplex.']},
   {title:'Runtime measurements',paragraphs:['We compared the projection approach with Rhomboid Tiling on Gaussian, convex, and explosion point distributions. The projection implementation became much slower as the input grew: for 10,000 Gaussian points, it took 99.9342 seconds versus 0.4533 seconds for tiling.','The expensive steps were generating barycenters and computing the convex hull. We proposed avoiding barycenters that cannot contribute to the lower hull.']},
   {title:'Refinement experiments',paragraphs:['The refinement experiments compared order-1 and order-2 triangulations and their angle distributions. Adding Steiner points improved some angle behavior, while small angles remained a limitation. The experiments did not establish a general angle guarantee for order-2 refinement.']}
  ]
 },
 'hausdorff-research':{
  area:'Metric geometry',kind:'Co-authored preprint',
  overview:'I co-authored a paper on Hausdorff and Gromov-Hausdorff distances under group quotients.',
  sections:[
   {title:'Hausdorff distance under quotients',paragraphs:['A quotient treats points in the same symmetry orbit as one point. Under quarter-turn rotations, each orbit contains up to four points.','For invariant subsets X and Y of a common metric space, with a proper group action by isometries, we prove that their Hausdorff distance equals the distance between their quotient spaces.'],equation:true},
   {title:'Gromov-Hausdorff counterexamples',paragraphs:['Hausdorff distance compares sets inside a shared ambient space. Gromov-Hausdorff distance allows their isometric embeddings to vary, and it is not preserved by the quotient.','We constructed finite and compact metric-space examples where the quotient-to-original Gromov-Hausdorff distance ratio becomes arbitrarily large or small, including examples with arbitrarily dense invariant subsets. The work was presented at the UF Math Symposium and is available as arXiv:2410.14938.']}
  ]
 }
};

const element=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text)node.textContent=text;return node;};
function fact(label,value){const row=element('div');row.dataset.fact=label.toLowerCase();row.append(element('dt','',label),element('dd','',value));return row;}
export function renderProjectPage(project,index,projects){
 const data=caseStudies[project.slug];
 document.querySelector('#project').dataset.project=project.slug;
 document.querySelector('#project-title').textContent=project.title;
 document.querySelector('#project-copy').textContent=project.short;
 document.querySelector('#project-summary').textContent=data.overview;
 const facts=document.querySelector('#project-facts');
 const details=[fact('Field',data.area)];
 if(project.status)details.push(fact('Status',project.status));else if(data.kind)details.push(fact('Work',data.kind));
 details.push(fact('Tools',project.tech));facts.replaceChildren(...details);
 const finding=document.querySelector('#project-finding');finding.hidden=!data.finding;finding.replaceChildren();if(data.finding)finding.append(element('p','finding-value',data.finding.value),element('p','finding-label',data.finding.label),element('p','finding-context',data.finding.context));
 const story=document.querySelector('#project-sections');
 story.replaceChildren(...data.sections.map(section=>{
  const block=element('section');block.append(element('h2','',section.title));
  for(const paragraph of section.paragraphs||[])block.append(element('p','',paragraph));
  if(section.items){const list=element('ul');for(const item of section.items)list.append(element('li','',item));block.append(list);}
  if(section.equation){const equation=element('div','case-equation');equation.setAttribute('aria-label','The Hausdorff distance between X and Y equals the Hausdorff distance between their quotient spaces.');equation.innerHTML='d<sub>H</sub>(X, Y) = d<sub>H</sub>(X/G, Y/G)';block.append(equation);}
  if(section.table){const table=element('table','case-table'),head=element('thead'),row=element('tr');for(const text of section.table.headers){const th=element('th','',text);th.scope='col';row.append(th);}head.append(row);const body=element('tbody');for(const values of section.table.rows){const tr=element('tr');values.forEach((text,i)=>{const td=element(i?'td':'th','',text);if(!i)td.scope='row';tr.append(td);});body.append(tr);}table.append(head,body);block.append(table);}
  if(section.note)block.append(element('p','case-note',section.note));
  return block;
 }));
 const reports=document.querySelector('#project-reports');
 reports.replaceChildren(...(project.reports||[]).map(report=>{
  const a=element('a','report-link',report.label);a.href=report.href;a.target='_blank';a.rel='noopener';
  const arrow=element('span','link-arrow','↗');arrow.setAttribute('aria-hidden','true');a.append(arrow);return a;
 }));
 document.querySelector('#project-documents').hidden=!project.reports?.length;
 const note=document.querySelector('#project-caption');note.textContent=project.previewNote||'';note.hidden=!project.previewNote;
 mountProjectEvidence(project);
 const previous=projects[(index+projects.length-1)%projects.length],next=projects[(index+1)%projects.length];
 document.querySelector('#case-previous-title').textContent=previous.title;
 document.querySelector('#case-next-title').textContent=next.title;
 document.title=project.title+' — Armando Albornoz';
}
