const presets=[
  {id:1,name:'清澈人声',author:'SonicLab',cat:'人声',desc:'增强人声清晰度，减少低频浑浊感',likes:128,fav:true,vals:[-2,-1,0,2,-6,3,2,1,0,-1],gain:0},
  {id:2,name:'深夜电台',author:'Kane',cat:'播客',desc:'温暖近场感，适合深夜播客',likes:96,fav:false,vals:[3,2,1,0,1,2,1,0,-1,-2],gain:-1},
  {id:3,name:'FPS 脚步增强',author:'Nova',cat:'游戏',desc:'突出关键中高频声音细节',likes:342,fav:true,vals:[-4,-3,-2,0,2,4,5,3,1,0],gain:0},
  {id:4,name:'流行演唱',author:'Mira',cat:'音乐',desc:'明亮通透，保留低频力度',likes:215,fav:false,vals:[2,1,0,-1,1,3,4,3,2,1],gain:1}
];
let selected=presets[0],bands=[...selected.vals],masterGain=selected.gain||0;
const freqs=['31','62','125','250','500','1K','2K','4K','8K','16K'];
const $=s=>document.querySelector(s);
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)};

function renderList(){
  const q=$('#eqSearch').value.toLowerCase(),f=$('#eqFilter').value;
  $('#eqList').innerHTML=presets.filter(x=>(x.name+x.author).toLowerCase().includes(q)&&(f==='all'||f==='favorite'&&x.fav||f==='popular'&&x.likes>200||f==='mine'&&x.author==='我')).map(x=>`<article class="eq-item ${x.id===selected.id?'active':''}" data-id="${x.id}"><div class="eq-item-head"><h3>${x.name}</h3><span class="tag">${x.cat}</span></div><p>${x.desc}</p><div class="eq-stats"><span>by ${x.author}</span><span>♡ ${x.likes}</span><span>${x.fav?'★ 已收藏':'☆'}</span></div></article>`).join('')||'<p class="muted">没有匹配的 EQ</p>';
  document.querySelectorAll('.eq-item').forEach(x=>x.onclick=()=>select(+x.dataset.id));
}

function select(id){
  selected=presets.find(x=>x.id===id);bands=[...selected.vals];masterGain=selected.gain||0;
  $('#eqTitle').textContent=selected.name;$('#eqCategory').textContent=selected.cat;$('#eqDesc').textContent=selected.desc;
  $('#likeBtn').textContent=`♡ ${selected.likes}`;$('#favBtn').textContent=selected.fav?'★ 已收藏':'☆ 收藏';
  renderBands();syncGain();renderList();
}

function renderBands(){
  $('#bands').innerHTML=freqs.map((f,i)=>`<label class="band"><output>${bands[i]>0?'+':''}${bands[i]}dB</output><input data-i="${i}" type="range" min="-12" max="12" value="${bands[i]}"><span>${f}Hz</span></label>`).join('');
  document.querySelectorAll('.band input').forEach(x=>x.oninput=()=>{bands[+x.dataset.i]=+x.value;x.previousElementSibling.textContent=`${x.value>0?'+':''}${x.value}dB`;draw()});draw();
}

function roundedPath(g,points){
  g.beginPath();g.moveTo(points[0].x,points[0].y);
  for(let i=1;i<points.length-1;i++){const mid={x:(points[i].x+points[i+1].x)/2,y:(points[i].y+points[i+1].y)/2};g.quadraticCurveTo(points[i].x,points[i].y,mid.x,mid.y)}
  g.lineTo(points.at(-1).x,points.at(-1).y);
}

