/**
 * ArtVibe Gallery - Interactive JavaScript
 * Supports Cart Counter, Toast Notifications, Shop Filtering, and Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Quản lý giỏ hàng & Toast thông báo
    let cartCount = 0;
    const cartCountElement = document.getElementById('cartCount');

    // Tạo phần tử Toast nếu chưa có
    let toast = document.querySelector('.Toast-Notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'Toast-Notification';
        toast.innerHTML = `
            <div class="Toast-Icon">✨</div>
            <div class="Toast-Message">
                <h5 id="toastTitle">Thành công!</h5>
                <p id="toastBody">Thao tác hoàn tất.</p>
            </div>
        `;
        document.body.appendChild(toast);
    }

    function showToast(title, body) {
        document.getElementById('toastTitle').textContent = title;
        document.getElementById('toastBody').textContent = body;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    // Sự kiện thêm vào giỏ hàng
    const buyButtons = document.querySelectorAll('.Btn-Buy, .Button-Buy a, .btn-add-cart');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Nếu là trang shop hoặc trang chủ có thao tác mua
            const card = btn.closest('.Product-Card');
            let productName = "Kiệt tác";
            if (card) {
                const titleEl = card.querySelector('h3');
                if (titleEl) productName = titleEl.textContent.trim();
            }

            // Nếu nút là link dẫn trang (ở trang chủ dẫn vào shop), vẫn cho phép nếu muốn, hoặc thêm vào giỏ nếu đang ở shop
            if (window.location.pathname.includes('shop.html') || btn.classList.contains('btn-add-cart')) {
                e.preventDefault();
                cartCount++;
                if (cartCountElement) {
                    cartCountElement.textContent = cartCount;
                    cartCountElement.style.display = 'inline-block';
                }
                showToast("Đã thêm vào giỏ hàng!", `"${productName}" đã được đưa vào bộ sưu tập.`);
            }
        });
    });

    // 2. Bộ lọc & Tìm kiếm tại Shop (shop.html)
    const searchInput = document.getElementById('searchInput');
    const artistFilter = document.getElementById('artistFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const filterResetBtn = document.getElementById('filterResetBtn');
    const shopProducts = document.querySelectorAll('.Shop-Products-Grid .Product-Card');

    function filterProducts() {
        if (!shopProducts.length) return;

        const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedArtist = artistFilter ? artistFilter.value : 'all';
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        const maxPrice = priceRange ? parseInt(priceRange.value, 10) : 10000000;

        let visibleCount = 0;

        shopProducts.forEach(card => {
            const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
            const artist = card.dataset.artist || (card.querySelector('.Product-Artist') ? card.querySelector('.Product-Artist').textContent.toLowerCase() : '');
            const category = card.dataset.category || '';
            const price = parseInt(card.dataset.price || '0', 10);

            const matchKeyword = !keyword || title.includes(keyword) || artist.includes(keyword);
            const matchArtist = selectedArtist === 'all' || artist.includes(selectedArtist.toLowerCase());
            const matchCategory = selectedCategory === 'all' || category === selectedCategory;
            const matchPrice = price <= maxPrice;

            if (matchKeyword && matchArtist && matchCategory && matchPrice) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        const noResultEl = document.getElementById('noResultsMsg');
        if (noResultEl) {
            noResultEl.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    if (artistFilter) {
        artistFilter.addEventListener('change', filterProducts);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', () => {
            const formatted = new Intl.NumberFormat('vi-VN').format(priceRange.value);
            priceValue.textContent = formatted + ' đ';
            filterProducts();
        });
    }
    if (filterResetBtn) {
        filterResetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (artistFilter) artistFilter.value = 'all';
            if (categoryFilter) categoryFilter.value = 'all';
            if (priceRange && priceValue) {
                priceRange.value = 5000000;
                priceValue.textContent = '5.000.000 đ';
            }
            filterProducts();
            showToast("Đã đặt lại bộ lọc", "Hiển thị toàn bộ danh mục kiệt tác.");
        });
    }

    // 3. Xử lý Form Liên Hệ (contact.html)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName') ? document.getElementById('contactName').value : 'Quý khách';
            showToast("Gửi tin nhắn thành công!", `Cảm ơn ${name}, ArtVibe sẽ liên hệ hỗ trợ bạn sớm nhất.`);
            contactForm.reset();
        });
    }
});
