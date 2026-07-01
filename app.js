/* ===== app.js ===== */
(function(){
  var root=document.documentElement, MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
  function currentFile(){ var f=location.pathname.split('/').pop(); return (!f||f==='')?'index.html':f; }
  function applyTheme(t){ root.setAttribute('data-theme',t); var tb=document.getElementById('themeToggle'); if(tb){ tb.textContent=(t==='light')?'☾':'☀'; tb.setAttribute('aria-label',t==='light'?'Switch to dark mode':'Switch to light mode'); } }
  var cur='dark'; try{ var s=localStorage.getItem('eg-theme'); if(s) cur=s; }catch(e){}
  document.addEventListener('DOMContentLoaded',function(){
    applyTheme(cur);
    var tb=document.getElementById('themeToggle');
    if(tb) tb.addEventListener('click',function(){ cur=(cur==='dark')?'light':'dark'; applyTheme(cur); try{localStorage.setItem('eg-theme',cur);}catch(e){} });
    var sb=document.getElementById('sidebar'), ov=document.getElementById('overlay'), hb=document.getElementById('hamburger');
    if(hb) hb.addEventListener('click',function(){ sb.classList.add('open'); ov.classList.add('show'); });
    if(ov) ov.addEventListener('click',function(){ sb.classList.remove('open'); ov.classList.remove('show'); });
    initQuizzes();
    fetch('issues.json').then(function(r){return r.json();}).then(buildTree).catch(function(){});
    fetch('search-index.json').then(function(r){return r.json();}).then(wireSearch).catch(function(){});
  });
  function initQuizzes(){
    document.querySelectorAll('.quiz').forEach(function(q){
      var choices=q.querySelectorAll('.choice'), rat=q.querySelector('.rationale'), rst=q.querySelector('.reset'), done=false;
      choices.forEach(function(b){ b.addEventListener('click',function(){
        if(done)return; done=true;
        if(b.getAttribute('data-correct')==='true'){ b.classList.add('correct'); }
        else { b.classList.add('wrong'); choices.forEach(function(x){ if(x.getAttribute('data-correct')==='true') x.classList.add('correct'); }); }
        choices.forEach(function(x){ x.disabled=true; });
        if(rat) rat.classList.add('show'); if(rst) rst.classList.add('show');
      }); });
      if(rst) rst.addEventListener('click',function(){ done=false; choices.forEach(function(x){ x.disabled=false; x.classList.remove('correct','wrong'); }); if(rat)rat.classList.remove('show'); rst.classList.remove('show'); });
    });
  }
  function buildTree(list){
    var el=document.getElementById('tree'); if(!el)return;
    var byY={}; list.forEach(function(it){ var p=it.id.split('-'); var y=p[0], m=parseInt(p[1],10)-1; byY[y]=byY[y]||{}; byY[y][m]=byY[y][m]||[]; byY[y][m].push(it); });
    var cf=currentFile(), html='';
    Object.keys(byY).sort().reverse().forEach(function(y){
      var months=byY[y], cnt=Object.keys(months).reduce(function(a,m){return a+months[m].length;},0);
      html+='<div class="tnode year open"><div class="trow"><span class="caret">▶</span><span>'+y+'</span><span class="tcount">('+cnt+')</span></div><div class="tchildren">';
      Object.keys(months).map(Number).sort(function(a,b){return b-a;}).forEach(function(m){
        var lst=months[m].sort(function(a,b){return a.id<b.id?1:-1;});
        html+='<div class="tnode month open"><div class="trow"><span class="caret">▶</span><span>'+MONTHS[m]+'</span><span class="tcount">('+lst.length+')</span></div><div class="tchildren">';
        lst.forEach(function(it){ var d=parseInt(it.id.split('-')[2],10); var act=(it.file===cf)?' active':''; html+='<a class="issue-link'+act+'" href="'+it.file+'">'+MONTHS[m]+' '+d+'</a>'; });
        html+='</div></div>';
      });
      html+='</div></div>';
    });
    el.innerHTML=html;
    el.querySelectorAll('.trow').forEach(function(r){ r.addEventListener('click',function(){ r.parentElement.classList.toggle('open'); }); });
  }
  function wireSearch(idx){
    var input=document.getElementById('search'), res=document.getElementById('results'), arch=document.getElementById('archive');
    if(!input)return;
    input.addEventListener('input',function(e){
      var q=e.target.value.trim().toLowerCase();
      if(!q){ res.innerHTML=''; if(arch)arch.style.display=''; return; }
      if(arch)arch.style.display='none';
      var hits=idx.filter(function(it){ return (it.weekOf+' '+it.text).toLowerCase().indexOf(q)!==-1; });
      if(!hits.length){ res.innerHTML='<div class="no-results">No issues match “'+e.target.value+'”.</div>'; return; }
      res.innerHTML='<div class="results-head">'+hits.length+' issue'+(hits.length>1?'s':'')+' found</div>'+hits.map(function(it){
        var snip=it.text.replace(/\s+/g,' ').trim().slice(0,90);
        return '<a class="result" href="'+it.file+'"><span class="r-date">'+it.weekOf+'</span><span class="r-snip">'+snip+'…</span></a>';
      }).join('');
    });
  }
})();
/* ===== end app.js ===== */
