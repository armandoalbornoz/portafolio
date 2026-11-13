import {optimizerResults,classifierResults,representationResults,reinforcementResults,planningResults,runtimeResults,hausdorffSets,hausdorffDistance,quotientDistance,lift,midpoint} from './report-data.js?v=20261113-47';

const NS='http://www.w3.org/2000/svg';
const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
const svgNode=(tag,attrs={},text)=>{const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));if(text!==undefined)n.textContent=text;return n;};
const svg=(label,w=900,h=430)=>svgNode('svg',{viewBox:`0 0 ${w} ${h}`,role:'img','aria-label':label});
const txt=(s,x,y,text,attrs={})=>{const n=svgNode('text',{x,y,...attrs},text);s.append(n);return n;};
const line=(s,x1,y1,x2,y2,attrs={})=>{const n=svgNode('line',{x1,y1,x2,y2,...attrs});s.append(n);return n;};
const circle=(s,x,y,r,attrs={})=>{const n=svgNode('circle',{cx:x,cy:y,r,...attrs});s.append(n);return n;};
const source=(label,href)=>{const p=make('p','evidence-source');p.append(make('span','', 'Source: '));const a=make('a','',label);a.href=href;a.target='_blank';a.rel='noopener';p.append(a);return p;};
const sources={optimization:'assets/projects/ml-optimization-report.pdf',classification:'assets/projects/ml-evaluation-report.pdf',unsupervised:'assets/projects/ml-unsupervised-report.pdf',reinforcement:'assets/projects/ml-reinforcement-report.pdf',delaunay:'assets/projects/delaunay-research.pdf',hausdorff:'assets/projects/hausdorff-research.pdf'};
let disposeCurrent=()=>{};

