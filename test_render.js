const fs = require('fs');
const state = JSON.parse(fs.readFileSync('silveriom_db.json', 'utf8'));

function renderMedia() {
  const media = state.mediaInventory || [];
  try {
    const html = media.map(m => `
    <div class="inventory-card" style="display:flex; flex-direction:column; gap: 10px;">
      
      <div style="position:relative; width:100%; height:140px; border-radius:10px; overflow:hidden; background:#0f172a; border: 1px solid rgba(255,255,255,0.1);">
        <img src="${m.image && m.image.startsWith('/') ? m.image : (m.image ? '../'+m.image : '../assets/placeholder_media.jpg')}" style="width:100%; height:100%; object-fit:cover;" id="media-img-${m.id}" />
        <div style="position:absolute; bottom:5px; right:5px;">
           <label class="btn-glass-gold" style="cursor:pointer; font-size:11px; padding: 4px 8px;">
              <i data-lucide="upload" style="width:12px; height:12px;"></i> آپلود عکس
              <input type="file" style="display:none;" accept="image/*" onchange="compressAndUploadMediaImage(event, '${m.id}')">
           </label>
        </div>
      </div>

      <div>
        <div class="inventory-tag" style="font-size: 10px;">${m.code || m.id} | ${m.location || 'لوکیشن نامشخص'}</div>
        <h3 class="inventory-title" style="font-size: 14px; margin-top:5px;">${m.title}</h3>
      </div>

      <div style="display:flex; flex-wrap: wrap; gap: 5px; font-size: 11px; color: #94a3b8; margin: 10px 0;">
          <span style="background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px;">تعرفه: ${m.tariff || '?'}</span>
          <span style="background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px;">ابعاد: ${m.dimensions || '?'}</span>
          <span style="background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px;">صفحات: ${(m.display_pages || []).join(', ')}</span>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top: auto;">
        <span class="badge ${m.status === 'reserved' ? 'badge-danger' : (m.status === 'active' ? 'badge-info' : 'badge-gold')}" style="font-size: 11px; background: ${m.status === 'active' ? 'rgba(56, 189, 248, 0.2)' : ''}; color: ${m.status === 'active' ? '#38bdf8' : ''}; border: ${m.status === 'active' ? '1px solid rgba(56, 189, 248, 0.4)' : ''};">
           ${m.status === 'reserved' ? 'رزرو شده' : (m.status === 'active' ? 'در حال اکران' : 'موجود')}
        </span>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn-glass-outline" style="padding:0.35rem 0.65rem;" onclick="openMediaModal('${m.id}')" title="ویرایش">
            <i data-lucide="edit-2" style="width:14px; height:14px;"></i>
          </button>
          <button class="btn-glass-outline btn-glass-danger" style="padding:0.35rem 0.65rem;" onclick="deleteMedia('${m.id}')" title="حذف">
            <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
    console.log("SUCCESS, html length:", html.length);
  } catch(e) {
    console.log("ERROR:", e);
  }
}
renderMedia();
