import asyncio,json,sys,statistics as st
from playwright.async_api import async_playwright
PROFILES={
 "초보":{"delay":0.28,"miss":0.25,"tps":5,"slop":0,"jumpAt":150,"guardAt":45,"guardUse":0.35},
 "보통":{"delay":0.20,"miss":0.12,"tps":7,"slop":2,"jumpAt":180,"guardAt":45,"guardUse":0.6},
 "고수":{"delay":0.13,"miss":0.05,"tps":9,"slop":4,"jumpAt":200,"guardAt":45,"guardUse":0.85},
}
N=int(sys.argv[2]) if len(sys.argv)>2 else 60
async def main():
    page_file=sys.argv[1] if len(sys.argv)>1 else '/home/claude/building-slash.html'
    body=open(page_file).read()
    open('/home/claude/balance/page.html','w').write('<!doctype html><html><head><meta charset="utf-8"></head><body>'+body+'</body></html>')
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':420,'height':900})
        await pg.goto('file:///home/claude/balance/page.html');await pg.wait_for_timeout(300)
        await pg.add_script_tag(path='/home/claude/balance/sim_real.js')
        out={}
        for name,prof in PROFILES.items():
            rs=await pg.evaluate(f'(()=>{{const r=[];for(let s=1;s<={N};s++)r.push(runOne(s*1009,{json.dumps(prof)}));return r}})()')
            out[name]=rs
            lv=[r['level'] for r in rs]; tm=[r['time'] for r in rs]
            boss=sum(1 for r in rs if r['boss']); 
            dist={}
            for l in lv: dist[l]=dist.get(l,0)+1
            print(f"[{name}] 죽은 건물 중앙값 {st.median(lv)}번째 · 평균 생존 {st.mean(tm):.0f}초 (중앙 {st.median(tm)}초) · 보스에서 사망 {boss}/{N} · 최대관통 평균 {st.mean(r['pierce'] for r in rs):.1f}")
            print("   건물별 사망:",dict(sorted(dist.items())))
        json.dump(out,open('/home/claude/balance/result.json','w'),ensure_ascii=False)
        await b.close()
asyncio.run(main())