function block(root,title,description){
 const section=make('section','research-figure');section.append(make('h2','',title),make('p','evidence-intro',description));root.append(section);return section;
}
function choices(parent,label,items,change){
 const group=make('div','figure-switch');group.setAttribute('role','group');group.setAttribute('aria-label',label);
 const buttons=items.map(([key,text],i)=>{const b=make('button','',text);b.type='button';b.setAttribute('aria-pressed',String(i===0));b.onclick=()=>{buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));change(key);};group.append(b);return b;});parent.append(group);
}
function dataTable(parent,headers,rows){
 const details=make('details','figure-data'),summary=make('summary','','Data table');details.append(summary);
 const wrap=make('div','figure-table-wrap'),t=make('table','case-table'),head=make('thead'),tr=make('tr');
 if(headers.length>3)t.classList.add('case-table-wide');
 for(const h of headers){const th=make('th','',h);th.scope='col';tr.append(th);}head.append(tr);t.append(head);const body=make('tbody');
 for(const row of rows){const r=make('tr');row.forEach((v,i)=>{const cell=make(i?'td':'th','',String(v));if(!i)cell.scope='row';r.append(cell);});body.append(r);}t.append(body);wrap.append(t);details.append(wrap);parent.append(details);
}
function bars(parent,rows,max,format){
 parent.replaceChildren();
 for(const [i,row] of rows.entries()){
  const r=make('div','report-bar-row');r.append(make('span','bar-name',row[0]),make('strong','bar-value',format(row[1])));
  const track=make('div','report-bar-track'),fill=make('div','report-bar-fill');fill.style.setProperty('--bar-size',String(row[1]/max));fill.style.setProperty('--bar-delay',`${i*40}ms`);track.append(fill);r.append(track);parent.append(r);
 }
}
function ml(root){
 const a=block(root,'Optimization','I compared three randomized search methods, seven gradient optimizers, and several regularizers. This chart shows the optimizer experiment on Adult: a target validation loss of 0.31522 and a fixed budget of 13,620 updates. Times and steps are medians across ten seeds.');a.id='ml-optimization';
 const chart=make('div','report-bars'),caption=make('p','figure-takeaway');
 const update=key=>{bars(chart,optimizerResults.map(d=>[d.name,d[key]]),key==='time'?8:5500,key==='time'?v=>`${v.toFixed(2)} s`:v=>v.toLocaleString('en-US'));caption.textContent=key==='time'?'Adam without bias correction reached the target in 3.93 s, versus 7.21 s for SGD: about 45% less time.':'Adam without bias correction used 1,702 steps, versus 4,994 for SGD: about 66% fewer steps.';};
 choices(a,'Optimizer comparison metric',[['time','Time to target'],['steps','Steps to target']],update);a.append(chart,caption);update('time');
 a.append(make('p','evidence-explanation','The fastest optimizer also had the largest generalization gap. SGD with momentum achieved the lowest median validation loss and reached the target in every seed. None of these optimizer changes beat the earlier Adult baseline on test F1.'));
 dataTable(a,['Optimizer','Seconds to target','Steps','Best validation loss'],optimizerResults.map(d=>[d.name,d.time.toFixed(4),d.steps,d.loss.toFixed(4)]));a.append(source('Optimization report · p. 7, Table I; pp. 6–7, results',sources.optimization));
 const b=block(root,'Supervised learning','I compared decision trees, kNN, linear and RBF SVMs, and SGD-trained MLPs on Adult income and Wine quality. Adult uses PR-AUC; Wine uses macro F1, so the scores are comparable within each dataset.');b.id='ml-supervised';
 const ranking=make('div','report-bars classifier-bars'),metric=make('p','chart-axis-label'),takeaway=make('p','figure-takeaway');
 const rank=key=>{const d=classifierResults[key];bars(ranking,d.rows,1,v=>v.toFixed(4));metric.textContent=`${d.label} · ${d.metric} · scale 0–1 · higher is better`;takeaway.textContent=key==='adult'?'MLP led on Adult, where categorical features were one-hot encoded.':'kNN led on Wine; linear SVM had the lowest macro F1 among the tuned models.';};
 choices(b,'Classification dataset',[['adult','Adult income'],['wine','Wine quality']],rank);b.append(metric,ranking,takeaway);rank('adult');
 dataTable(b,['Model','Adult PR-AUC','Wine macro F1'],classifierResults.adult.rows.map(([name,v])=>[name,v.toFixed(4),classifierResults.wine.rows.find(r=>r[0]===name)[1].toFixed(4)]));b.append(source('Evaluation report · p. 8, conclusion',sources.classification));
 root.append(b,a);
 const u=block(root,'Unsupervised learning','I tested K-Means and Gaussian mixtures on the original features and after PCA, ICA, or random projection. Clusters were selected without labels, using silhouette for K-Means and BIC for mixtures; labels were used afterward to measure agreement.');u.id='ml-unsupervised';
 const uChart=make('div','representation-chart'),uTakeaway=make('p','figure-takeaway'),uNote=make('p','evidence-explanation');
 function representation(key){
  const d=representationResults[key];uChart.replaceChildren();
  const header=make('div','representation-row representation-header');header.append(make('span','','Input'),make('span','','Features'),make('span','','Test PR-AUC'));uChart.append(header);
  for(const row of d.rows){const n=make('div','representation-row');n.append(make('span','representation-name',row.name));const dim=make('span','representation-dim'),track=make('span','representation-track'),fill=make('span','representation-fill');fill.style.setProperty('--bar-size',String(row.features/100));track.append(fill);dim.append(make('strong','',String(row.features)),track);n.append(dim,make('strong','representation-score',row.prAuc.toFixed(4)));uChart.append(n);}
  uTakeaway.textContent=key==='reduction'?'PCA reduced the input from 87 features to 24. Test PR-AUC changed from 0.7808 to 0.7788, and fit time fell from 26.74 s to 23.98 s.':'Cluster-only inputs lost predictive information. Adding GMM responsibilities to the original features changed PR-AUC from 0.7810 to 0.7813.';
  uNote.textContent=key==='reduction'?'PCA retained 95.24% of Adult’s variance in 24 components and 93.71% of Wine’s variance in 8. Reduced feature spaces did not improve the Adult network’s test PR-AUC.':'The cluster-feature experiment has its own raw baseline, 0.7810. Its small gain with added GMM features does not establish a general improvement. The dimensionality-reduction experiment above uses a separate baseline.';
 }
 choices(u,'Unsupervised experiment',[['reduction','PCA / ICA / RP'],['clusters','Cluster features']],representation);u.append(uChart,uTakeaway,uNote);representation('reduction');
 u.append(make('p','evidence-explanation','Higher silhouette scores did not consistently mean better agreement with the class labels. For example, PCA increased Wine K-Means silhouette from 0.3407 to 0.3572, while NMI changed from 0.2541 to 0.2522.'));
 dataTable(u,['Experiment / input','Features','Fit time (s)','Test PR-AUC'],Object.values(representationResults).flatMap(d=>d.rows.map(r=>[d.label+' / '+r.name,r.features,r.seconds.toFixed(2),r.prAuc.toFixed(4)])));u.append(source('Unsupervised report · pp. 5–7, Tables I–IV',sources.unsupervised+'#page=5'));
 const r=block(root,'Reinforcement learning','I compared Value Iteration and Policy Iteration with SARSA and Q-learning on Blackjack and CartPole. Blackjack used an exact finite model; CartPole required a discretized state space. Each configuration used five seeds.');r.id='ml-reinforcement';
 const paired=make('div','paired-return-chart'),rlTakeaway=make('p','figure-takeaway');
 function rl(key){
  const rows=reinforcementResults.filter(d=>d.environment===key),label=`${key}: final training-window returns and separate frozen-policy greedy evaluation. Exact values are listed below.`;
  const drawPlot=mobile=>{
   const s=svg(label,mobile?360:900,300);s.classList.add(mobile?'mobile-plot':'desktop-plot');
   const min=key==='CartPole'?0:-.1,max=key==='CartPole'?500:0,X=v=>(mobile?40:220)+(v-min)/(max-min)*(mobile?285:560);
   const ticks=key==='CartPole'?(mobile?[0,250,500]:[0,100,200,300,400,500]):(mobile?[-.1,-.05,0]:[-.1,-.075,-.05,-.025,0]);
   for(const tick of ticks){line(s,X(tick),mobile?65:40,X(tick),220,{class:'plot-grid'});txt(s,X(tick),251,key==='CartPole'?String(tick):tick.toFixed(3),{'text-anchor':'middle',class:'plot-tick'});}
   rows.forEach((d,i)=>{const y=90+i*100;txt(s,mobile?40:25,mobile?y-22:y+6,d.algorithm,{class:'return-name'});line(s,X(d.training),y,X(d.evaluation),y,{class:'return-gap'});circle(s,X(d.training),y,mobile?5:7,{class:'return-training'});circle(s,X(d.evaluation),y,mobile?5:7,{class:'return-evaluation'});});txt(s,mobile?180:500,289,'Mean episodic return',{'text-anchor':'middle',class:'plot-axis'});return s;
  };paired.replaceChildren(drawPlot(false),drawPlot(true));
  const values=make('div','paired-return-values');for(const d of rows){const row=make('p');row.textContent=`${d.algorithm}: ${key==='CartPole'?d.training.toFixed(1):d.training.toFixed(4)} training / ${key==='CartPole'?d.evaluation.toFixed(1):d.evaluation.toFixed(4)} evaluation`;values.append(row);}paired.append(values);
  rlTakeaway.textContent=key==='CartPole'?'Q-learning had the higher final training-window return, 289.0. In frozen greedy evaluation, SARSA reached 233.3 versus Q-learning’s 213.8.':'Q-learning’s frozen greedy return was −0.0407; SARSA’s was −0.0587. Both values are means over separately evaluated policies.';
 }
 choices(r,'Reinforcement environment',[['CartPole','CartPole'],['Blackjack','Blackjack']],rl);const legend=make('div','chart-legend return-legend');legend.innerHTML='<span class="legend-training">Final training window</span><span class="legend-evaluation">Frozen greedy evaluation</span>';r.append(legend,paired,rlTakeaway);rl('CartPole');
 r.append(make('p','evidence-explanation','Training used 8,000 Blackjack episodes or 1,500 CartPole episodes per seed. The selected policies were then frozen and evaluated greedily for 900 Blackjack episodes or 60 CartPole episodes per seed. SARSA and Q-learning used separately selected hyperparameters and discretizations.'));
 dataTable(r,['Environment / algorithm','Training mean','Greedy evaluation'],reinforcementResults.map(d=>[d.environment+' / '+d.algorithm,d.training.toFixed(d.environment==='CartPole'?1:4),d.evaluation.toFixed(d.environment==='CartPole'?1:4)]));
 r.append(make('h3','planning-heading','Planning and discretization'),make('p','evidence-explanation','Value Iteration reached a mean return of 500 on all three tested CartPole grids. Policy Iteration varied substantially in this implementation. Finer discretization did not consistently improve results.'));
 dataTable(r,['CartPole grid','Value Iteration','Policy Iteration'],planningResults.map(d=>[d[0],d[1].toFixed(1),d[2].toFixed(1)]));r.append(source('Reinforcement report · p. 5, Table I; p. 6, Table II',sources.reinforcement+'#page=5'));
 const chapterIds=['ml-supervised','ml-optimization','ml-unsupervised','ml-reinforcement'];
 const methodSections=[...document.querySelectorAll('#project-sections>section')];
 chapterIds.forEach((id,i)=>{const details=make('details','study-methods'),summary=make('summary','','Methods and findings'),body=make('div');for(const node of [...methodSections[i].children])if(node.tagName!=='H2')body.append(node);details.append(summary,body);root.querySelector('#'+id).append(details);});
 const nav=make('nav','study-navigation');nav.setAttribute('aria-label','ML study sections');for(const [id,label] of [['ml-supervised','Supervised'],['ml-optimization','Optimization'],['ml-unsupervised','Unsupervised'],['ml-reinforcement','Reinforcement']]){const button=make('button','',label);button.type='button';button.onclick=()=>{const heading=root.querySelector('#'+id+' h2');heading.tabIndex=-1;heading.scrollIntoView({block:'start'});heading.focus({preventScroll:true});};nav.append(button);}document.querySelector('#project-study-navigation').append(nav);
}