function draw(){
  const c=$('#eqCanvas'),g=c.getContext('2d'),w=c.width,h=c.height,pad=16,mid=h/2;
  g.clearRect(0,0,w,h);g.fillStyle='#0b0c12';g.fillRect(0,0,w,h);
  g.lineWidth=1;
  for(let i=0;i<=10;i++){const x=i*w/10;g.strokeStyle=i===0||i===10?'#242735':'#1c1f2b';g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}
  for(let i=0;i<=6;i++){const y=i*h/6;g.strokeStyle=i===3?'rgba(151,139,255,.32)':'#1c1f2b';g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
  const points=bands.map((v,i)=>({x:pad+i*(w-pad*2)/(bands.length-1),y:Math.max(10,Math.min(h-10,mid-(v+masterGain)*(h/30)))}));
  roundedPath(g,points);g.lineTo(points.at(-1).x,h);g.lineTo(points[0].x,h);g.closePath();
  const fill=g.createLinearGradient(0,mid-80,0,h);fill.addColorStop(0,'rgba(119,96,255,.25)');fill.addColorStop(.55,'rgba(98,76,236,.08)');fill.addColorStop(1,'rgba(72,55,190,0)');g.fillStyle=fill;g.fill();
  roundedPath(g,points);const stroke=g.createLinearGradient(0,0,w,0);stroke.addColorStop(0,'#9a8cff');stroke.addColorStop(.5,'#765fff');stroke.addColorStop(1,'#b19dff');g.strokeStyle=stroke;g.lineWidth=4;g.lineCap='round';g.lineJoin='round';g.shadowBlur=16;g.shadowColor='rgba(108,82,255,.8)';g.stroke();g.shadowBlur=0;
  points.forEach(p=>{g.beginPath();g.arc(p.x,p.y,7,0,Math.PI*2);g.fillStyle='#0d0e15';g.fill();g.strokeStyle='#8b75ff';g.lineWidth=4;g.stroke();g.beginPath();g.arc(p.x,p.y,2.5,0,Math.PI*2);g.fillStyle='#fff';g.fill()});
  g.font='11px Inter, sans-serif';g.fillStyle='#6f7282';g.fillText('+12 dB',10,17);g.fillText('0 dB',10,mid-8);g.fillText('-12 dB',10,h-10);
}

function installGainControl(){
  const bar=document.createElement('section');bar.className='eq-gain-control';bar.innerHTML=`<div class="gain-copy"><span class="gain-icon">VOL</span><div><strong>EQ 总音量</strong><small>调整均衡器处理后的整体输出电平</small></div></div><div class="gain-slider"><span>-12 dB</span><input id="eqGain" type="range" min="-12" max="12" step="1" value="0"><span>+12 dB</span></div><output id="eqGainValue">0 dB</output>`;
  $('.preview-bar').before(bar);$('#eqGain').oninput=e=>{masterGain=+e.target.value;syncGain();draw()};
}
function syncGain(){const input=$('#eqGain'),out=$('#eqGainValue');if(!input)return;input.value=masterGain;input.style.setProperty('--gain',`${(masterGain+12)/24*100}%`);out.textContent=`${masterGain>0?'+':''}${masterGain} dB`}

$('#eqSearch').oninput=renderList;$('#eqFilter').onchange=renderList;
$('#newEq').onclick=()=>{const n={id:Date.now(),name:'未命名 EQ',author:'我',cat:'自定义',desc:'新的自定义均衡器预设',likes:0,fav:false,vals:Array(10).fill(0),gain:0};presets.unshift(n);select(n.id);toast('已新建 EQ')};
$('#likeBtn').onclick=()=>{selected.likes++;$('#likeBtn').textContent=`♡ ${selected.likes}`;renderList()};
$('#favBtn').onclick=()=>{selected.fav=!selected.fav;$('#favBtn').textContent=selected.fav?'★ 已收藏':'☆ 收藏';renderList();toast(selected.fav?'已收藏':'已取消收藏')};
$('#shareBtn').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);toast('分享链接已复制')}catch{toast('分享链接已生成')}};
$('#deleteBtn').onclick=()=>{if(selected.author!=='我')return toast('只能删除自己创建的 EQ');presets.splice(presets.indexOf(selected),1);select(presets[0]);toast('EQ 已删除')};
$('#resetBtn').onclick=()=>{bands=Array(10).fill(0);masterGain=0;renderBands();syncGain();toast('预设已重置')};
$('#saveBtn').onclick=()=>{selected.vals=[...bands];selected.gain=masterGain;toast('预设已保存')};
installGainControl();renderList();renderBands();syncGain();
