/**
 * BAROD FINTECH PRODUCT WEBSITE — INTERACTIVE CONTROLLER
 * Cung cấp toàn bộ trải nghiệm tương tác trực quan:
 * 1. Chuyển tab bản thử nghiệm sản phẩm (Product Showcase Tabs)
 * 2. Tìm kiếm và lọc giao dịch tức thì (Live Transaction Filter & Search)
 * 3. Chuyển đổi kỳ báo cáo (Date-range Selector)
 * 4. Trình đơn di động phản hồi (Mobile Menu Drawer)
 * 5. Scrollspy theo dõi vị trí cuộn trang (Active Navigation State)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initProductShowcaseTabs();
  initTransactionFilterAndSearch();
  initReportPeriodSelector();
  initScrollspyAndSmoothScroll();
});

/* ==========================================================================
   1. MOBILE MENU DRAWER CONTROLLER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const overlay = document.getElementById('mobileNavOverlay');
  const closeBtn = document.getElementById('mobileMenuClose');
  const navLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-action');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-visible');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  // Đóng khi click vào bất kỳ liên kết nào
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Đóng khi nhấn phím Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   2. PRODUCT SHOWCASE TABS CONTROLLER
   ========================================================================== */
function initProductShowcaseTabs() {
  const tabBtns = document.querySelectorAll('.showcase-tab-btn');
  const tabPanels = document.querySelectorAll('.showcase-tab-panel');
  const currentTabLabel = document.getElementById('showcaseCurrentTabLabel');

  if (!tabBtns.length || !tabPanels.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      // Cập nhật trạng thái active cho nút tab
      tabBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      // Cập nhật nhãn tiêu đề tab hiện tại
      if (currentTabLabel) {
        currentTabLabel.textContent = btn.textContent.trim();
      }

      // Ẩn các panel khác và hiển thị panel được chọn
      tabPanels.forEach(panel => {
        if (panel.id === targetTabId) {
          panel.classList.add('is-active');
          panel.removeAttribute('hidden');
        } else {
          panel.classList.remove('is-active');
          panel.setAttribute('hidden', '');
        }
      });
    });
  });
}

/* ==========================================================================
   3. LIVE TRANSACTION FILTER & SEARCH CONTROLLER
   ========================================================================== */
function initTransactionFilterAndSearch() {
  const searchInput = document.getElementById('txSearchInput');
  const filterChips = document.querySelectorAll('.tx-filter-chip');
  const txRows = document.querySelectorAll('.demo-tx-row');
  const txCountElem = document.getElementById('demoTxVisibleCount');

  if (!txRows.length) return;

  let currentFilter = 'all'; // 'all', 'in', 'out'
  let currentSearchQuery = '';

  function applyFilterAndSearch() {
    let visibleCount = 0;

    txRows.forEach(row => {
      const type = row.getAttribute('data-type'); // 'in' hoặc 'out'
      const title = (row.getAttribute('data-title') || '').toLowerCase();
      const category = (row.getAttribute('data-category') || '').toLowerCase();

      // Kiểm tra filter loại giao dịch
      const matchType = (currentFilter === 'all') || (type === currentFilter);

      // Kiểm tra từ khóa tìm kiếm
      const matchSearch = !currentSearchQuery || 
                          title.includes(currentSearchQuery) || 
                          category.includes(currentSearchQuery);

      if (matchType && matchSearch) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (txCountElem) {
      txCountElem.textContent = `${visibleCount} giao dịch`;
    }
  }

  // Sự kiện tìm kiếm ô input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      applyFilterAndSearch();
    });
  }

  // Sự kiện bấm chọn chip lọc
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => {
        c.classList.remove('is-active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');

      currentFilter = chip.getAttribute('data-filter') || 'all';
      applyFilterAndSearch();
    });
  });
}

/* ==========================================================================
   4. REPORT PERIOD SELECTOR CONTROLLER
   ========================================================================== */
function initReportPeriodSelector() {
  const periodBtns = document.querySelectorAll('.report-period-btn');
  const reportIncomeElem = document.getElementById('reportTotalIncome');
  const reportExpenseElem = document.getElementById('reportTotalExpense');
  const reportNetElem = document.getElementById('reportNetSavings');
  const reportInsightElem = document.getElementById('reportDerivedInsight');

  if (!periodBtns.length) return;

  // Dữ liệu mẫu nhất quán theo từng kỳ
  const periodData = {
    'month': {
      income: '28.500.000 ₫',
      expense: '12.500.000 ₫',
      net: '+16.000.000 ₫',
      rate: '56%',
      topCategory: 'Ăn uống (36%)',
      insight: 'Dựa trên số liệu mẫu tháng này: Bạn đã tiết kiệm được 56% trên tổng thu nhập. Chi tiêu cho Ăn uống chiếm tỷ trọng lớn nhất (36%), trong khi dòng tiền thặng dư 16.000.000 ₫ giúp duy trì quỹ dự phòng ổn định.'
    },
    'quarter': {
      income: '85.500.000 ₫',
      expense: '38.200.000 ₫',
      net: '+47.300.000 ₫',
      rate: '55%',
      topCategory: 'Ăn uống (34%)',
      insight: 'Dựa trên số liệu mẫu Quý 3: Thu nhập trung bình đạt 28.500.000 ₫/tháng với mức chi tiêu ổn định. Thặng dư tích lũy 47.300.000 ₫ đã giúp hoàn thành 85% mục tiêu mua sắm thiết bị làm việc.'
    },
    'year': {
      income: '342.000.000 ₫',
      expense: '154.600.000 ₫',
      net: '+187.400.000 ₫',
      rate: '54%',
      topCategory: 'Hóa đơn & Ăn uống (62%)',
      insight: 'Dựa trên số liệu mẫu 12 tháng: Tỷ lệ tích lũy duy trì ổn định trên 50%. Các khoản chi tiêu cố định được kiểm soát tốt trong hạn mức ngân sách định kỳ, dòng tiền luôn duy trì dương.'
    }
  };

  periodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      periodBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');

      const period = btn.getAttribute('data-period');
      const data = periodData[period];

      if (data) {
        if (reportIncomeElem) reportIncomeElem.textContent = data.income;
        if (reportExpenseElem) reportExpenseElem.textContent = data.expense;
        if (reportNetElem) reportNetElem.textContent = data.net;
        if (reportInsightElem) reportInsightElem.textContent = data.insight;
      }
    });
  });
}

/* ==========================================================================
   5. SCROLLSPY & SMOOTH SCROLL CONTROLLER
   ========================================================================== */
function initScrollspyAndSmoothScroll() {
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id], main[id]');

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          targetElem.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          // Update URL hash without jump
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // Scrollspy
  if (!sections.length || !navLinks.length) return;

  function updateActiveNavLink() {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();
}