function runtime(root){
 const b=block(root,'Runtime comparison','Runtimes for Rhomboid Tiling and our paraboloid-projection implementation, from the team report.');
 const frame=make('div','runtime-chart'),takeaway=make('p','figure-takeaway');
 function draw(key){
  const d=runtimeResults[key];
  const drawPlot=mobile=>{
   const s=svg(`${d.label} runtime comparison. Logarithmic axes. Values available in the table below.`,mobile?360:900,mobile?340:440);s.classList.add(mobile?'mobile-plot':'desktop-plot');
   const left=mobile?70:95,right=mobile?325:812,bottom=mobile?270:351,top=mobile?50:86;
   const X=n=>left+(Math.log10(n)-1)*(right-left)/3,Y=t=>bottom-(Math.log10(t)+3)*(bottom-top)/5;
   for(let p=-3;p<=2;p++){const y=Y(10**p);line(s,left,y,right,y,{class:'plot-grid'});txt(s,left-12,y+5,10**p>=1?String(10**p):(10**p).toFixed(-p),{'text-anchor':'end',class:'plot-tick'});}
   for(const n of [10,100,1000,10000]){line(s,X(n),top,X(n),bottom,{class:'plot-grid'});txt(s,X(n),bottom+30,n.toLocaleString('en-US'),{'text-anchor':'middle',class:'plot-tick'});}
   txt(s,mobile?18:95,mobile?23:31,mobile?'Runtime (s) · log scale':'Runtime · seconds',{class:'plot-axis'});txt(s,mobile?190:454,mobile?333:423,mobile?'Input points · log scale':'Input points · logarithmic scales',{'text-anchor':'middle',class:'plot-axis'});
   for(const [j,cls] of [[1,'runtime-tiling'],[2,'runtime-lift']]){
   const points=d.rows.map(r=>`${X(r[0])},${Y(r[j])}`).join(' '),path=svgNode('polyline',{points,class:`runtime-line ${cls}`,pathLength:1});s.append(path);
    d.rows.forEach(r=>{const c=circle(s,X(r[0]),Y(r[j]),mobile?3:5,{class:cls});c.append(svgNode('title',{},`${r[0]} points: ${r[j]} seconds`));});
   }return s;
  };
  frame.replaceChildren(drawPlot(false),drawPlot(true));const last=d.rows.at(-1);takeaway.textContent=`At 10,000 points: ${last[1].toFixed(4)} s for Rhomboid Tiling; ${last[2].toFixed(4)} s for paraboloid projection.`;
 }
 choices(b,'Point distribution',[['gaussian','Gaussian'],['convex','Convex'],['explosion','Explosion']],draw);
 const legend=make('div','chart-legend');legend.innerHTML='<span class="legend-tiling">Rhomboid Tiling</span><span class="legend-lift">Paraboloid projection</span>';b.append(legend,frame,takeaway);draw('gaussian');
 b.append(make('p','evidence-explanation','Barycenter generation and convex-hull computation took most of the time. Avoiding barycenters outside the lower hull is one proposed improvement. The plot omits rounded-zero measurements and timed-out runs; complete measurements remain in the report.'));
 dataTable(b,['Distribution','Points','Tiling (s)','Projection (s)'],Object.values(runtimeResults).flatMap(d=>d.rows.map(r=>[d.label,r[0].toLocaleString('en-US'),r[1].toFixed(4),r[2].toFixed(4)])));b.append(source('Team research report · pp. 43–45, Tables 1–3',sources.delaunay));
}

