// 사람처럼 반응이 늦고 실수하는 봇으로 여러 판을 돌려 난이도를 측정
(()=>{
window.requestAnimationFrame=()=>0;
window.sfx=()=>{};window.buzz=()=>{};window.pop=()=>{};window.hud=()=>{};window.track=()=>{};
let dead=false;window.die=()=>{dead=true;S.mode="over"};
function mulb(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
window.runOne=(seed,prof)=>{
  const br=mulb(seed*7+13);
  reset(seed,null);S.tut=false;S.mode="play";dead=false;
  const DT=1/60;let t=0,cd=0,queue=[],deathLevel=0,bossDeath=false,maxCombo=0;
  // 봇은 prof.delay초 전의 상태를 보고 판단 (사람의 반응 속도)
  const hist=[];
  while(!dead&&t<240){
    const b=S.b,p=S.p;
    hist.push({t,gap:b&&b.floors.length?b.by-(p.py+PH):999,vb:b?b.vb:0,py:p.py});
    const seen=hist.find(h=>h.t>=t-prof.delay)||hist[0];
    while(hist.length&&hist[0].t<t-prof.delay-0.1)hist.shift();
    cd-=DT;
    if(cd<=0&&b&&b.floors.length){
      const g=seen.gap;
      if(g<=REACH+prof.slop&&g>=-14){ if(br()>prof.miss){slash()} cd=1/prof.tps }
      else if(seen.py<=0.5&&g<prof.jumpAt&&g>REACH&&seen.vb<0){ slash(); cd=1/prof.tps }
      if(seen.py<=0.5&&g<prof.guardAt&&g>0&&seen.vb<-150&&br()<prof.guardUse)guard();
    }
    step(DT);t+=DT;maxCombo=Math.max(maxCombo,S.combo);
  }
  return{seed,level:S.level,boss:!!(S.b&&S.b.boss),score:S.score,floors:S.floorsBroken,time:Math.round(t),pierce:S.maxPierce,maxCombo};
};
})();
