var navToggle=document.getElementById('navToggle'),navlist=document.getElementById('navlist');
if(navToggle&&navlist){navToggle.addEventListener('click',function(){var open=navlist.classList.toggle('open');navToggle.setAttribute('aria-expanded',open?'true':'false');});}
var navLinks=Array.prototype.slice.call(document.querySelectorAll('#navlist a'));
navLinks.forEach(function(a){a.addEventListener('click',function(){if(navlist)navlist.classList.remove('open');});});
var toTopEl=document.getElementById('toTop');
if(toTopEl)toTopEl.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});

var themeBtn=document.getElementById('themeToggle'),themeIcon=document.getElementById('themeIcon');
var moonPath='<path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" fill="currentColor" stroke="none"/>';
var sunPath='<path d="M12 3v1M12 20v1M4.2 4.2l.8.8M19 19l.8.8M3 12h1M20 12h1M4.2 19.8l.8-.8M19 5l.8-.8"/><circle cx="12" cy="12" r="5"/>';
function setThemeIcon(dark){if(themeIcon)themeIcon.innerHTML=dark?moonPath:sunPath;}
if(themeBtn&&document.body.classList.contains('dark')){setThemeIcon(true);themeBtn.setAttribute('aria-pressed','true');}
if(themeBtn)themeBtn.addEventListener('click',function(){
  var dark=document.body.classList.toggle('dark');
  try{localStorage.setItem('theme',dark?'dark':'light');}catch(e){}
  setThemeIcon(dark);
  themeBtn.setAttribute('aria-pressed',dark?'true':'false');
});

document.querySelectorAll('[data-track]').forEach(function(el){
  el.addEventListener('click',function(){
    try{
      var log=JSON.parse(localStorage.getItem('engagement')||'[]');
      log.push({event:el.getAttribute('data-track'),t:Date.now()});
      if(log.length>200)log=log.slice(-200);
      localStorage.setItem('engagement',JSON.stringify(log));
    }catch(e){}
  });
});

var rail=document.getElementById('progressRail');
var headerEl=document.querySelector('header');
window.addEventListener('scroll',function(){
  var h=document.documentElement;
  var pct=(h.scrollTop)/((h.scrollHeight-h.clientHeight)||1)*100;
  if(rail)rail.style.width=pct+'%';
  if(headerEl)headerEl.classList.toggle('scrolled',h.scrollTop>4);
},{passive:true});

function animateCount(el){
  var target=+el.getAttribute('data-count'),cur=0;
  var step=Math.max(1,Math.round(target/40));
  var t=setInterval(function(){
    cur+=step;
    if(cur>=target){cur=target;clearInterval(t);}
    el.textContent=cur;
  },30);
}

var io=new IntersectionObserver(function(entries){
  entries.forEach(function(en){
    if(en.isIntersecting){
      en.target.classList.add('in');
      en.target.querySelectorAll('[data-count]').forEach(function(c){if(!c.dataset.done){c.dataset.done='1';animateCount(c);}});
      io.unobserve(en.target);
    }
  });
},{threshold:.15});
document.querySelectorAll('.reveal,.reveal-stagger').forEach(function(s){io.observe(s);});

var proofIo=new IntersectionObserver(function(entries){
  entries.forEach(function(en){
    if(en.isIntersecting){
      en.target.querySelectorAll('[data-count]').forEach(function(c){if(!c.dataset.done){c.dataset.done='1';animateCount(c);}});
      proofIo.unobserve(en.target);
    }
  });
},{threshold:.3});
var proofEl=document.getElementById('proof');
if(proofEl)proofIo.observe(proofEl);

/* scrollspy */
var sections=navLinks.map(function(a){return document.querySelector(a.getAttribute('href'));}).filter(Boolean);
var spyIo=new IntersectionObserver(function(entries){
  entries.forEach(function(en){
    var link=document.querySelector('#navlist a[href="#'+en.target.id+'"]');
    if(!link)return;
    if(en.isIntersecting){navLinks.forEach(function(a){a.classList.remove('active');});link.classList.add('active');}
  });
},{rootMargin:'-40% 0px -55% 0px'});
sections.forEach(function(s){spyIo.observe(s);});

/* WhatsApp FAB reveal handled by CSS animation (see .wa-fab), no JS dependency */