function lifting(root,animate){
 const b=block(root,'Lifting and barycenters','The midpoint of two lifted points lies above the lift of their planar midpoint. The construction requires averaging after lifting.');
 const s=svg('Two points rise onto a paraboloid. Their lifted midpoint lies above the lift of their planar midpoint.',900,470),project=([x,y,z])=>[450+x*105+y*48,355+y*26-z*42];
 for(let j=-2;j<=2;j+=.5){for(let mode=0;mode<2;mode++){const pts=[];for(let i=-2;i<=2;i+=.1){const x=mode?j:i,y=mode?i:j;pts.push(project(lift([x,y])).join(','));}s.append(svgNode('polyline',{points:pts.join(' '),class:'lift-surface'}));}}
 const A=[-1.5,-.4],B=[1.4,.7],M=midpoint(A,B),L=midpoint(lift(A),lift(B)),LM=lift(M);
 const a=circle(s,0,0,7,{class:'lift-input'}),bb=circle(s,0,0,7,{class:'lift-input'}),chord=line(s,0,0,0,0,{class:'lift-chord'}),correct=circle(s,0,0,9,{class:'lift-midpoint'}),wrong=circle(s,...project(LM),6,{class:'lift-planar'}),gap=line(s,...project(L),...project(LM),{class:'lift-gap'});
 const label=txt(s,project(L)[0]+16,project(L)[1]-12,'Average after lifting',{class:'lift-label'});txt(s,project(LM)[0]+16,project(LM)[1]+23,'Lift of the planar average',{class:'lift-label-secondary'});
 txt(s,30,37,'z = x² + y²',{class:'plot-axis'});const phase=txt(s,30,441,'',{class:'lift-phase'});b.append(s);
 animate(b,t=>{const cycle=t%10,rise=Math.min(1,cycle/2.5),reveal=Math.max(0,Math.min(1,(cycle-2.5)/1.5));const pa=project([A[0],A[1],lift(A)[2]*rise]),pb=project([B[0],B[1],lift(B)[2]*rise]);for(const [n,p] of [[a,pa],[bb,pb]]){n.setAttribute('cx',p[0]);n.setAttribute('cy',p[1]);}for(const [k,v] of Object.entries({x1:pa[0],y1:pa[1],x2:pb[0],y2:pb[1]}))chord.setAttribute(k,v);const m=project([L[0],L[1],L[2]*rise]);correct.setAttribute('cx',m[0]);correct.setAttribute('cy',m[1]);for(const n of [correct,wrong,gap,label])n.style.opacity=String(reveal);phase.textContent=cycle<2.5?'Lift each input point':cycle<4?'Compute the midpoint of the lifts':'The two operations do not commute';},6);
 b.append(make('p','figure-takeaway','We initially averaged before lifting. After correcting the order, the barycenters no longer all lay on the paraboloid.'));
 b.append(source('Team research report · pp. 20–23, implementation attempts',sources.delaunay));
}

