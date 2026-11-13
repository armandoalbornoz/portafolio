// Transcribed from the user's reports. Values remain independent of animation.
export const optimizerResults = [
 {name:'SGD',time:7.2082,steps:4994,loss:.3145},
 {name:'SGD + momentum',time:5.9924,steps:3859,loss:.3137},
 {name:'Nesterov',time:5.0744,steps:3178,loss:.3147},
 {name:'Adam',time:5.0447,steps:2497,loss:.3149},
 {name:'AdamW',time:4.0875,steps:2384,loss:.3148},
 {name:'Adam, no bias correction',time:3.9327,steps:1702,loss:.3147},
 {name:'Adam, no momentum',time:4.6829,steps:2724,loss:.3155}
]; // Optimization report, p. 7, Table I; Adult, medians over 10 seeds.
export const classifierResults = {
 adult:{label:'Adult income',metric:'Test PR-AUC',rows:[['MLP',.7808],['Linear SVM',.7657],['Decision tree',.7611],['RBF SVM',.7550],['kNN',.7287]]},
 wine:{label:'Wine quality',metric:'Test macro F1',rows:[['kNN',.4654],['Decision tree',.4318],['RBF SVM',.4297],['MLP',.3696],['Linear SVM',.2701]]}
}; // Supervised-learning report, p. 8, conclusion.
export const runtimeResults = {
 gaussian:{label:'Gaussian',rows:[[10,.002,.001],[100,.004,.008],[1000,.038,.6348],[10000,.4533,99.9342]]},
 convex:{label:'Convex',rows:[[100,.005,.008],[1000,.0478,.607],[10000,.4474,63.4843]]},
 explosion:{label:'Explosion',rows:[[100,.005,.0075],[1000,.0391,.6688],[10000,.451,68.5789]]}
}; // Delaunay report, pp. 43–45, Tables 1–3. Zero-rounded and censored times omitted from log plot.
export const rotateQuarter=([x,y],turns=1)=>{
 for(let i=0;i<((turns%4)+4)%4;i++)[x,y]=[-y,x];return [x,y];
};
export const orbit=p=>Array.from({length:4},(_,i)=>rotateQuarter(p,i));
export const hausdorffSets={red:[...orbit([1,4]),...orbit([3,3])],blue:orbit([2,1])};
export const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
export const quotientDistance=(a,b)=>Math.min(...orbit(b).map(p=>distance(a,p)));
export function hausdorffDistance(a,b,metric=distance){
 const directed=(x,y)=>Math.max(...x.map(p=>Math.min(...y.map(q=>metric(p,q)))));
 return Math.max(directed(a,b),directed(b,a));
}
export const lift=([x,y])=>[x,y,x*x+y*y];
export const midpoint=(a,b)=>a.map((v,i)=>(v+b[i])/2);

// Unsupervised report, p. 6 Table III and p. 7 Table IV: separate experiment baselines.
export const representationResults = {
 "reduction": {
  "label": "Dimensionality reduction",
  "rows": [
   {
    "name": "Raw",
    "features": 87,
    "seconds": 26.74,
    "prAuc": 0.7808
   },
   {
    "name": "PCA",
    "features": 24,
    "seconds": 23.98,
    "prAuc": 0.7788
   },
   {
    "name": "ICA",
    "features": 48,
    "seconds": 27.08,
    "prAuc": 0.7769
   },
   {
    "name": "RP",
    "features": 48,
    "seconds": 25.09,
    "prAuc": 0.7796
   }
  ]
 },
 "clusters": {
  "label": "Cluster features",
  "rows": [
   {
    "name": "Raw",
    "features": 87,
    "seconds": 28.53,
    "prAuc": 0.781
   },
   {
    "name": "K-Means only",
    "features": 4,
    "seconds": 29.47,
    "prAuc": 0.602
   },
   {
    "name": "GMM only",
    "features": 10,
    "seconds": 28.56,
    "prAuc": 0.4538
   },
   {
    "name": "Raw + K-Means",
    "features": 91,
    "seconds": 21.81,
    "prAuc": 0.7805
   },
   {
    "name": "Raw + GMM",
    "features": 97,
    "seconds": 23.39,
    "prAuc": 0.7813
   }
  ]
 }
};
// Reinforcement report, p. 6 Table II. Training and frozen greedy evaluation are distinct.
export const reinforcementResults = [
 {
  "environment": "Blackjack",
  "algorithm": "Q-learning",
  "training": -0.0643,
  "evaluation": -0.0407
 },
 {
  "environment": "Blackjack",
  "algorithm": "SARSA",
  "training": -0.0693,
  "evaluation": -0.0587
 },
 {
  "environment": "CartPole",
  "algorithm": "Q-learning",
  "training": 289.0,
  "evaluation": 213.8
 },
 {
  "environment": "CartPole",
  "algorithm": "SARSA",
  "training": 215.5,
  "evaluation": 233.3
 }
];
// Reinforcement report, p. 5 Table I. Grid labels are CartPole discretizations.
export const planningResults = [["1 × 1 × 6 × 12", 500.0, 400.8], ["3 × 3 × 8 × 12", 500.0, 493.4], ["3 × 5 × 10 × 14", 500.0, 110.7]];