/* Chat widget */
(function(){
  // Key intentionally client-side — accepted exposure, no proxy. rev3
  var LLM_ENDPOINT='https://little-field-6e85.keyurshah12345.workers.dev';
  var LLM_MODEL='openai/gpt-oss-120b';
  var SYSTEM_PROMPT="You are Keyur Shah, replying in first person on your own portfolio site to a visitor. Facts about you: Project Manager & Scrum Master at Coforge (Jan 2026-present, 12+ years in IT). Career: QA Engineer at Squad Technology (2013-16) -> Senior QA Engineer at Atlas Softweb (2016-19) -> Senior QA Engineer & Scrum Master at Encora (2019-2025), promoted internally to QA Lead then Project Manager by Dec 2025 -> Project Manager & Scrum Master at Coforge (Jan 2026-present). Certifications: CSM, PSM, ISTQB CTFL, Microsoft AZ-900. Skills: Agile/Scrum delivery, sprint/release planning, stakeholder & risk management, QA strategy, Selenium, Katalon, Postman, JMeter, Power BI, DAX, Claude/LLM API integration. Side projects: Key-SplitEasy (Firebase PWA expense splitter), Sprint Copilot Web (AI story/test generation), Key QA Buddy (Chrome extension), WhatsApp Automation Bot, Claude Desktop Scheduler Pro, DAX Optimizer. Education: B.E. Information Technology, ADIT College (GTU), 2009-2013. Contact: keyurshah12345@gmail.com, LinkedIn linkedin.com/in/keyur-shah-pm. If someone asks about a job opportunity, collaboration or hiring, respond warmly and openly as Keyur, show genuine interest, and ask them to share details over email or LinkedIn. Keep replies short (2-4 sentences), warm, confident and professional. Never invent facts not listed here.";
  var KB=[
    {k:['experience','years','background'],a:"I have 12+ years in IT: started as a QA Engineer, moved up to Senior QA Engineer & Scrum Master, and I'm now a Project Manager & Scrum Master at Coforge."},
    {k:['skill','tech','stack','tools'],a:"My core skills: Agile/Scrum delivery, QA strategy & automation (Selenium, Katalon), Power BI/DAX, and AI automation with Claude/LLM APIs."},
    {k:['project','build','portfolio','work'],a:"Some things I've built: Key-SplitEasy (Firebase PWA), Sprint Copilot Web (AI story/test generation), Key QA Buddy (Chrome extension), and a DAX Optimizer. Check the Projects section above."},
    {k:['certif','csm','psm','istqb'],a:"I hold CSM, PSM, ISTQB CTFL and Microsoft AZ-900."},
    {k:['job','hire','opportunity','role','position'],a:"I'm always open to hearing about interesting roles \u2014 send me the details over email (keyurshah12345@gmail.com) or LinkedIn and I'll get back to you personally."},
    {k:['contact','email','reach'],a:"Best way to reach me: email keyurshah12345@gmail.com or connect on LinkedIn (linked in the Contact section)."},
    {k:['resume','cv','download'],a:"You can download my full resume from the Download Resume button in the hero or Experience section."},
    {k:['scrum','agile','pm','manager'],a:"I'm a Project Manager & Scrum Master at Coforge \u2014 running sprint planning, backlog refinement, retrospectives and stakeholder/risk management."},
    {k:['bi','power bi','dax','data'],a:"I work with Power BI & DAX for dashboards, reporting and data validation, and built a DAX Optimizer tool for anti-pattern detection."},
    {k:['ai','automation','claude','llm'],a:"I build practical AI tools \u2014 Claude/LLM API integrations for QA test generation, bug analysis, sprint planning and reporting."},
    {k:['education','degree','college'],a:"B.E. Information Technology, ADIT College (GTU), 2009\u20132013."},
    {k:['hi','hello','hey'],a:"Hi! I'm Keyur \u2014 well, an AI trained on my background. Ask me about my experience, skills, projects, or a job opportunity."}
  ];
  var history=[];
  var quick=['My experience','Skills','Projects','Hiring / job opportunity'];
  var widget=document.getElementById('chatWidget'),fab=document.getElementById('chatFab'),close=document.getElementById('chatClose');
  var body=document.getElementById('chatBody'),form=document.getElementById('chatForm'),input=document.getElementById('chatText'),qwrap=document.getElementById('chatQuick');
  if(!widget||!fab||!close||!body||!form||!input||!qwrap)return;
  function addMsg(text,who){
    var d=document.createElement('div');
    d.className='msg '+who;
    d.textContent=text;
    body.appendChild(d);
    body.scrollTop=body.scrollHeight;
    return d;
  }
  function kbReply(q){
    var ql=' '+q.toLowerCase()+' ';
    for(var i=0;i<KB.length;i++){
      for(var j=0;j<KB[i].k.length;j++){
        var esc=KB[i].k[j].replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
        if(new RegExp('(^|[^a-z])'+esc+'([^a-z]|$)').test(ql))return KB[i].a;
      }
    }
    return "That's not something I've got a canned answer for \u2014 email me at keyurshah12345@gmail.com and I'll reply personally.";
  }
  function askLLM(q,onDone){
    history.push({role:'user',content:q});
    var ctrl=(typeof AbortController!=='undefined')?new AbortController():null;
    var timer=ctrl?setTimeout(function(){ctrl.abort();},12000):null;
    fetch(LLM_ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      signal:ctrl?ctrl.signal:undefined,
      body:JSON.stringify({model:LLM_MODEL,messages:[{role:'system',content:SYSTEM_PROMPT}].concat(history.slice(-8))})
    }).then(function(r){if(!r.ok)throw new Error('http '+r.status);return r.json();}).then(function(d){
      clearTimeout(timer);
      var txt=d&&d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content;
      if(!txt||!txt.trim())throw new Error('empty');
      history.push({role:'assistant',content:txt});
      if(history.length>40)history=history.slice(-40);
      onDone(txt.trim());
    }).catch(function(){clearTimeout(timer);history.pop();onDone(kbReply(q));});
  }
  quick.forEach(function(t){
    var b=document.createElement('button');
    b.type='button';b.className='qchip';b.textContent=t;
    b.addEventListener('click',function(){addMsg(t,'user');var typ=addMsg('...','bot typing');askLLM(t,function(a){typ.textContent=a;typ.className='msg bot';});});
    qwrap.appendChild(b);
  });
  fab.addEventListener('click',function(){
    widget.classList.add('open');
    if(!body.childElementCount)addMsg("Hi! I'm an AI trained on Keyur's background \u2014 ask me about his experience, skills, projects, or a job opportunity.",'bot');
  });
  close.addEventListener('click',function(){widget.classList.remove('open');});
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var q=input.value.trim();
    if(!q)return;
    addMsg(q,'user');
    input.value='';
    var typ=addMsg('...','bot typing');
    askLLM(q,function(a){typ.textContent=a;typ.className='msg bot';});
  });
})();