function symmetry(root,animate){
 const b=block(root,'Hausdorff distance under rotations','Red and blue are the two point sets from Figure 3. The shaded blue neighborhoods grow together. Taking the quotient identifies all four rotations of each point.');
 const s=svg('The source point sets and their quarter-turn quotient. Growing blue neighborhoods cover the red set at the same radius in both panels.',900,455),left=([x,y])=>[230+x*31,235-y*31],right=([x,y])=>[590+x*44,390-y*44];
 const defs=svgNode('defs'),clip=svgNode('clipPath',{id:'quotient-window'});clip.append(svgNode('rect',{x:590,y:108,width:233,height:282}));defs.append(clip);s.append(defs);
 txt(s,230,35,'Original sets',{'text-anchor':'middle',class:'diagram-title'});txt(s,710,35,'Quarter-turn quotient',{'text-anchor':'middle',class:'diagram-title'});
 for(let i=-5;i<=5;i++){line(s,...left([-5,i]),...left([5,i]),{class:i?'symmetry-grid':'symmetry-axis'});line(s,...left([i,-5]),...left([i,5]),{class:i?'symmetry-grid':'symmetry-axis'});}
 for(let i=0;i<=5;i++){line(s,...right([0,i]),...right([5,i]),{class:i?'symmetry-grid':'symmetry-axis'});line(s,...right([i,0]),...right([i,6]),{class:i?'symmetry-grid':'symmetry-axis'});}
 const covers=[],g=svgNode('g',{'clip-path':'url(#quotient-window)'});s.append(g);
 for(const p of hausdorffSets.blue){covers.push([circle(s,...left(p),0,{class:'symmetry-neighborhood'}),31]);covers.push([circle(g,...right(p),0,{class:'symmetry-neighborhood'}),44]);}
 for(const p of hausdorffSets.red)circle(s,...left(p),6,{class:'symmetry-red'});for(const p of hausdorffSets.blue)circle(s,...left(p),6,{class:'symmetry-blue'});
 for(const p of [[1,4],[3,3]])circle(s,...right(p),8,{class:'symmetry-red'});circle(s,...right([2,1]),8,{class:'symmetry-blue'});
 txt(s,230,434,'X and Y in the plane',{'text-anchor':'middle',class:'plot-axis'});txt(s,710,434,'X/G and Y/G',{'text-anchor':'middle',class:'plot-axis'});b.append(s);
 const controls=make('div','radius-control'),label=make('label','','Neighborhood radius ε'),input=make('input'),output=make('output');input.type='range';input.min='.3';input.max='3.4';input.step='.01';input.value='2.83';input.id='hausdorff-radius';label.htmlFor=input.id;output.htmlFor=input.id;controls.append(label,input,output);b.append(controls);
 const critical=hausdorffDistance(hausdorffSets.red,hausdorffSets.blue),result=make('p','figure-takeaway figure-equation');result.innerHTML=`d<sub>H</sub>(X, Y) = d<sub>H</sub>(X/G, Y/G) = 2√2 ≈ ${critical.toFixed(3)}`;b.append(result);
 let manual=false;const update=r=>{covers.forEach(([n,scale])=>n.setAttribute('r',r*scale));output.textContent=r.toFixed(2);input.value=String(r);s.dataset.covered=String(r>=critical);};input.oninput=()=>{manual=true;update(Number(input.value));};
 animate(b,t=>{if(!manual){const r=.3+3.1*(.5-.5*Math.cos(t*Math.PI/7));update(r);}},5.8);
 b.append(make('p','evidence-explanation','The blue neighborhoods wrap across the quadrant boundaries in the quotient metric. Coverage occurs at the same radius on both sides. This preservation holds for invariant subsets under proper isometric group actions; the paper shows that Gromov–Hausdorff distance behaves differently.'));
 b.append(source('Co-authored preprint · Theorem 4.2 and Figure 3, pp. 8–9',sources.hausdorff));
}

