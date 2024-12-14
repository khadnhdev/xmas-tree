document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('message');
    const previewMessage = document.getElementById('previewMessage');
    const generateAIBtn = document.getElementById('generateAI');
    const publishBtn = document.getElementById('publish');
    const shareSection = document.querySelector('.share-section');
    const shareLinkInput = document.getElementById('shareLink');
    const copyLinkBtn = document.getElementById('copyLink');

    // Xử lý chuyển tab
    const tabBtns = document.querySelectorAll('.tab-btn');
    const createTab = document.getElementById('createTab');
    const previewTab = document.getElementById('previewTab');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Xóa active class từ tất cả các nút
            tabBtns.forEach(b => b.classList.remove('active'));
            // Thêm active class cho nút được click
            btn.classList.add('active');

            // Hiển thị tab tương ứng
            if (btn.dataset.tab === 'create') {
                createTab.style.display = 'block';
                previewTab.style.display = 'none';
            } else {
                createTab.style.display = 'none';
                previewTab.style.display = 'block';
                // Cập nhật preview message
                previewMessage.textContent = messageInput.value;
            }
        });
    });

    // Cập nhật preview khi người dùng nhập
    messageInput.addEventListener('input', (e) => {
        previewMessage.textContent = e.target.value;
    });

    // Sinh lời chúc bằng AI
    generateAIBtn.addEventListener('click', async () => {
        generateAIBtn.disabled = true;
        generateAIBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tạo...';
        
        try {
            const response = await fetch('/generate-ai-message', {
                method: 'POST'
            });
            const data = await response.json();
            
            messageInput.value = data.message;
            previewMessage.textContent = data.message;
        } catch (error) {
            alert('Không thể tạo lời chúc. Vui lòng thử lại!');
        } finally {
            generateAIBtn.disabled = false;
            generateAIBtn.innerHTML = '<i class="fas fa-magic"></i> Gợi ý từ AI';
        }
    });

    // Đăng thiệp
    publishBtn.addEventListener('click', async () => {
        const message = messageInput.value.trim();
        const customLink = document.getElementById('customLink').value.trim();
        
        if (!message) {
            alert('Vui lòng nhập lời chúc!');
            return;
        }

        try {
            const response = await fetch('/publish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    message,
                    customId: customLink 
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error);
            }
            
            const cardUrl = `${window.location.origin}/card/${data.id}`;
            shareLinkInput.value = cardUrl;
            shareSection.style.display = 'flex';
        } catch (error) {
            alert(error.message || 'Không thể tạo thiệp. Vui lòng thử lại!');
        }
    });

    // Thêm validation cho input link tùy chỉnh
    const customLinkInput = document.getElementById('customLink');
    customLinkInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value && !/^[a-zA-Z0-9-_]+$/.test(value)) {
            customLinkInput.setCustomValidity('Chỉ được dùng chữ cái, số và dấu - _');
        } else if (value && (value.length < 3 || value.length > 50)) {
            customLinkInput.setCustomValidity('Độ dài link phải từ 3-50 ký tự');
        } else {
            customLinkInput.setCustomValidity('');
        }
    });

    // Copy link
    copyLinkBtn.addEventListener('click', () => {
        shareLinkInput.select();
        document.execCommand('copy');
        copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> Đã sao chép';
        setTimeout(() => {
            copyLinkBtn.innerHTML = '<i class="fas fa-copy"></i> Sao chép';
        }, 2000);
    });

    // Thêm xử lý chia sẻ mạng xã hội
    const fbShareBtn = document.querySelector('.btn.facebook');
    const twitterShareBtn = document.querySelector('.btn.twitter');

    if (fbShareBtn) {
        fbShareBtn.addEventListener('click', () => {
            const url = shareLinkInput.value;
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, 
                       '_blank', 
                       'width=600,height=400');
        });
    }

    if (twitterShareBtn) {
        twitterShareBtn.addEventListener('click', () => {
            const url = shareLinkInput.value;
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Thiệp Giáng sinh của tôi`, 
                       '_blank', 
                       'width=600,height=400');
        });
    }
}); 