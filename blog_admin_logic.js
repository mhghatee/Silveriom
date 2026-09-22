// === BLOG CMS LOGIC ===
function renderBlogs() {
  const container = document.getElementById('blogs-list');
  if (!container) return;
  container.innerHTML = '';
  
  if (!state.blogs) state.blogs = [];
  
  if (state.blogs.length === 0) {
    container.innerHTML = '<p style="color:#aaa; text-align:center; grid-column:1/-1; padding:40px;">هیچ مقاله‌ای یافت نشد.</p>';
    return;
  }
  
  state.blogs.forEach((blog, idx) => {
    const imgSrc = blog.image ? (blog.image.startsWith('http') ? blog.image : '../' + blog.image) : '';
    container.innerHTML += `
      <div class="glass-card" style="display:flex; flex-direction:column; padding:0; overflow:hidden;">
        <div style="height: 180px; background: url('${imgSrc}') center/cover; position:relative;">
            <div style="position:absolute; top:10px; right:10px; background:rgba(0,0,0,0.7); padding:4px 8px; border-radius:8px; border:1px solid #00f0ff; color:#00f0ff; font-size:11px;">${blog.category || 'بدون دسته'}</div>
        </div>
        <div style="padding:20px; display:flex; flex-direction:column; flex-grow:1;">
            <div style="font-size:12px; color:#94a3b8; margin-bottom:10px;">${blog.date || ''}</div>
            <h4 style="font-size:16px; font-weight:800; color:#fff; margin-bottom:10px;">${blog.title || 'بدون عنوان'}</h4>
            <p style="font-size:13px; color:#cbd5e1; line-height:1.6; margin-bottom:20px; flex-grow:1;">${blog.summary || ''}</p>
            <div style="display:flex; gap:10px;">
                <button class="luxury-btn-outline" style="flex:1; padding:8px;" onclick="openBlogModal(${idx})">ویرایش</button>
                <button class="luxury-btn-outline" style="padding:8px; border-color:#ff4444; color:#ff4444;" onclick="deleteBlog(${idx})"><i data-lucide="trash-2" style="width:16px; height:16px;"></i></button>
            </div>
        </div>
      </div>
    `;
  });
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function openBlogModal(idx = null) {
  document.getElementById('blog-modal').style.display = 'flex';
  if (idx !== null) {
    document.getElementById('blog-modal-title').innerText = 'ویرایش مقاله';
    const blog = state.blogs[idx];
    document.getElementById('blog-id').value = blog.id;
    document.getElementById('blog-title').value = blog.title || '';
    document.getElementById('blog-category').value = blog.category || '';
    document.getElementById('blog-date').value = blog.date || '';
    document.getElementById('blog-image').value = blog.image || '';
    document.getElementById('blog-summary').value = blog.summary || '';
    document.getElementById('blog-content').value = blog.content || '';
  } else {
    document.getElementById('blog-modal-title').innerText = 'افزودن مقاله جدید';
    document.getElementById('blog-id').value = 'blog_' + Date.now();
    document.getElementById('blog-title').value = '';
    document.getElementById('blog-category').value = '';
    document.getElementById('blog-date').value = '';
    document.getElementById('blog-image').value = '';
    document.getElementById('blog-summary').value = '';
    document.getElementById('blog-content').value = '';
  }
}

function closeBlogModal() {
  document.getElementById('blog-modal').style.display = 'none';
}

async function uploadBlogImage(input) {
  if (!input.files || input.files.length === 0) return;
  const formData = new FormData();
  formData.append('image', input.files[0]);
  try {
    const res = await fetch('upload_media.php', { method: 'POST', body: formData });
    const result = await res.json();
    if (result.success) {
      document.getElementById('blog-image').value = result.url;
    } else {
      alert(result.error || 'خطا در آپلود');
    }
  } catch(e) {
    alert('خطا در ارتباط با سرور');
  }
}

async function saveBlog() {
  if (!state.blogs) state.blogs = [];
  
  const id = document.getElementById('blog-id').value;
  const title = document.getElementById('blog-title').value;
  
  if (!title) {
      alert("عنوان مقاله الزامی است.");
      return;
  }
  
  const blogData = {
      id: id,
      title: title,
      category: document.getElementById('blog-category').value,
      date: document.getElementById('blog-date').value,
      image: document.getElementById('blog-image').value,
      summary: document.getElementById('blog-summary').value,
      content: document.getElementById('blog-content').value
  };
  
  const existingIdx = state.blogs.findIndex(b => b.id === id);
  if (existingIdx !== -1) {
      state.blogs[existingIdx] = blogData;
  } else {
      state.blogs.unshift(blogData); // Add to top
  }
  
  closeBlogModal();
  renderBlogs();
  
  // Save to backend
  if (typeof window.saveStateToServer === 'function') {
      window.saveStateToServer();
      showToast('مقاله با موفقیت ذخیره شد', 'success');
  }
}

async function deleteBlog(idx) {
  if (!confirm('آیا از حذف این مقاله اطمینان دارید؟')) return;
  state.blogs.splice(idx, 1);
  renderBlogs();
  if (typeof window.saveStateToServer === 'function') {
      window.saveStateToServer();
      showToast('مقاله حذف شد', 'success');
  }
}