function preprocessing(root,animate){
 const b=block(root,'Adaptive MRI pipeline','Dataset statistics guide preprocessing. GPU memory tests determine training patch size; lesion-aware sampling and sliding-window inference handle the full volumes.');
 const pipeline=make('div','preprocessing-pipeline');b.append(pipeline);
 const steps=[['Fingerprint','Plan spacing and patches','Use dataset geometry and test patch sizes with the selected model and GPU.'],['RAS + z-score','Cache full volumes','Reorient, resample, crop foreground, and normalize nonzero intensities.'],['Lesion-aware','Sample training patches','Center patches on lesions with probability 0.33; augment samples during training.'],['50% overlap','Predict the full volume','Combine sliding windows with Gaussian weights; restore original image geometry.']];
 const windows=[];
 steps.forEach((d,i)=>{
  const step=make('div','preprocessing-step');step.append(make('strong','',d[0]),make('h3','',d[1]));
  const s=svg(d[1],210,155),g=svgNode('g',{transform:'translate(18 40)'});s.append(g);
  for(let layer=4;layer>=0;layer--)g.append(svgNode('rect',{x:layer*9,y:-layer*7,width:136,height:95,rx:1,class:`volume-layer volume-layer-${Math.min(i,2)}`}));
  for(let k=1;k<6;k++){line(g,k*22,0,k*22,95,{class:'volume-grid'});line(g,0,k*16,136,k*16,{class:'volume-grid'});}
  if(i===2)circle(g,68,47,5,{class:'sampling-lesion'});
  const window=svgNode('rect',{x:0,y:0,width:48,height:48,class:'volume-window'});g.append(window);windows.push(window);step.append(s,make('p','',d[2]));pipeline.append(step);
 });
 animate(b,t=>windows.forEach((n,i)=>{
  let x=0,y=0,w=48,h=48;
  if(i===0){const scale=[1,.8,.6][Math.floor(t/1.2)%3];w=120*scale;h=80*scale;x=(136-w)/2;y=(95-h)/2;}
  if(i===1){x=(.5-.5*Math.cos(t))*88;y=23;}
  if(i===2){const lesion=Math.floor(t/1.4)%3===0;x=lesion?44:Math.floor((Math.sin(t*2)+1)*40);y=lesion?23:Math.floor((Math.cos(t*1.4)+1)*22);}
  if(i===3){const position=Math.floor(t*1.4)%15;x=Math.min((position%5)*24,88);y=Math.min(Math.floor(position/5)*24,47);}
  for(const [key,value] of Object.entries({x,y,width:w,height:h}))n.setAttribute(key,value);
 }),2);
 b.append(make('p','figure-takeaway','The planner adapts spacing and patch size around our chosen models. It does not automatically design the network architecture.'));
 b.append(make('p','evidence-source','Pipeline schematic from the project configuration and updated write-up. Patch positions illustrate the method.'));
}

