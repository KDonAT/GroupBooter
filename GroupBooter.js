(() => {
  const YOUR_ID = 'replace with your fb id';
  const REMOVE_LABEL = 'Remove member';            // exact label shown in your clone
  const CONFIRM_MATCH = [/^Remove member$/i, /confirm/i, /yes/i, /ok/i];
  const MIN_ROW_TOP_PX = 300;                      // skip header area

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const isVisible = el => {
    if (!el) return false;
    const r = el.getBoundingClientRect(), s = getComputedStyle(el);
    return r.width>0 && r.height>0 && s.visibility!=='hidden' && s.display!=='none';
  };
  const qvis = (sel, root=document) => [...root.querySelectorAll(sel)].filter(isVisible);
  const text = el => (el?.textContent || '').trim();

  let removedCount = 0;

  const topMemberRow = () => {
    const rows = [...qvis('[role="listitem"]'), ...qvis('li'), ...qvis('div')];
    const candidates = rows.filter(el => {
      const r = el.getBoundingClientRect();
      if (r.top < MIN_ROW_TOP_PX || r.height < 50) return false;
      const txt = text(el).toLowerCase();
      if (/\byou\b/.test(txt)) return false;
      if ((el.id||'').includes(YOUR_ID)) return false;
      const hasMenu = qvis('button, [role="button"]', el).some(b =>
        /⋯|…|more|options/i.test((b.getAttribute('aria-label')||text(b)))
      );
      return hasMenu;
    });
    return candidates.sort((a,b)=>a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0] || null;
  };

  const highlight = (el, ok=true) => {
    if (!el) return;
    const prev = el.style.outline;
    el.style.outline = `3px solid ${ok ? '#00c853' : '#ff1744'}`;
    setTimeout(()=>{ el.style.outline=prev; }, 1200);
  };

  const findMenuBtn = row => {
    const btns = qvis('button, [role="button"]', row);
    return btns.find(b => /⋯|…|more|options/i.test((b.getAttribute('aria-label')||text(b)))) || btns.pop();
  };

  const nearestLayer = (anchor) => {
    const layers = [...document.querySelectorAll('div, ul')]
      .filter(isVisible)
      .filter(el => {
        const s = getComputedStyle(el);
        return /fixed|absolute/i.test(s.position) && (parseInt(s.zIndex)||0)>=10;
      });
    if (!layers.length) return null;
    const ar = anchor.getBoundingClientRect();
    const cx=(ar.left+ar.right)/2, cy=(ar.top+ar.bottom)/2;
    layers.sort((a,b)=>{
      const ra=a.getBoundingClientRect(), rb=b.getBoundingClientRect();
      const da=Math.hypot((ra.left+ra.right)/2-cx,(ra.top+ra.bottom)/2-cy);
      const db=Math.hypot((rb.left+rb.right)/2-cx,(rb.top+rb.bottom)/2-cy);
      return da-db;
    });
    return layers[0];
  };

  const clickExactByText = (container, exact) => {
    const els = qvis('button, [role="button"], [role="menuitem"], a, [tabindex]', container||document)
      .filter(el => text(el)===exact);
    if (els.length){ els[0].click(); return true; }
    return false;
  };

  const clickConfirm = async () => {
    for (let i=0;i<10;i++){
      const scope = document.querySelector('div[role="dialog"], div[aria-modal="true"], .modal, .dialog') || document;
      const cands = qvis('button, [role="button"], a', scope)
        .filter(el => {
          const t=text(el);
          return t && CONFIRM_MATCH.some(re=>re.test(t));
        });
      if (cands.length){ cands[0].click(); await sleep(150); return true; }
      await sleep(120);
    }
    return false;
  };

  let busy=false;
  const removeNext = async () => {
    if (busy) return;
    busy=true;
    try {
      const row = topMemberRow();
      if (!row){ console.log('[GroupBooter] No row found.'); busy=false; return; }
      highlight(row,true);

      const menuBtn = findMenuBtn(row);
      if (!menuBtn){ console.log('[GroupBooter] No menu in row'); highlight(row,false); busy=false; return; }

      menuBtn.click(); await sleep(200);

      const layer = nearestLayer(menuBtn) || document;
      const ok = clickExactByText(layer, REMOVE_LABEL) || clickExactByText(document, REMOVE_LABEL);
      if (!ok){ console.log('[GroupBooter] Could not find remove menu item.'); highlight(row,false); busy=false; return; }

      await sleep(200);
      await clickConfirm();

      removedCount++;
      btn.textContent = `👢 GroupBooter — Removed: ${removedCount}`;
    } catch(e){ console.warn('[GroupBooter] Error:',e); }
    finally { busy=false; }
  };

  // Floating button
  const btn=document.createElement('button');
  btn.textContent='👢 GroupBooter — Removed: 0';
  Object.assign(btn.style,{
    position:'fixed',right:'16px',bottom:'16px',zIndex:999999,
    padding:'10px 14px',borderRadius:'10px',fontFamily:'system-ui,sans-serif',
    fontSize:'14px',border:'1px solid #ccc',background:'#222',color:'#fff',
    cursor:'pointer',boxShadow:'0 2px 8px rgba(0,0,0,.25)'
  });
  btn.onclick=removeNext;
  document.body.appendChild(btn);

  // Hotkey R
  window.addEventListener('keydown',e=>{
    if(e.key.toLowerCase()==='r' && !e.repeat) removeNext();
  });

  console.log('[GroupBooter] Ready. Click the button or press R to remove top member (excluding you).');
})();