(function(){
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced)return;
  var glow=document.createElement('div');
  glow.className='cursor-glow';
  document.body.appendChild(glow);
  var fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(fine){
    document.addEventListener('mousemove',function(e){
      glow.style.transform='translate('+e.clientX+'px,'+e.clientY+'px) translate(-50%,-50%)';
      glow.classList.add('active');
    },{passive:true});
    document.addEventListener('mouseleave',function(){glow.classList.remove('active');});
  }
  document.querySelectorAll('.pillar-card,.skill-card,.project-card,.flow-card,.cert-card').forEach(function(el){
    el.addEventListener('mousemove',function(e){
      var r=el.getBoundingClientRect();
      el.style.setProperty('--mx',(e.clientX-r.left)+'px');
      el.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
  });
  if(fine){
    document.querySelectorAll('.project-card,.pillar-card').forEach(function(el){
      el.addEventListener('mousemove',function(e){
        var r=el.getBoundingClientRect();
        var px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
        el.style.transform='perspective(700px) rotateX('+(py*-6)+'deg) rotateY('+(px*6)+'deg) translateY(-6px)';
      });
      el.addEventListener('mouseleave',function(){el.style.transform='';});
    });
    document.querySelectorAll('.btn-primary,.chat-fab,.wa-fab').forEach(function(btn){
      btn.addEventListener('mousemove',function(e){
        var r=btn.getBoundingClientRect();
        var mx=(e.clientX-r.left-r.width/2)*.25, my=(e.clientY-r.top-r.height/2)*.25;
        btn.style.transform='translate('+mx+'px,'+my+'px)';
      });
      btn.addEventListener('mouseleave',function(){btn.style.transform='';});
    });
    var hero=document.getElementById('hero');
    if(hero){
      var orb1=hero.querySelector('.orb1'),orb2=hero.querySelector('.orb2'),aurora=hero.querySelector('.aurora');
      hero.addEventListener('mousemove',function(e){
        var r=hero.getBoundingClientRect();
        var px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
        if(orb1)orb1.style.transform='translate('+(px*30)+'px,'+(py*30)+'px)';
        if(orb2)orb2.style.transform='translate('+(px*-24)+'px,'+(py*-24)+'px)';
        if(aurora)aurora.style.transform='translate('+(px*14)+'px,'+(py*14)+'px)';
      });
    }
  }
})();
