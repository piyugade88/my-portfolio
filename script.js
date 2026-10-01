(function(){
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

// mobile nav
const nav=$('nav .nav-inner'),links=$('.nav-links');
const tg=document.createElement('button');tg.className='nav-toggle';tg.setAttribute('aria-label','Menu');tg.innerHTML='<span></span><span></span><span></span>';
nav.appendChild(tg);tg.onclick=()=>links.classList.toggle('open');

// scroll progress in nav
const bar=document.createElement('div');bar.className='nav-progress';$('nav').appendChild(bar);
addEventListener('scroll',()=>{const h=document.documentElement;bar.style.width=(h.scrollTop/((h.scrollHeight-h.clientHeight)||1)*100)+'%';},{passive:true});

// reveal cards one after another
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12});
$$('.skill-card,.info-card,.tl-item,.exp-card,.activity-card,.contact-card,.proj').forEach((el,i)=>{el.classList.add('reveal');el.style.transitionDelay=(i%4)*70+'ms';io.observe(el);});

// cursor glow
if(!rm&&matchMedia('(hover:hover)').matches){const g=document.createElement('div');g.className='cursor-glow';document.body.appendChild(g);
addEventListener('mousemove',e=>{g.style.left=e.clientX+'px';g.style.top=e.clientY+'px';},{passive:true});}

// typed roles + network (home only)
const typed=$('#typed');
if(typed){
  const roles=['Data Science Engineer','NLP & Deep Learning builder','IoT problem solver','Software Developer'];
  if(rm){typed.textContent=roles[0];}else{let r=0,c=0,del=false;
    (function tick(){const w=roles[r];typed.textContent=w.slice(0,c);
      if(!del&&c===w.length){del=true;return setTimeout(tick,1600);}
      if(del&&c===0){del=false;r=(r+1)%roles.length;}
      c+=del?-1:1;setTimeout(tick,del?30:70);})();}
  const hero=$('.hero');
  if(!rm){const cv=document.createElement('canvas');cv.id='net';hero.prepend(cv);const x=cv.getContext('2d');
    let W,H,pts=[],m={x:-999,y:-999};
    const size=()=>{W=cv.width=hero.clientWidth;H=cv.height=hero.clientHeight;const n=Math.min(70,Math.floor(W*H/17000));
      pts=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}));};
    size();addEventListener('resize',size);
    hero.addEventListener('mousemove',e=>{const b=hero.getBoundingClientRect();m.x=e.clientX-b.left;m.y=e.clientY-b.top;});
    hero.addEventListener('mouseleave',()=>{m.x=m.y=-999;});
    (function draw(){x.clearRect(0,0,W,H);
      pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
        const dx=m.x-p.x,dy=m.y-p.y,d=Math.hypot(dx,dy);if(d<140){p.x+=dx*.01;p.y+=dy*.01;}
        x.fillStyle='rgba(167,139,250,.7)';x.beginPath();x.arc(p.x,p.y,1.8,0,6.3);x.fill();});
      for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
        if(d<120){x.strokeStyle='rgba(124,110,247,'+(.35*(1-d/120))+')';x.beginPath();x.moveTo(pts[i].x,pts[i].y);x.lineTo(pts[j].x,pts[j].y);x.stroke();}}
      requestAnimationFrame(draw);})();
    // avatar tilts toward the cursor
    const av=$('.hero-avatar');hero.addEventListener('mousemove',e=>{const b=av.getBoundingClientRect();
      const dx=(e.clientX-b.left-b.width/2)/b.width,dy=(e.clientY-b.top-b.height/2)/b.height;
      av.style.transform=`perspective(500px) rotateY(${dx*10}deg) rotateX(${-dy*10}deg)`;});
  }
}

// skills filter
const fb=$$('.filter-btn');
fb.forEach(b=>b.onclick=()=>{fb.forEach(o=>o.classList.toggle('on',o===b));const f=b.dataset.f;
  $$('.skill-card').forEach(c=>c.classList.toggle('dim',f!=='all'&&c.dataset.cat!==f));});

// project accordion
$$('.proj-head').forEach(h=>h.onclick=()=>{const p=h.parentElement,o=p.classList.toggle('open');h.setAttribute('aria-expanded',o);});
const first=$('.proj');if(first){first.classList.add('open');}
})();

// v3: count-up stats, timeline draw, ticker clone, button ripple-follow
(function(){
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$=(s)=>[...document.querySelectorAll(s)];
const t=document.querySelector('.ticker-track');
if(t)t.innerHTML+=t.innerHTML;
const o=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;o.unobserve(e.target);
  const el=e.target;
  if(el.matches('.timeline'))el.classList.add('in');
  if(el.matches('[data-count]')){const to=parseFloat(el.dataset.count),d=to%1?2:0;
    if(rm){el.textContent=to.toFixed(d);return;}
    const s=performance.now();(function f(n){const p=Math.min((n-s)/1200,1);el.textContent=(to*(1-Math.pow(1-p,3))).toFixed(d);if(p<1)requestAnimationFrame(f);})(s);}
}),{threshold:.4});
$$('.timeline,[data-count]').forEach(el=>o.observe(el));
// buttons lean toward cursor
if(!rm)$$('.btn-primary,.btn-outline').forEach(b=>{
  b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.2}px)`;});
  b.addEventListener('mouseleave',()=>{b.style.transform='';});b.style.transition='transform .2s,opacity .2s,border-color .2s';});
})();
