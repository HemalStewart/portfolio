const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD'}).format(n/100);
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categoryName={classics:'Ceylon classics',botanical:'Botanical blends',rare:'Rare white teas'};
const productDialog=$('#product-dialog'),cartDialog=$('#cart-dialog'),menuDialog=$('#menu-dialog');
let products=[],variants=new Map(),cart=[],filter='all',detail=null,toastTimer;
function notify(text){const el=$('.toast');el.textContent=text;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2400)}
function close(dialog){if(dialog.open)dialog.close()}
function show(dialog){$$('dialog[open]').forEach(close);dialog.showModal()}
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>close(b.closest('dialog'))));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close(d)}));
$$('[data-menu-open]').forEach(b=>b.addEventListener('click',()=>show(menuDialog)));
menuDialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>close(menuDialog)));
function firstVariant(p){return p.variants.find(v=>v.available)||p.variants[0]}
function save(){try{localStorage.setItem('ceylon-select-design-bag-v1',JSON.stringify(cart))}catch{}}
function renderBag(){
 let total=0,count=0;for(const item of cart){const v=variants.get(item.variantId);total+=v.variant.price*item.quantity;count+=item.quantity}
 $$('.bag-count').forEach(e=>e.textContent=String(count));$('.bag-button').setAttribute('aria-label',`Open bag, ${count} ${count===1?'item':'items'}`);
 $('.cart-total').textContent=money(total)+' CAD';
 $('.cart-summary').hidden=!cart.length;
 $('.cart-items').innerHTML=cart.length?cart.map(item=>{const {product:p,variant:v}=variants.get(item.variantId);return `<article class="cart-item"><img src="${safe(p.images[0])}" alt="${safe(p.title)}" width="110" height="110"><div><h3>${safe(p.title)}</h3><p>${money(v.price)} CAD each</p><div class="cart-item-controls"><div class="quantity"><button data-cart-change="${item.variantId}" data-delta="-1" aria-label="Decrease ${safe(p.title)} quantity" ${item.quantity<=1?'disabled':''}>−</button><span>${item.quantity}</span><button data-cart-change="${item.variantId}" data-delta="1" aria-label="Increase ${safe(p.title)} quantity" ${item.quantity>=20?'disabled':''}>+</button></div><button class="cart-remove" data-remove="${item.variantId}">Remove</button></div></div></article>`}).join(''):'<div class="cart-empty"><h3>A moment waiting<br>to be filled.</h3><p>Your bag is empty. Find a tea for your next ritual.</p><button class="button" data-continue-shopping>Explore the teas <span>↗</span></button></div>';
 $('.checkout-link').href=cart.length?'https://ceylonselect.com/cart/'+cart.map(i=>`${i.variantId}:${i.quantity}`).join(','):'https://ceylonselect.com/collections/all';
}
function add(variantId,quantity=1){
 const entry=variants.get(Number(variantId));if(!entry||!entry.variant.available){notify('This tea is not available right now.');return}
 quantity=Math.max(1,Math.min(20,Math.round(Number(quantity)||1)));
 const existing=cart.find(x=>x.variantId===entry.variant.id);
 if(existing){if(existing.quantity>=20){notify('Your bag holds up to 20 of each tea.');return}existing.quantity=Math.min(20,existing.quantity+quantity)}else cart.push({variantId:entry.variant.id,quantity});
 save();renderBag();notify(`${entry.product.title} added to your bag.`);
}
function renderProducts(){
 const query=$('#tea-search').value.trim().toLowerCase(),sort=$('#tea-sort').value;
 let list=products.filter(p=>(filter==='all'||p.category===filter)&&`${p.title} ${p.ingredients} ${p.notes}`.toLowerCase().includes(query));
 if(sort==='price-asc')list.sort((a,b)=>firstVariant(a).price-firstVariant(b).price);
 if(sort==='price-desc')list.sort((a,b)=>firstVariant(b).price-firstVariant(a).price);
 if(sort==='name')list.sort((a,b)=>a.title.localeCompare(b.title));
 $('.result-count').textContent=`${list.length} ${list.length===1?'tea':'teas'} to make a moment of`;
 $('.shop-empty').hidden=!!list.length;
 $('.product-grid').innerHTML=list.map(p=>{const v=firstVariant(p);return `<article class="product-card"><button class="product-image-button" data-detail="${safe(p.handle)}" aria-label="View ${safe(p.title)}"><img src="${safe(p.images[0])}" alt="${safe(p.title)} tin" width="1100" height="1100" loading="lazy" decoding="async">${p.images[1]?`<img class="product-secondary" src="${safe(p.images[1])}" alt="" width="1100" height="1100" loading="lazy" decoding="async">`:''}</button><span class="product-category">${categoryName[p.category]}</span><button class="product-name" data-detail="${safe(p.handle)}">${safe(p.title)}</button><div class="product-card-bottom"><span class="product-price">${money(v.price)} CAD</span><button class="quick-add" data-add="${v.id}" ${v.available?'':'disabled'} aria-label="Add ${safe(p.title)} to bag">${v.available?'Add to bag +':'Sold out'}</button></div></article>`}).join('');
}
function openProduct(handle){
 const p=products.find(p=>p.handle===handle);if(!p)return;detail=p;
 const v=firstVariant(p);
 $('.product-detail-content').innerHTML=`<div class="detail-art"><img class="detail-photo" src="${safe(p.images[0])}" width="1100" height="1100" alt="${safe(p.title)}"><div class="detail-image-tabs" role="group" aria-label="Product photos">${p.images.map((src,i)=>`<button data-photo="${i}" aria-pressed="${i===0}">${i===0?'The tea tin':'A closer look'}</button>`).join('')}</div></div><div class="detail-copy"><span class="eyebrow">${categoryName[p.category]} · LOOSE LEAF</span><h2>${safe(p.title)}</h2><p class="detail-price">${money(v.price)} CAD</p><p class="detail-notes">${safe(p.notes)}</p><div class="detail-meta"><strong>THE INGREDIENTS</strong>${safe(p.ingredients)}<strong>WATER TEMPERATURE</strong>${safe(p.water)}</div>${p.variants.length>1?`<label class="eyebrow" for="detail-variant">Choose an option</label><select id="detail-variant">${p.variants.map(x=>`<option value="${x.id}" ${x.id===v.id?'selected':''} ${x.available?'':'disabled'}>${safe(x.title)} · ${money(x.price)} CAD</option>`).join('')}</select>`:''}<div class="detail-actions"><div class="quantity"><button data-detail-qty="-1" aria-label="Decrease quantity">−</button><input id="detail-quantity" type="number" min="1" max="20" step="1" value="1" aria-label="Quantity"><button data-detail-qty="1" aria-label="Increase quantity">+</button></div><button class="button detail-add" data-add="${v.id}" ${v.available?'':'disabled'}>${v.available?'Add to bag':'Sold out'} <span>+</span></button></div><a class="detail-official" href="${safe(p.url)}" target="_blank" rel="noopener">Full tea and brewing details at Ceylon Select ↗</a></div>`;
 show(productDialog);
}
function reset(){filter='all';$('#tea-search').value='';$('#tea-sort').value='featured';$$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter==='all')));renderProducts()}
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;$$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderProducts()}));
$('#tea-search').addEventListener('input',renderProducts);$('#tea-sort').addEventListener('change',renderProducts);$('#reset-search').addEventListener('click',reset);
$$('[data-cart-open]').forEach(b=>b.addEventListener('click',()=>{renderBag();show(cartDialog)}));
document.addEventListener('click',e=>{
 const detailButton=e.target.closest('[data-detail]');if(detailButton){openProduct(detailButton.dataset.detail);return}
 const addButton=e.target.closest('[data-add]');if(addButton){const isDetail=!!addButton.closest('#product-dialog');const q=isDetail?$('#detail-quantity').value:1;add(Number(isDetail?$('#detail-variant')?.value||addButton.dataset.add:addButton.dataset.add),q);if(isDetail)close(productDialog);return}
 const quantityButton=e.target.closest('[data-detail-qty]');if(quantityButton){const input=$('#detail-quantity');input.value=String(Math.max(1,Math.min(20,(Number(input.value)||1)+Number(quantityButton.dataset.detailQty))));return}
 const change=e.target.closest('[data-cart-change]');if(change){const item=cart.find(x=>x.variantId===Number(change.dataset.cartChange));if(item)item.quantity=Math.max(1,Math.min(20,item.quantity+Number(change.dataset.delta)));save();renderBag();const focus=cartDialog.querySelector(`[data-cart-change="${change.dataset.cartChange}"][data-delta="${change.dataset.delta}"]:not(:disabled)`);focus?.focus({preventScroll:true});return}
 const remove=e.target.closest('[data-remove]');if(remove){cart=cart.filter(x=>x.variantId!==Number(remove.dataset.remove));save();renderBag();return}
 const photo=e.target.closest('[data-photo]');if(photo&&detail){const i=Number(photo.dataset.photo);$('.detail-photo').src=detail.images[i];$('.detail-photo').style.mixBlendMode=i?'normal':'multiply';$$('[data-photo]').forEach(b=>b.setAttribute('aria-pressed',String(b===photo)));return}
 if(e.target.closest('[data-continue-shopping]')){close(cartDialog);document.querySelector('a[href="#shop"]').click()}
});
productDialog.addEventListener('change',e=>{if(e.target.id==='detail-variant'){const v=variants.get(Number(e.target.value))?.variant;if(v){$('.detail-price').textContent=money(v.price)+' CAD';$('.detail-add').dataset.add=v.id}}});
try {
 const response=await fetch('products.json');if(!response.ok)throw Error('Catalogue unavailable');
 const data=await response.json();products=data.products;
 for(const product of products)for(const variant of product.variants)variants.set(variant.id,{variant,product});
 try{const saved=JSON.parse(localStorage.getItem('ceylon-select-design-bag-v1')||'[]');if(Array.isArray(saved))for(const item of saved){const id=Number(item.variantId),q=Number(item.quantity);if(variants.get(id)?.variant.available&&Number.isInteger(q)&&q>0&&!cart.some(x=>x.variantId===id))cart.push({variantId:id,quantity:Math.min(20,q)})}}catch{}
 renderProducts();renderBag();document.body.classList.add('shop-ready');
} catch {
 $('.result-count').textContent='The catalogue is temporarily unavailable.';
 $('.product-grid').innerHTML='<p><a class="button" href="https://ceylonselect.com/collections/all" target="_blank" rel="noopener">Browse Ceylon Select’s current store ↗</a></p>';
 $$('[data-detail]').forEach(b=>{b.disabled=true;b.textContent='Visit the current store'});
}