function cooperation(root,animate){
 const b=block(root,'Actor and critic','Both agents use the same actor with their own observations. The centralized critic uses the joint state during training.');
 const s=svg('Agent one and agent two send their own observations into one shared actor and receive their own actions. A centralized critic uses the joint state during training only.',900,385);
 for(const [y,name] of [[90,'Agent 1'],[230,'Agent 2']]){
  s.append(svgNode('rect',{x:35,y:y-35,width:160,height:70,class:'architecture-node'}));txt(s,115,y+7,name,{'text-anchor':'middle',class:'diagram-title'});
  s.append(svgNode('path',{d:`M195 ${y}H345V160H390`,class:'architecture-flow'}));txt(s,225,y-14,'Observation',{class:'pipeline-caption'});
  s.append(svgNode('path',{d:`M560 160H605V${y}H760`,class:'architecture-action'}));txt(s,650,y-14,'Action',{class:'pipeline-caption'});
  s.append(svgNode('rect',{x:760,y:y-28,width:110,height:56,class:'architecture-node'}));txt(s,815,y+6,`a${name.at(-1)}`,{'text-anchor':'middle',class:'diagram-title'});
 }
 s.append(svgNode('rect',{x:390,y:115,width:170,height:90,class:'architecture-policy'}));txt(s,475,151,'Shared actor',{'text-anchor':'middle',class:'diagram-title'});txt(s,475,179,'π(a | observation)',{'text-anchor':'middle',class:'pipeline-caption'});
 line(s,475,205,475,279,{class:'architecture-training'});s.append(svgNode('rect',{x:345,y:279,width:260,height:65,class:'architecture-critic'}));txt(s,475,306,'Centralized critic',{'text-anchor':'middle',class:'diagram-title'});txt(s,475,329,'Joint state · training only',{'text-anchor':'middle',class:'pipeline-caption'});
 s.classList.add('desktop-policy');b.append(s);
 const mobile=svg('Two agents share one actor. Their individual observations produce individual actions. The centralized critic uses the joint state during training.',360,425);mobile.classList.add('mobile-policy');
 for(const [x,name] of [[20,'Agent 1'],[230,'Agent 2']]){
  mobile.append(svgNode('rect',{x,y:15,width:110,height:48,class:'architecture-node'}));txt(mobile,x+55,44,name,{'text-anchor':'middle',class:'diagram-title'});
  mobile.append(svgNode('path',{d:`M${x+55} 63V100H180V133`,class:'architecture-flow'}));
  mobile.append(svgNode('path',{d:`M180 213V249H${x+55}V278`,class:'architecture-action'}));
  mobile.append(svgNode('rect',{x,y:278,width:110,height:45,class:'architecture-node'}));txt(mobile,x+55,306,`${name} action`,{'text-anchor':'middle',class:'pipeline-caption'});
 }
 txt(mobile,180,90,'Individual observations',{'text-anchor':'middle',class:'pipeline-caption'});mobile.append(svgNode('rect',{x:95,y:133,width:170,height:80,class:'architecture-policy'}));txt(mobile,180,166,'Shared actor',{'text-anchor':'middle',class:'diagram-title'});txt(mobile,180,190,'Shared parameters',{'text-anchor':'middle',class:'pipeline-caption'});
 mobile.append(svgNode('rect',{x:70,y:358,width:220,height:60,class:'architecture-critic'}));txt(mobile,180,382,'Centralized critic',{'text-anchor':'middle',class:'diagram-title'});txt(mobile,180,403,'Joint state · training only',{'text-anchor':'middle',class:'pipeline-caption'});line(mobile,180,213,180,358,{class:'architecture-training'});b.append(mobile);
 const paths=[...b.querySelectorAll('.architecture-flow,.architecture-action')];animate(b,t=>paths.forEach(n=>n.style.strokeDashoffset=String(-t*45)),2);
}

