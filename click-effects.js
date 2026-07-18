(()=>{
  if(window.__sonicLabClickEffects||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  window.__sonicLabClickEffects=true;
  const style=document.createElement('style');
  style.textContent=`.sl-click-fx{--fx-size:58px;position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:99999;isolation:isolate}.sl-click-ring{position:absolute;left:calc(var(--fx-size)*-.5);top:calc(var(--fx-size)*-.5);width:var(--fx-size);height:var(--fx-size);border:2px solid rgba(132,111,255,.9);border-radius:50%;box-shadow:0 0 18px rgba(112,89,255,.4),inset 0 0 12px rgba(154,138,255,.16);animation:sl-ring .48s cubic-bezier(.2,.75,.25,1) forwards}.sl-click-core{position:absolute;left:-3px;top:-3px;width:6px;height:6px;border-radius:50%;background:#d8d0ff;box-shadow:0 0 12px #8d78ff;animation:sl-core .38s ease-out forwards}.sl-click-particle{position:absolute;left:-2px;top:-2px;width:4px;height:4px;border-radius:50%;background:#a996ff;box-shadow:0 0 8px rgba(143,119,255,.8);animation:sl-particle .52s cubic-bezier(.2,.7,.3,1) forwards}@keyframes sl-ring{0%{opacity:.95;transform:scale(.2)}70%{opacity:.55}100%{opacity:0;transform:scale(1)}}@keyframes sl-core{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(2.8)}}@keyframes sl-particle{0%{opacity:.95;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--fx-x),var(--fx-y)) scale(.25)}}`;
  document.head.appendChild(style);
  let last=0;
  document.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    const now=performance.now();if(now-last<65)return;last=now;
    const precise=event.target.closest('input,select,textarea,[role="slider"]');
    const size=precise?34:58,distance=precise?22:38;
    const fx=document.createElement('span');fx.className='sl-click-fx';fx.style.left=`${event.clientX}px`;fx.style.top=`${event.clientY}px`;fx.style.setProperty('--fx-size',`${size}px`);fx.innerHTML='<i class="sl-click-ring"></i><i class="sl-click-core"></i>';
    for(let i=0;i<8;i++){const angle=Math.PI*2*i/8+(Math.random()-.5)*.18,particle=document.createElement('i');particle.className='sl-click-particle';particle.style.setProperty('--fx-x',`${Math.cos(angle)*distance}px`);particle.style.setProperty('--fx-y',`${Math.sin(angle)*distance}px`);fx.appendChild(particle)}
    document.body.appendChild(fx);window.setTimeout(()=>fx.remove(),650);
  },{passive:true});
})();
