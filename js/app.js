(function(){
"use strict";
const $=s=>document.querySelector(s), esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const P=window.PROJECT, C=window.CONFIG;
const ph=s=>esc(s).replace(/⟦([^⟧]*)⟧/g,(m,x)=>`<span class="ph">${x.trim()||"толтырылады"}</span>`);

/* problem / solution */
$("#probs").innerHTML=["Оқу мақсаттары талдау мен бағалауды талап етеді, тапсырмалар репродуктивтік деңгейде қалып қояды","Ресурстар бытыраңқы: оқулық, тапсырма, ҚМЖ, сөздік әр жерде","Мектептерде 4 баспаның оқулығы бар, бірақ оларды бір сабақта салыстыру құралы жоқ","ЖИ мүмкіндігі бар, бірақ педагогтің сараптамасымен ұштастыратын алгоритм жоқ","Мұғалімнің сабаққа дайындалу уақыты көп"].map(x=>`<li>${x}</li>`).join("");
$("#sols").innerHTML=["«Әдеби экожүйе-4Т» моделі: Тану → Талдау → Талқылау → Туындату","ҚМЖ мен интерактивті сабақ бір дерек көзінен жасалады","Тапсырмадан оқулықтың нақты бетіне бір рет басып өту (4 баспа)","Дағды → формат матрицасы: 8 интерактивті формат","«Педагог – ЖИ» алгоритмі және Сөздікқор боты"].map(x=>`<li>${x}</li>`).join("");

/* model wheel */
const ST=[
 {k:"Т1",t:"ТАНУ",c:"#38bdf8",bl:"Білу · түсіну",goal:"Мәтінмен, автормен, тарихи контекспен танысу; сөздік қорды меңгеру.",tools:["Төрт баспаның оқулығына бет деңгейіндегі гиперсілтеме","«Сөздікқор» боты (sozdikqor.kz)","«Тарихи пазл», таймлайн, карта-квест"]},
 {k:"Т2",t:"ТАЛДАУ",c:"#2563eb",bl:"Қолдану · талдау",goal:"Психологизм, композиция, троп пен фигура, кейіпкерлер жүйесін анықтау.",tools:["Сәйкестендіру, сұрыптау, ретімен қою","Бос орынды толтыру, викторина","Дескриптор бойынша жедел кері байланыс"]},
 {k:"Т3",t:"ТАЛҚЫЛАУ",c:"#8b5cf6",bl:"Бағалау",goal:"Пікір білдіру, дәлелдеу, топпен бағалау, пікірталас.",tools:["Пікір платформасы: келісемін / ішінара / келіспеймін","Зияткерлік алаң: 3 топ, таймер, ұпай кестесі","Кездейсоқ топ пен оқушыны таңдау"]},
 {k:"Т4",t:"ТУЫНДАТУ",c:"#f5c76b",bl:"Жасау",goal:"Эссе, сын мақала, стилизация, жол күнделігі жазу.",tools:["Жазылым алаңы: сөз санағыш","Тексеру парағы (өзін-өзі бағалау)","Мәтінді сақтау және көшіру"]}
];
function arc(cx,cy,r1,r2,a1,a2){const p=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];const [x1,y1]=p(r2,a1),[x2,y2]=p(r2,a2),[x3,y3]=p(r1,a2),[x4,y4]=p(r1,a1);return `M${x1},${y1} A${r2},${r2} 0 0 1 ${x2},${y2} L${x3},${y3} A${r1},${r1} 0 0 0 ${x4},${y4}Z`;}
let svg=`<svg viewBox="0 0 400 400"><defs><radialGradient id="cg"><stop offset="0" stop-color="#132c63"/><stop offset="1" stop-color="#06132e"/></radialGradient></defs>
<circle cx="200" cy="200" r="196" fill="none" stroke="rgba(245,199,107,.35)" stroke-dasharray="3 6"/>
<circle cx="200" cy="200" r="182" fill="none" stroke="rgba(56,189,248,.25)"/>`;
ST.forEach((s,i)=>{const a1=-Math.PI/2+i*Math.PI/2+0.03,a2=a1+Math.PI/2-0.06,am=(a1+a2)/2;
 svg+=`<path class="seg" data-i="${i}" d="${arc(200,200,78,170,a1,a2)}" fill="${s.c}" opacity=".92"/>`;
 const tx=200+124*Math.cos(am),ty=200+124*Math.sin(am);
 svg+=`<text x="${tx}" y="${ty-6}" text-anchor="middle" fill="${i===3?"#1a1405":"#fff"}" font-family="Unbounded,Montserrat,sans-serif" font-size="13" font-weight="800" pointer-events="none">${s.k}</text><text x="${tx}" y="${ty+12}" text-anchor="middle" fill="${i===3?"#1a1405":"#fff"}" font-family="Manrope,sans-serif" font-size="12" font-weight="800" pointer-events="none">${s.t}</text>`;});
svg+=`<circle cx="200" cy="200" r="72" fill="url(#cg)" stroke="#f5c76b" stroke-width="2"/><text x="200" y="190" text-anchor="middle" fill="#f5c76b" font-family="Unbounded,Montserrat,sans-serif" font-size="12" font-weight="800">ОҚУШЫ</text><text x="200" y="208" text-anchor="middle" fill="#fff" font-family="Manrope,sans-serif" font-size="11" font-weight="700">көркем мәтін</text><text x="200" y="224" text-anchor="middle" fill="#9fb3da" font-family="Manrope,sans-serif" font-size="10">ЖИ · бір дерек көзі</text></svg>`;
$("#wheel").innerHTML=svg;
function showStage(i){const s=ST[i];document.querySelectorAll(".seg").forEach(x=>x.classList.toggle("on",+x.dataset.i===i));
 $("#detail").innerHTML=`<span class="tag">${s.k} · ${s.bl}</span><h3>${s.t.charAt(0)+s.t.slice(1).toLowerCase()}</h3><p style="color:#cdd8f0;font-size:16px">${s.goal}</p><span class="who">Платформадағы құралдар</span><ul>${s.tools.map(x=>`<li>${x}</li>`).join("")}</ul>`;}
$("#wheel").addEventListener("click",e=>{const s=e.target.closest(".seg");if(s)showStage(+s.dataset.i);});showStage(0);
let auto=setInterval(()=>{const on=document.querySelector(".seg.on");showStage(((on?+on.dataset.i:0)+1)%4);},4500);
$("#wheel").addEventListener("mouseenter",()=>clearInterval(auto));

/* novelty */
const nb=P.body.find((b,i)=>b[0]==="ol"&&P.body[i-1]&&/ғылыми жаңалығы/.test(P.body[i-1][1]));
const nIc=["🧩","⟳","📚","🎮","🤝"],nT=["«Әдеби экожүйе-4Т» моделі","«Бір дерек көзі» қағидасы","Көпбаспалы гиперсілтеме","«Дағды – формат» матрицасы","«Педагог – ЖИ» алгоритмі"];
$("#nov").innerHTML=nb[1].map((x,i)=>`<div class="card"><div class="ic">${nIc[i]}</div><h3>${nT[i]}</h3><p>${esc(x)}</p></div>`).join("")+`<div class="card" style="background:linear-gradient(150deg,#0a1f4a,#1d4ed8);color:#fff;border:0"><div class="ic" style="background:rgba(255,255,255,.12)">🎯</div><h3 style="color:#fff">Гипотеза</h3><p style="color:#dbe5fb">Модель арқылы талдау дағдылары, оқу уәжі және жазылым сапасы артады, ал мұғалімнің дайындалу уақыты қысқарады.</p></div>`;

/* sites */
$("#sites").innerHTML=C.sites.map(s=>s.url?`<a class="site s${s.grade}" href="${esc(s.url)}" target="_blank" rel="noopener"><span class="g">${s.grade}</span><b>${s.grade}-сынып</b><small>${esc(s.note)}</small><span class="go">Сайтқа өту →</span></a>`:`<div class="site s${s.grade} soon"><span class="g">${s.grade}</span><b>${s.grade}-сынып</b><small>${esc(s.note)}</small><span class="go">Сілтеме қосылады</span></div>`).join("");

/* ecosystem */
$("#eco").innerHTML=(C.extra||[]).map(e=>`<a class="ecard" href="${esc(e.url)}" target="_blank" rel="noopener"><span class="eic">${e.icon}</span><span class="etag">${esc(e.tag)}</span><h3>${esc(e.title)}</h3><p>${esc(e.note)}</p><span class="eurl">${esc(e.url.replace(/^https?:\/\//,"").replace(/\/$/,""))} ↗</span></a>`).join("");
/* matrix */
const mt=P.body.find(b=>b[0]==="table"&&/матрица/.test(b[1].cap))[1];
$("#mtx").innerHTML=`<tr>${mt.head.map(h=>`<th>${esc(h)}</th>`).join("")}</tr>`+mt.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("");
/* demo */
const pairs=[["«Қабағы түнерген хан...»","ашу, кек – портрет"],["«Ержан болса қасымда...»","өкініш – ішкі монолог"],["«Наурызбай гүл-гүл жанады»","шабыт – іс-әрекет"],["«Көп қорқытпа, Наурызбай!»","қайсарлық – диалог"]];
const sh=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(v=>v[1]);
function demo(){let sel=null,ok=0;$("#demofb").textContent="";
 $("#demo").innerHTML=`<div>${sh(pairs.map((p,i)=>[p[0],i])).map(x=>`<button class="mc l" data-i="${x[1]}">${x[0]}</button>`).join("")}</div><div>${sh(pairs.map((p,i)=>[p[1],i])).map(x=>`<button class="mc r" data-i="${x[1]}">${x[0]}</button>`).join("")}</div>`;
 $("#demo").onclick=e=>{const c=e.target.closest(".mc");if(!c)return;
  if(!sel||sel.classList.contains(c.classList.contains("l")?"l":"r")){document.querySelectorAll(".mc.sel").forEach(x=>x.classList.remove("sel"));sel=c;c.classList.add("sel");return;}
  if(sel.dataset.i===c.dataset.i){sel.classList.replace("sel","ok");c.classList.add("ok");ok++;sel=null;if(ok===pairs.length){$("#demofb").innerHTML='Керемет! Барлығы дұрыс 🎉 <button class="btn sm blue" id="again">Қайта</button>';$("#again").onclick=demo;}}
  else{const s=sel;c.classList.add("no");s.classList.add("no");setTimeout(()=>{c.classList.remove("no");s.classList.remove("no","sel");},450);sel=null;}};}
demo();

/* ai */
const steps=[["Педагог","Жобалау","Тақырып, оқу мақсаты, сабақ идеясы, ҚМЖ үлгісі"],["ЖИ + педагог","Цифрландыру","Оқулық беттерін OCR, тақырып беттерін анықтау"],["ЖИ","Генерация","Құрылым бойынша тапсырма, ойын, дескриптордың алғашқы нұсқасы"],["Педагог","Сараптама","Факт, дәйексөз, термин, оқу мақсатына сәйкестік, сауаттылық"],["Педагог + оқушы","Сынақ","Сабақта қолдану, кері байланыс, жетілдіру"]];
$("#steps").innerHTML=steps.map((s,i)=>`<div class="step ${/^Педагог/.test(s[0])?"h":""}"><div class="n">${i+1}</div><span class="who">${s[0]}</span><h4>${s[1]}</h4><p>${s[2]}</p></div>`).join("");
const at=P.body.find(b=>b[0]==="table"&&/6\.8/.test(b[1].cap))[1];
$("#aitbl").innerHTML=`<tr>${at.head.map(h=>`<th>${esc(h)}</th>`).join("")}</tr>`+at.rows.map(r=>`<tr>${r.map(c=>`<td>${ph(c)}</td>`).join("")}</tr>`).join("");

/* results */
const A=C.approbation;
if(A.period||A.expGroup) $("#expinfo").innerHTML=`Кезеңі: <b>${esc(A.period||"")}</b>. Тәжірибелік топ: <b>${esc(A.expGroup||"")}</b>. Бақылау тобы: <b>${esc(A.ctrlGroup||"")}</b>.`;
const pend=t=>`<div class="pending">📊 ${t}<br><small>Апробация деректері <b>data/config.js</b> файлына енгізілгенде диаграмма автоматты түрде шығады.</small></div>`;
function bars(groups,labels,series,colors,max,unit){return `<div class="bars">${groups.map((g,gi)=>`<div class="bg">${series.map((s,si)=>`<div class="bar" style="height:0;background:${colors[si]}" data-h="${(s[gi]/max*100).toFixed(1)}"><i>${s[gi]}${unit}</i></div>`).join("")}</div>`).join("")}</div><div class="xl">${groups.map(g=>`<span>${g}</span>`).join("")}</div><div class="legend">${labels.map((l,i)=>`<span><i style="background:${colors[i]}"></i>${l}</span>`).join("")}</div>`;}
const lv=["Жоғары","Орта","Төмен"];
const charts=[];
if(A.expBefore&&A.expAfter) charts.push(`<div class="chart"><h4>Тәжірибелік топ (107 оқушы): деңгейлер, %</h4>${bars(lv,["Бастапқы","Қорытынды"],[A.expBefore,A.expAfter],["#93c5fd","#1d4ed8"],100,"%")}</div>`);
if(A.ctrlBefore&&A.ctrlAfter) charts.push(`<div class="chart"><h4>Бақылау тобы (11 оқушы): деңгейлер, %</h4>${bars(lv,["Бастапқы","Қорытынды"],[A.ctrlBefore,A.ctrlAfter],["#e5e7eb","#64748b"],100,"%")}</div>`);
if(A.expBefore&&A.expAfter){ const q=x=>Math.round((x[0]+x[1])*10)/10;
  charts.push(`<div class="chart"><h4>Сапа көрсеткіші (жоғары + орта), %</h4>${bars(["Тәжірибелік топ"],["Бастапқы","Қорытынды"],[[A.quality?A.quality[0]:q(A.expBefore)],[A.quality?A.quality[1]:q(A.expAfter)]],["#fde68a","#e9a93a"],100,"%")}</div>`);
  charts.push(`<div class="chart" style="display:flex;flex-direction:column;justify-content:center;gap:14px"><h4>Тәжірибелік топтағы негізгі өзгерістер</h4>
   <div style="font-size:15px"><b style="font:900 30px Unbounded,Montserrat,sans-serif;color:#1d4ed8">+14,1 п.т.</b><br>жоғары деңгей: 30 → 45 оқушы</div>
   <div style="font-size:15px"><b style="font:900 30px Unbounded,Montserrat,sans-serif;color:#10b981">2,4 есе</b><br>төмен деңгей азайды: 12 → 5 оқушы</div>
   <div style="font-size:15px"><b style="font:900 30px Unbounded,Montserrat,sans-serif;color:#e9a93a">35 мин</b><br>бір сабаққа дайындалу уақыты</div></div>`);}
if(A.critBefore&&A.critAfter) charts.push(`<div class="chart"><h4>Критерийлер бойынша орташа балл (5-тен)</h4>${bars(["К1","К2","К3","К4"],["Бастапқы","Қорытынды"],[A.critBefore,A.critAfter],["#fde68a","#e9a93a"],5,"")}</div>`);
$("#charts").innerHTML=charts.join("")||`<div class="chart">${pend("Деректер енгізілуде")}</div>`;
$("#crit").innerHTML=[["К1","Сюжет пен композиция"],["К2","Психологизм"],["К3","Көркемдік құралдар, стиль"],["К4","Идея, кейіпкерлер жүйесі"]].map(c=>`<div class="card"><div class="ic">📏</div><h3>${c[0]} · 5 балл</h3><p>${c[1]}</p></div>`).join("");

/* roadmap */
const rd=P.body.find(b=>b[0]==="table"&&/жол картасы/.test(b[1].cap))[1];
$("#road").innerHTML=rd.rows.map((r,i)=>`<div class="rs"><span class="dot">${i+1}</span><h4 style="color:#fff">${esc(r[0].replace(/^\d\.\s*/,""))}</h4><p style="color:#b9c7e6">${esc(r[1])}</p><p style="color:var(--gold);font-weight:800;margin-top:6px;font-size:13.5px">→ ${esc(r[2])}</p></div>`).join("");

/* reader */
function block(b){const [k,v,o]=b;
 if(k==="h1")return `<h3>${esc(v)}</h3>`; if(k==="h2")return `<h4>${esc(v)}</h4>`;
 if(k==="p")return o&&o.center?`<p style="text-align:center;text-indent:0"><b>${ph(v)}</b></p>`:`<p>${ph(v)}</p>`;
 if(k==="ol")return `<ol>${v.map(x=>`<li>${ph(x)}</li>`).join("")}</ol>`; if(k==="ul")return `<ul>${v.map(x=>`<li>${ph(x)}</li>`).join("")}</ul>`;
 if(k==="fig")return `<figure><img src="${esc(v)}" alt=""><figcaption><i>${esc(o)}</i></figcaption></figure>`;
 if(k==="table")return `${v.cap?`<p class="cap">${esc(v.cap)}</p>`:""}<table><tr>${v.head.map(h=>`<th>${esc(h)}</th>`).join("")}</tr>${v.rows.map(r=>`<tr>${r.map(c=>`<td>${ph(c)}</td>`).join("")}</tr>`).join("")}</table>`;
 return "";}
const M=P.meta;
$("#reader").innerHTML=`<p style="text-align:center;text-indent:0"><b>${esc(M.contest)}</b><br>Номинация: ${esc(M.nomination)}</p><h3 style="margin-top:10px">${esc(M.title)}</h3><p style="text-align:right;text-indent:0">Автор: <b>${esc(M.author)}</b>,<br>${esc(M.role)}<br>${esc(M.creds)}</p>
<h3>АННОТАЦИЯ</h3><p>${ph(P.annotation)}</p><p><b>Түйін сөздер:</b> <i>${esc(P.keywords)}</i></p>${P.body.map(block).join("")}
<h3>ПАЙДАЛАНЫЛҒАН ДЕРЕККӨЗДЕР ТІЗІМІ</h3><ol>${P.sources.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>
<h3>ҚОСЫМШАЛАР</h3>${P.appendices.map(a=>`<h4>${esc(a.t)}</h4>${a.blocks.map(block).join("")}`).join("")}`;

/* ui */
const nav=$("#nav"),pbar=$("#pbar");addEventListener("scroll",()=>{nav.classList.toggle("solid",scrollY>40);const h=document.documentElement;pbar.style.width=(scrollY/(h.scrollHeight-innerHeight)*100)+"%";});
document.querySelectorAll("video").forEach(v=>v.addEventListener("play",()=>document.querySelectorAll("video").forEach(o=>{if(o!==v)o.pause();})));
$("#burger").onclick=()=>$("#links").classList.toggle("open");
document.querySelectorAll("#links a").forEach(a=>a.onclick=()=>$("#links").classList.remove("open"));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add("in");
 e.target.querySelectorAll("[data-count]").forEach(el=>{const n=+el.dataset.count;let i=0;const t=setInterval(()=>{i+=Math.ceil(n/30);if(i>=n){i=n;clearInterval(t);}el.textContent=i;},30);});
 e.target.querySelectorAll(".bar").forEach(b=>b.style.height=b.dataset.h+"%");io.unobserve(e.target);}),{threshold:.15});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
})();