export function mountProjectEvidence(project){
 disposeCurrent();const root=document.querySelector('#project-explorations');root.replaceChildren();const studyNav=document.querySelector('#project-study-navigation');studyNav.replaceChildren();studyNav.hidden=project.slug!=='ml-evaluation-study';document.querySelector('#project-sections').hidden=project.slug==='ml-evaluation-study';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),jobs=[];let raf=0,last=0,clock=0,dead=false;
 const animate=(node,update,still=0)=>{const job={node,update,visible:false};jobs.push(job);update(still);};
 if(project.slug==='ml-evaluation-study')ml(root);
 if(project.slug==='delaunay-research'){lifting(root,animate);runtime(root);}
 if(project.slug==='hausdorff-research')symmetry(root,animate);
 if(project.slug==='mri-stroke-segmentation')preprocessing(root,animate);
 if(project.slug==='overcooked-ai')cooperation(root,animate);
 function tick(now){raf=0;if(dead||document.hidden||reduced.matches||!jobs.some(j=>j.visible))return;if(!last)last=now;const delta=Math.min(.1,(now-last)/1000);if(now-last>=1000/30){clock+=delta;last=now;for(const j of jobs)if(j.visible)j.update(clock);}raf=requestAnimationFrame(tick);}
 function resume(){last=0;if(!raf&&!document.hidden&&!reduced.matches&&jobs.some(j=>j.visible))raf=requestAnimationFrame(tick);}
 const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting)e.target.classList.add('figure-visible');const j=jobs.find(x=>x.node===e.target);if(j)j.visible=e.isIntersecting;}resume();},{threshold:.08});
 root.querySelectorAll('.research-figure').forEach(n=>observer.observe(n));
 const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else resume();};
 document.addEventListener('visibilitychange',visibility);const motionChange=()=>{if(reduced.matches){cancelAnimationFrame(raf);raf=0;for(const j of jobs)j.update(5.8);}else resume();};reduced.addEventListener('change',motionChange);
 disposeCurrent=()=>{dead=true;cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',motionChange);};
}
