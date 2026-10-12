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
  initMonthSelector();
  initTransactionFilterAndSearch();
  initReportPeriodSelector();
  initScrollspyAndSmoothScroll();
  initPhoneScrollAndDrag();
  initScrollRevealObserver();
  initHeroParallax();
  initNumberCounters();
  initChartInteractions();
  initProgressBars();
  initInteractiveDemoEngine();
  initSourceCodeModal();
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
   2. PRODUCT SHOWCASE TABS CONTROLLER (SMOOTH CHOREOGRAPHED TRANSITIONS)
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

      // Chuyển panel mượt mà: cross-fade & subtle slide không giật layout
      tabPanels.forEach(panel => {
        if (panel.id === targetTabId) {
          panel.style.display = 'block';
          panel.removeAttribute('hidden');
          // Buộc reflow để kích hoạt CSS transition
          void panel.offsetWidth;
          panel.classList.add('is-active');

          // Kích hoạt animation số và biểu đồ trong panel mới
          panel.querySelectorAll('[data-counter-target]').forEach(c => animateNumberCounter(c));
          panel.querySelectorAll('.chart-line-animated, .chart-area-animated, .chart-point-animated, .chart-bar-animated, .chart-donut-animated').forEach(ch => {
            ch.classList.add('is-animated');
          });
          panel.querySelectorAll('.progress-bar-animated').forEach(pb => {
            pb.classList.add('is-animated');
          });
        } else {
          panel.classList.remove('is-active');
          panel.setAttribute('hidden', '');
          panel.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. MONTH SELECTOR CONTROLLER (FLUTTER MONTHSELECTOR REPLICATION)
   ========================================================================== */
function initMonthSelector() {
  const prevBtn = document.getElementById('btnPrevMonth');
  const nextBtn = document.getElementById('btnNextMonth');
  const pills = document.querySelectorAll('#monthPillsContainer .month-pill');
  if (!pills.length) return;

  let activeIndex = Array.from(pills).findIndex(p => p.classList.contains('is-active'));
  if (activeIndex === -1) activeIndex = 1;

  function setActiveMonth(index) {
    if (index < 0 || index >= pills.length) return;
    activeIndex = index;
    pills.forEach((p, idx) => {
      if (idx === activeIndex) {
        p.classList.add('is-active');
        p.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        p.classList.remove('is-active');
      }
    });

    // Reset lại ô tìm kiếm và chip lọc khi chuyển tháng
    const searchInput = document.getElementById('txSearchInput');
    if (searchInput) {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
    }
  }

  pills.forEach((pill, idx) => {
    pill.addEventListener('click', () => {
      setActiveMonth(idx);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (activeIndex > 0) {
        setActiveMonth(activeIndex - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (activeIndex < pills.length - 1) {
        setActiveMonth(activeIndex + 1);
      }
    });
  }
}

/* ==========================================================================
   4. LIVE TRANSACTION FILTER & SEARCH CONTROLLER
   ========================================================================== */
function initTransactionFilterAndSearch() {
  const searchInput = document.getElementById('txSearchInput');
  const filterChips = document.querySelectorAll('.tx-filter-chip');
  const txRows = document.querySelectorAll('.demo-tx-row');
  const txCountElem = document.getElementById('demoTxVisibleCount');
  const dateHeaders = document.querySelectorAll('.tx-date-group-header');

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

    // Cập nhật ẩn/hiện header ngày theo các giao dịch con
    if (dateHeaders.length) {
      dateHeaders.forEach(header => {
        let hasVisibleChild = false;
        let sibling = header.nextElementSibling;
        while (sibling && !sibling.classList.contains('tx-date-group-header')) {
          if (sibling.classList.contains('demo-tx-row') && sibling.style.display !== 'none') {
            hasVisibleChild = true;
            break;
          }
          sibling = sibling.nextElementSibling;
        }
        header.style.display = hasVisibleChild ? '' : 'none';
      });
    }

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
   5. REPORT PERIOD SELECTOR CONTROLLER
   ========================================================================== */
function initReportPeriodSelector() {
  const periodBtns = document.querySelectorAll('.report-period-btn');
  const reportIncomeElem = document.getElementById('reportTotalIncome');
  const reportExpenseElem = document.getElementById('reportTotalExpense');
  const reportNetElem = document.getElementById('reportNetSavings');
  const reportInsightElem = document.getElementById('reportDerivedInsight');

  if (!periodBtns.length) return;

  // Dữ liệu mẫu nhất quán theo từng kỳ khớp 100% logic số dư 5 tab
  const periodData = {
    'month': {
      income: '+28.500.000 ₫',
      expense: '-16.850.000 ₫',
      net: '+11.650.000 ₫',
      insight: 'Dựa trên số liệu mẫu tháng này: Bạn đã tiết kiệm được 40,9% trên tổng thu nhập (+11.650.000 ₫). Chi tiêu cho Ăn uống chiếm tỷ trọng lớn nhất (36%), trong khi dòng tiền thặng dư giúp duy trì các mục tiêu tài chính đúng lộ trình.'
    },
    'quarter': {
      income: '+85.500.000 ₫',
      expense: '-49.500.000 ₫',
      net: '+36.000.000 ₫',
      insight: 'Dựa trên số liệu mẫu Quý 3: Thu nhập trung bình đạt 28.500.000 ₫/tháng với mức chi tiêu ổn định. Thặng dư tích lũy 36.000.000 ₫ đã giúp hoàn thành các mốc quan trọng trong quỹ du lịch và mua sắm thiết bị.'
    },
    'year': {
      income: '+342.000.000 ₫',
      expense: '-198.000.000 ₫',
      net: '+144.000.000 ₫',
      insight: 'Dựa trên số liệu mẫu 12 tháng: Tỷ lệ tích lũy duy trì ổn định trên 40%. Các khoản chi tiêu sinh hoạt cố định được kiểm soát tốt trong hạn mức ngân sách định kỳ, dòng tiền luôn duy trì dương.'
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
  const desktopNav = document.getElementById('desktopNav') || document.querySelector('.desktop-nav');
  const indicator = document.getElementById('navActiveIndicator') || document.querySelector('.nav-active-indicator');
  const navLinks = Array.from(document.querySelectorAll('.desktop-nav .nav-link'));
  const mobileNavLinks = Array.from(document.querySelectorAll('.mobile-nav-link'));
  const headerElem = document.querySelector('.site-header');

  // Danh sách 7 mục điều hướng chính theo đúng cấu trúc trang
  const targetIds = [
    'tinh-nang',
    'trai-nghiem',
    'ngan-sach',
    'bao-cao',
    'bao-mat',
    'cong-nghe',
    'tai-ung-dung'
  ];

  // Thu thập các phần tử section tương ứng trên trang
  const trackedSections = targetIds.map(id => {
    return {
      id: id,
      elem: document.getElementById(id)
    };
  }).filter(item => Boolean(item.elem));

  let currentActiveId = null;
  let isManualNavigating = false;
  let manualNavTimer = null;

  /**
   * Cập nhật vị trí và kích thước thanh underline dùng chung theo phần tử active
   * Sử dụng tọa độ tương đối từ getBoundingClientRect() với desktopNav container
   */
  function updateUnderline(activeLink, isImmediate = false) {
    if (!indicator || !desktopNav) return;

    if (!activeLink) {
      indicator.style.opacity = '0';
      return;
    }

    // Không tính toán nếu desktopNav đang bị ẩn (trên tablet/mobile)
    if (window.getComputedStyle(desktopNav).display === 'none') {
      indicator.style.opacity = '0';
      return;
    }

    const navRect = desktopNav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    // Tọa độ tương đối chính xác giữa link và nav container
    const left = Math.round(linkRect.left - navRect.left);
    const width = Math.round(linkRect.width);

    if (isImmediate) {
      indicator.style.transition = 'none';
    } else {
      indicator.style.transition = '';
    }

    indicator.style.transform = `translate3d(${left}px, 0, 0)`;
    indicator.style.width = `${width}px`;
    indicator.style.opacity = '1';

    if (isImmediate) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          indicator.style.transition = '';
        });
      });
    }
  }

  /**
   * Kích hoạt active tab và di chuyển underline
   */
  function setActiveTab(targetId, isImmediate = false) {
    currentActiveId = targetId;

    let activeDesktopLink = null;

    // Cập nhật trạng thái class is-active cho desktop nav links
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const linkId = href ? href.replace(/^#/, '') : '';
      if (linkId === targetId) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
        activeDesktopLink = link;
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });

    // Cập nhật trạng thái class is-active cho mobile drawer links
    mobileNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      const linkId = href ? href.replace(/^#/, '') : '';
      if (linkId === targetId) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });

    updateUnderline(activeDesktopLink, isImmediate);
  }

  // Smooth scroll bù trừ chiều cao header cố định và khóa scrollspy trong lúc di chuyển
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetHref = this.getAttribute('href');
      if (!targetHref || targetHref === '#') return;
      const targetId = targetHref.replace(/^#/, '');
      const targetElem = document.getElementById(targetId);

      if (targetElem) {
        e.preventDefault();

        const isNavSection = targetIds.includes(targetId);
        if (isNavSection) {
          isManualNavigating = true;
          clearTimeout(manualNavTimer);
          // Cho underline lướt êm ái tới ngay tab được chọn mà không bị giật bởi các section trung gian
          setActiveTab(targetId, false);
          manualNavTimer = setTimeout(() => {
            isManualNavigating = false;
          }, 850);
        }

        const headerHeight = headerElem ? headerElem.offsetHeight : 80;
        const targetY = targetElem.getBoundingClientRect().top + window.pageYOffset - headerHeight + 2;

        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth'
        });

        if (window.history && window.history.pushState) {
          window.history.pushState(null, null, targetHref);
        }
      }
    });
  });

  let scrollTicking = false;

  function handleScroll() {
    // 1. Cập nhật class is-scrolled cho Header cố định
    if (headerElem) {
      if (window.pageYOffset > 15) {
        headerElem.classList.add('is-scrolled');
      } else {
        headerElem.classList.remove('is-scrolled');
      }
    }

    // Nếu đang trong quá trình cuộn mượt do click tab, bỏ qua scrollspy
    if (isManualNavigating) return;

    if (!trackedSections.length) return;

    const scrollY = window.pageYOffset;
    const headerHeight = headerElem ? headerElem.offsetHeight : 80;

    // 2. Kiểm tra nếu người dùng đã cuộn tới tận cùng đáy trang
    const isAtBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 70);
    if (isAtBottom) {
      if (currentActiveId !== 'tai-ung-dung') {
        setActiveTab('tai-ung-dung', false);
      }
      return;
    }

    // 3. Tính toán vị trí document top thực tế của từng section
    const sectionMetrics = trackedSections.map(t => {
      const rect = t.elem.getBoundingClientRect();
      return {
        id: t.id,
        top: rect.top + scrollY,
        height: t.elem.offsetHeight
      };
    }).sort((a, b) => a.top - b.top);

    // Nếu người dùng đang ở đỉnh trang (Hero section trước khi chạm section đầu tiên)
    const firstSection = sectionMetrics[0];
    if (scrollY + headerHeight + 100 < firstSection.top) {
      if (currentActiveId !== null) {
        setActiveTab(null, false);
      }
      return;
    }

    // 4. Tìm section gần nhất đã đi qua mốc trigger
    let matchedId = null;
    const triggerPoint = scrollY + headerHeight + 120;

    for (let i = sectionMetrics.length - 1; i >= 0; i--) {
      const sec = sectionMetrics[i];
      if (triggerPoint >= sec.top) {
        matchedId = sec.id;
        break;
      }
    }

    if (matchedId && matchedId !== currentActiveId) {
      setActiveTab(matchedId, false);
    }
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        handleScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // Khởi tạo trạng thái ban đầu (Hỗ trợ Deep Linking qua URL hash)
  function initInitialState() {
    const hash = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
    if (targetIds.includes(hash)) {
      setActiveTab(hash, true);
    } else {
      handleScroll();
    }
  }

  // Khởi chạy khi DOM sẵn sàng
  initInitialState();

  // Tái căn chỉnh vị trí underline khi thay đổi kích thước trình duyệt
  window.addEventListener('resize', () => {
    if (currentActiveId) {
      const activeLink = navLinks.find(link => {
        const href = link.getAttribute('href');
        return href && href.replace(/^#/, '') === currentActiveId;
      });
      if (activeLink) {
        updateUnderline(activeLink, true);
      }
    }
  }, { passive: true });

  // Tái căn chỉnh khi Google Fonts nạp xong để tránh sai lệch kích thước chữ
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (currentActiveId) {
        const activeLink = navLinks.find(link => {
          const href = link.getAttribute('href');
          return href && href.replace(/^#/, '') === currentActiveId;
        });
        if (activeLink) {
          updateUnderline(activeLink, true);
        }
      }
    });
  }
}

/* ==========================================================================
   6. PHONE MOCKUP SCROLL & DRAG-TO-SCROLL CONTROLLER
   Cho phép người dùng trực tiếp cuộn, vuốt và tương tác với màn hình điện thoại
   ========================================================================== */
function initPhoneScrollAndDrag() {
  const phoneScroll = document.getElementById('phoneScrollableBody');
  const hintBadge = document.querySelector('.phone-interactive-hint-badge');
  const navItems = document.querySelectorAll('.phone-bottom-nav-dock .bottom-nav-item');
  const fabBtn = document.getElementById('phoneFabBtn');

  if (!phoneScroll) return;

  const tabKeys = ['home', 'transactions', 'budgets', 'charts'];
  let currentTabIndex = 0;

  function dismissHint() {
    if (hintBadge && hintBadge.parentNode) {
      hintBadge.style.opacity = '0';
      hintBadge.style.transform = 'translateX(-50%) translateY(-10px)';
      hintBadge.style.transition = 'all 0.3s ease';
      setTimeout(() => hintBadge.remove(), 300);
    }
  }

  // --- HÀM CHUYỂN TAB MÀN HÌNH ĐIỆN THOẠI CHÍNH XÁC ---
  function switchPhoneTab(targetKey) {
    dismissHint();
    const targetIndex = tabKeys.indexOf(targetKey);
    if (targetIndex !== -1) {
      currentTabIndex = targetIndex;
    }

    // 1. Cập nhật trạng thái active cho icon tab ở Bottom Dock
    navItems.forEach(item => {
      const key = item.getAttribute('data-phone-tab');
      if (key === targetKey) {
        item.classList.add('is-active');
        item.setAttribute('aria-selected', 'true');
      } else {
        item.classList.remove('is-active');
        item.setAttribute('aria-selected', 'false');
      }
    });

    // 2. Chuyển màn hình tương ứng (Trang chủ, Giao dịch, Ngân sách, Biểu đồ)
    const tabScreens = phoneScroll.querySelectorAll('.phone-tab-screen');
    tabScreens.forEach(screen => {
      const screenKey = screen.getAttribute('data-screen');
      if (screenKey === targetKey) {
        screen.classList.add('is-active');
        screen.style.display = 'block';
      } else {
        screen.classList.remove('is-active');
        screen.style.display = 'none';
      }
    });

    // 3. Cuộn mượt về đỉnh của màn hình mới
    phoneScroll.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Gắn sự kiện click / tap cho các tab ở Bottom Dock
  navItems.forEach(item => {
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');

    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const tabKey = item.getAttribute('data-phone-tab');
      if (tabKey) switchPhoneTab(tabKey);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const tabKey = item.getAttribute('data-phone-tab');
        if (tabKey) switchPhoneTab(tabKey);
      }
    });
  });

  // --- CUỘN BẰNG CON LĂN CHUỘT (MOUSE WHEEL) TRỰC TIẾP TRÊN MÀN HÌNH ---
  phoneScroll.addEventListener('wheel', (e) => {
    dismissHint();
    const maxScroll = phoneScroll.scrollHeight - phoneScroll.clientHeight;
    if (maxScroll > 0) {
      const prevScroll = phoneScroll.scrollTop;
      phoneScroll.scrollTop += e.deltaY;
      if (phoneScroll.scrollTop !== prevScroll) {
        e.preventDefault();
      }
    }
  }, { passive: false });

  // --- KÉO THẢ CHUỘT & VUỐT CẢM ỨNG (MOUSE DRAG & TOUCH SWIPE) ---
  let isPointerDown = false;
  let startX = 0;
  let startY = 0;
  let scrollStartTop = 0;
  let hasMoved = false;
  let lastY = 0;
  let velocityY = 0;
  let lastTime = 0;
  let isHorizontalGesture = false;

  function onPointerStart(clientX, clientY) {
    isPointerDown = true;
    hasMoved = false;
    isHorizontalGesture = false;
    startX = clientX;
    startY = clientY;
    lastY = clientY;
    lastTime = Date.now();
    velocityY = 0;
    scrollStartTop = phoneScroll.scrollTop;
    phoneScroll.style.cursor = 'grabbing';
    phoneScroll.style.userSelect = 'none';
  }

  function onPointerMove(clientX, clientY, e) {
    if (!isPointerDown) return;
    const diffX = clientX - startX;
    const diffY = clientY - startY;

    // Xác định cử chỉ ngang hay dọc sau ngưỡng 8px
    if (!hasMoved) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        hasMoved = true;
        if (Math.abs(diffX) > Math.abs(diffY) * 1.3) {
          isHorizontalGesture = true;
        }
      }
    }

    if (hasMoved) {
      dismissHint();

      if (!isHorizontalGesture) {
        // Cuộn dọc
        if (e && e.cancelable) e.preventDefault();
        phoneScroll.scrollTop = scrollStartTop - diffY;

        // Tính vận tốc để có quán tính fling
        const now = Date.now();
        const dt = Math.max(1, now - lastTime);
        velocityY = (clientY - lastY) / dt;
        lastY = clientY;
        lastTime = now;
      }
    }
  }

  function onPointerEnd(clientX, clientY) {
    if (!isPointerDown) return;
    isPointerDown = false;
    phoneScroll.style.cursor = 'grab';
    phoneScroll.style.removeProperty('user-select');

    if (hasMoved) {
      const diffX = clientX - startX;
      // Nếu lướt ngang quá 45px -> chuyển tab liền kề (Lướt chuyển tab)!
      if (isHorizontalGesture && Math.abs(diffX) > 45) {
        if (diffX < 0 && currentTabIndex < tabKeys.length - 1) {
          // Vuốt sang trái -> xem tab kế tiếp
          switchPhoneTab(tabKeys[currentTabIndex + 1]);
        } else if (diffX > 0 && currentTabIndex > 0) {
          // Vuốt sang phải -> quay lại tab trước
          switchPhoneTab(tabKeys[currentTabIndex - 1]);
        }
        return;
      }

      // Quán tính cuộn dọc (Momentum fling)
      if (!isHorizontalGesture && Math.abs(velocityY) > 0.25) {
        let inertia = velocityY * 180;
        let targetScroll = phoneScroll.scrollTop - inertia;
        phoneScroll.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
    }
  }

  // Chuột (Mouse Events)
  phoneScroll.addEventListener('mousedown', (e) => {
    if (e.target.closest('.phone-bottom-nav-dock') || e.target.closest('.phone-fab-button')) return;
    onPointerStart(e.clientX, e.clientY);
  });

  window.addEventListener('mousemove', (e) => {
    onPointerMove(e.clientX, e.clientY, e);
  });

  window.addEventListener('mouseup', (e) => {
    onPointerEnd(e.clientX, e.clientY);
  });

  // Cảm ứng di động (Touch Events)
  phoneScroll.addEventListener('touchstart', (e) => {
    if (e.target.closest('.phone-bottom-nav-dock') || e.target.closest('.phone-fab-button')) return;
    if (e.touches.length === 1) {
      onPointerStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  phoneScroll.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY, e);
    }
  }, { passive: false });

  phoneScroll.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
      onPointerEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
  });

  phoneScroll.addEventListener('touchcancel', (e) => {
    if (e.changedTouches.length === 1) {
      onPointerEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
  });

  // 2.3 Xử lý tương tác các nút filter chip bên trong điện thoại
  const phoneChipBtns = phoneScroll.querySelectorAll('.phone-chip-btn');
  phoneChipBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentRow = btn.closest('.phone-filter-chips-row');
      if (parentRow) {
        parentRow.querySelectorAll('.phone-chip-btn').forEach(b => b.classList.remove('is-active'));
      }
      btn.classList.add('is-active');
    });
  });

  // 3. Tương tác nút FAB (+) thêm giao dịch
  if (fabBtn) {
    fabBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fabBtn.style.transform = 'scale(0.85) rotate(45deg)';
      setTimeout(() => {
        fabBtn.style.transform = 'scale(1) rotate(0deg)';
      }, 250);

      // Hiển thị toast mô phỏng nhanh trong app và chuyển đến tab Giao dịch
      showPhoneToast('Đang mở form ghi nhận giao dịch...');
      setTimeout(() => {
        switchPhoneTab('transactions');
      }, 400);
    });
  }

  // 4. Hiệu ứng bung 2 thẻ nổi khi đưa chuột vào màn hình điện thoại
  const phoneFrame = document.querySelector('.mockup-phone-frame');
  const mockupStage = document.querySelector('.hero-mockup-stage');
  if (phoneFrame && mockupStage) {
    phoneFrame.addEventListener('mouseenter', () => {
      mockupStage.classList.add('is-phone-hovered');
    });
    phoneFrame.addEventListener('mouseleave', () => {
      mockupStage.classList.remove('is-phone-hovered');
    });
  }

  function showPhoneToast(message) {
    let existingToast = document.querySelector('.phone-mini-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'phone-mini-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: absolute;
      top: 50px;
      left: 50%;
      transform: translateX(-50%) translateY(-10px);
      background: #0B1B3D;
      color: #FFFFFF;
      font-size: 11.5px;
      font-weight: 700;
      padding: 7px 14px;
      border-radius: 100px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.25);
      z-index: 50;
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
      white-space: nowrap;
    `;

    const phoneScreen = document.querySelector('.phone-inner-screen');
    if (phoneScreen) {
      phoneScreen.appendChild(toast);
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
      });

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-10px)';
        setTimeout(() => toast.remove(), 250);
      }, 1800);
    }
  }

  // Đăng ký toàn cục để các nút shortcut trên HTML gọi được trực tiếp
  window.barodSwitchPhoneTab = switchPhoneTab;
}

/* ==========================================================================
   7. SCROLL-TRIGGERED REVEAL OBSERVER (CHOREOGRAPHED & ONCE-PER-SESSION)
   Theo chuẩn mực chuyển động fintech/corporate cao cấp, không giật lag
   Bảo đảm cơ chế an toàn: Không bao giờ để nội dung bị ẩn nếu observer trễ
   ========================================================================== */
function initScrollRevealObserver() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-from-left, .reveal-from-right, .reveal-scale-up');

  if (!revealElements.length) return;

  // Nếu người dùng yêu cầu giảm chuyển động, kích hoạt ngay lập tức mà không hiệu ứng
  if (prefersReduced) {
    revealElements.forEach(el => {
      el.classList.add('is-revealed');
      el.querySelectorAll('[data-counter-target]').forEach(c => animateNumberCounter(c));
      el.querySelectorAll('.chart-line-animated, .chart-area-animated, .chart-point-animated, .chart-bar-animated, .chart-donut-animated').forEach(ch => {
        ch.classList.add('is-animated');
      });
      el.querySelectorAll('.progress-bar-animated').forEach(pb => pb.classList.add('is-animated'));
    });
    return;
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        target.classList.add('is-revealed');

        // Kích hoạt animation số nhảy (Counters)
        if (target.hasAttribute('data-counter-target')) {
          animateNumberCounter(target);
        }
        target.querySelectorAll('[data-counter-target]').forEach(counter => {
          animateNumberCounter(counter);
        });

        // Kích hoạt animation biểu đồ SVG & Thanh tiến độ
        target.querySelectorAll('.chart-line-animated, .chart-area-animated, .chart-point-animated, .chart-bar-animated, .chart-donut-animated').forEach(chart => {
          chart.classList.add('is-animated');
        });
        target.querySelectorAll('.progress-bar-animated').forEach(bar => {
          bar.classList.add('is-animated');
        });

        // Chỉ chạy 1 lần duy nhất theo đúng yêu cầu đề bài
        obs.unobserve(target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // FAILSAFE TIMER (2.5s): Đảm bảo tuyệt đối không phần tử nào bị ẩn vĩnh viễn
  // ngay cả khi người dùng cuộn rất nhanh hoặc IntersectionObserver gặp lỗi môi trường
  setTimeout(() => {
    revealElements.forEach(el => {
      if (!el.classList.contains('is-revealed')) {
        el.classList.add('is-revealed');
        el.querySelectorAll('[data-counter-target]').forEach(c => animateNumberCounter(c));
        el.querySelectorAll('.chart-line-animated, .chart-area-animated, .chart-point-animated, .chart-bar-animated, .chart-donut-animated').forEach(ch => {
          ch.classList.add('is-animated');
        });
        el.querySelectorAll('.progress-bar-animated').forEach(pb => pb.classList.add('is-animated'));
      }
    });
  }, 2500);
}

/* ==========================================================================
   8. HERO LAYERED PARALLAX ENGINE (CONTROLLED DEPTH & SENSITIVITY)
   Độc quyền cho Desktop, tự động vô hiệu hóa trên Touch devices và Reduced Motion
   ========================================================================== */
function initHeroParallax() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth < 992);

  if (prefersReduced || isTouchDevice) return;

  const heroWrapper = document.querySelector('.hero-wrapper');
  const heroStage = document.querySelector('.hero-mockup-stage');
  const phoneFrame = document.querySelector('.mockup-phone-frame');
  const chipTop = document.querySelector('.mockup-floating-chip-top');
  const chipBottom = document.querySelector('.mockup-floating-chip-bottom');
  const glow = document.querySelector('.hero-ambient-glow');
  const glowSubtle = document.querySelector('.hero-ambient-glow-subtle');

  if (!heroWrapper || !heroStage) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;
  let currentScrollY = window.scrollY;
  let isTicking = false;

  let isPhoneHovered = false;
  let burstProgress = 0;

  if (phoneFrame) {
    phoneFrame.addEventListener('mouseenter', () => {
      isPhoneHovered = true;
      heroStage.classList.add('is-phone-hovered');
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(updateParallax);
      }
    });

    phoneFrame.addEventListener('mouseleave', () => {
      isPhoneHovered = false;
      heroStage.classList.remove('is-phone-hovered');
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(updateParallax);
      }
    });
  }

  function onMouseMove(e) {
    const rect = heroWrapper.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    // Chuẩn hóa tọa độ chuột từ -1.0 đến +1.0 tâm màn hình Hero
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(updateParallax);
    }
  }

  function onScroll() {
    currentScrollY = window.scrollY;
    if (currentScrollY < window.innerHeight && !isTicking) {
      isTicking = true;
      requestAnimationFrame(updateParallax);
    }
  }

  function onMouseLeave() {
    mouseX = 0;
    mouseY = 0;
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(updateParallax);
    }
  }

  function updateParallax() {
    // Lerp làm mượt chuyển động chuột (Dampening)
    currentMouseX += (mouseX - currentMouseX) * 0.08;
    currentMouseY += (mouseY - currentMouseY) * 0.08;

    // Lerp hiệu ứng bung thẻ ra (Burst Out): bung mượt mà khi đưa chuột vào màn hình điện thoại
    const targetBurst = isPhoneHovered ? 1 : 0;
    burstProgress += (targetBurst - burstProgress) * 0.12;

    const burstTopX = burstProgress * 54;
    const burstTopY = burstProgress * -28;
    const burstTopRot = burstProgress * 4.2;
    const burstTopScale = 1 + burstProgress * 0.04;

    const burstBottomX = burstProgress * -54;
    const burstBottomY = burstProgress * 28;
    const burstBottomRot = burstProgress * -4.2;
    const burstBottomScale = 1 + burstProgress * 0.04;

    // Góc nghiêng 3D kiểm soát tinh tế (Tối đa 2.2 độ)
    const rotX = currentMouseY * -2.2;
    const rotY = currentMouseX * 2.6;

    // 1. Khung điện thoại chính
    if (phoneFrame) {
      const phoneY = currentMouseY * 4.0 - currentScrollY * 0.03;
      phoneFrame.style.transform = `translate3d(${currentMouseX * 4}px, ${phoneY}px, 0) rotateX(${rotX * 0.7}deg) rotateY(${rotY * 0.7}deg)`;
    }

    // 2. Thẻ nổi trên (Cà phê Highlands bung ra góc trên bên phải)
    if (chipTop) {
      const chipTopY = currentMouseY * -8 + currentScrollY * 0.05;
      chipTop.style.transform = `translate3d(${currentMouseX * -10 + burstTopX}px, ${chipTopY + burstTopY}px, 20px) rotateX(${rotX * 0.8}deg) rotateY(${rotY * 0.8}deg) rotateZ(${3.5 + burstTopRot}deg) scale(${burstTopScale})`;
    }

    // 3. Thẻ nổi dưới (Quỹ Du lịch Nhật Bản bung ra góc dưới bên trái)
    if (chipBottom) {
      const chipBottomY = currentMouseY * 10 - currentScrollY * 0.06;
      chipBottom.style.transform = `translate3d(${currentMouseX * 12 + burstBottomX}px, ${chipBottomY + burstBottomY}px, 30px) rotateX(${rotX * 0.7}deg) rotateY(${rotY * 0.7}deg) rotateZ(${-2 + burstBottomRot}deg) scale(${burstBottomScale})`;
    }

    // 4. Ánh sáng môi trường Ambient Glow (Depth 0.1)
    if (glow) {
      glow.style.transform = `translate3d(${currentMouseX * 20}px, ${currentMouseY * 18}px, 0)`;
    }
    if (glowSubtle) {
      glowSubtle.style.transform = `translate3d(${currentMouseX * -14}px, ${currentMouseY * -12}px, 0)`;
    }

    // Tiếp tục loop nếu còn độ lệch nhỏ
    const diff = Math.abs(mouseX - currentMouseX) + Math.abs(mouseY - currentMouseY) + Math.abs(targetBurst - burstProgress);
    if (diff > 0.002) {
      requestAnimationFrame(updateParallax);
    } else {
      isTicking = false;
    }
  }

  heroWrapper.addEventListener('mousemove', onMouseMove, { passive: true });
  heroWrapper.addEventListener('mouseleave', onMouseLeave, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   9. ANIMATED NUMBER COUNTERS (FINANCIAL METRICS SMOOTH EASING)
   Duy trì định dạng tiền tệ Việt Nam chuẩn xác trong suốt quá trình đếm
   ========================================================================== */
function initNumberCounters() {
  const visibleCounters = document.querySelectorAll('.is-revealed [data-counter-target]');
  visibleCounters.forEach(c => animateNumberCounter(c));
}

function animateNumberCounter(elem) {
  if (!elem || elem.dataset.counted === 'true') return;

  const targetVal = parseInt(elem.getAttribute('data-counter-target'), 10);
  if (isNaN(targetVal)) return;

  elem.dataset.counted = 'true';

  const prefix = elem.getAttribute('data-counter-prefix') || '';
  const suffix = elem.getAttribute('data-counter-suffix') || '';
  const duration = 1400; // ms
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing hàm mũ mượt mà easeOutCubic: 1 - (1 - t)^3
    const ease = 1 - Math.pow(1 - progress, 3);
    const currentNumber = Math.round(targetVal * ease);

    // Định dạng tiền tệ VNĐ chuẩn với dấu chấm phân cách hàng nghìn
    elem.textContent = `${prefix}${currentNumber.toLocaleString('vi-VN')}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      elem.textContent = `${prefix}${targetVal.toLocaleString('vi-VN')}${suffix}`;
    }
  }

  requestAnimationFrame(step);
}

/* ==========================================================================
   INTERACTIVE FINANCIAL CHART TOOLTIPS
   Hiển thị tooltip nổi chính xác khi hover vào các điểm, cột và phân đoạn biểu đồ
   ========================================================================== */
function initChartInteractions() {
  const tooltip = document.getElementById('chartInteractiveTooltip');
  const container = document.querySelector('.showcase-window-body') || document.getElementById('trai-nghiem');
  if (!tooltip || !container) return;

  const interactiveElements = document.querySelectorAll(
    '.chart-point-animated[data-tooltip], .chart-bar-animated[data-tooltip], .donut-slice-interactive[data-tooltip]'
  );

  function positionTooltip(el) {
    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Tính toán tâm của phần tử đối với container
    const elCenterX = elRect.left + elRect.width / 2 - containerRect.left;
    const elTopY = elRect.top - containerRect.top;

    tooltip.style.left = `${elCenterX}px`;
    tooltip.style.top = `${elTopY}px`;
  }

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      const text = el.getAttribute('data-tooltip');
      if (!text) return;

      tooltip.textContent = text;
      tooltip.classList.add('is-visible');
      positionTooltip(el);
    });

    el.addEventListener('mousemove', () => {
      positionTooltip(el);
    });

    el.addEventListener('mouseleave', () => {
      tooltip.classList.remove('is-visible');
    });
  });
}

/* ==========================================================================
   PROGRESS BARS TRIGGER UTILITY
   Kích hoạt thanh tiến độ cho các khối hiển thị ban đầu
   ========================================================================== */
function initProgressBars() {
  const visibleBars = document.querySelectorAll('.showcase-tab-panel.is-active .progress-bar-animated, .is-revealed .progress-bar-animated');
  visibleBars.forEach(bar => bar.classList.add('is-animated'));
}

/* ==========================================================================
   10. INTERACTIVE DEMO ENGINE & REACTIVE DATA STATE
   Quản lý trạng thái tài chính mô phỏng, ghi nhận giao dịch trực tiếp và
   cập nhật đồng bộ tức thời số dư, chi tiêu, ngân sách và báo cáo giữa 5 tab
   ========================================================================== */
function initInteractiveDemoEngine() {
  const modalAddTx = document.getElementById('modalAddTransaction');
  const btnOpenAddTx = document.getElementById('btnOpenAddTxModal');
  const btnCloseAddTx = document.getElementById('btnCloseAddTxModal');
  const btnCancelAddTx = document.getElementById('btnCancelAddTx');
  const formAddTx = document.getElementById('formAddDemoTransaction');
  const btnReset = document.getElementById('btnResetDemoTx');

  const radioOut = document.getElementById('radioTypeOut');
  const radioIn = document.getElementById('radioTypeIn');
  const titleInput = document.getElementById('inputTxTitle');
  const amountInput = document.getElementById('inputTxAmount');
  const categorySelect = document.getElementById('selectTxCategory');
  const walletSelect = document.getElementById('selectTxWallet');

  if (!modalAddTx) return;

  // Trạng thái ban đầu chuẩn xác của bản Demo (Khớp 100% Drift SQLite Flutter App)
  const BASE_STATE = {
    mainWallet: 45850000,
    totalIncome: 28500000,
    totalExpense: 16850000,
    budgetTotal: 20000000,
    categories: {
      'ăn uống': { name: 'Ăn uống & Cafe', spent: 6066000, limit: 7500000, color: '#F59E0B' },
      'hóa đơn': { name: 'Hóa đơn & Nhà ở', spent: 4381000, limit: 5000000, color: '#3B82F6' },
      'mua sắm': { name: 'Mua sắm & Đồ dùng', spent: 3707000, limit: 4500000, color: '#EC4899' },
      'di chuyển': { name: 'Di chuyển & Xăng xe', spent: 2696000, limit: 3000000, color: '#10B981' }
    },
    txCount: 8
  };

  // State đang hoạt động trong phiên
  let currentState = JSON.parse(JSON.stringify(BASE_STATE));
  let currentTxType = 'out'; // 'out' hoặc 'in'

  // Định dạng số tiền VNĐ chuẩn
  function formatMoney(amount) {
    return Math.abs(amount).toLocaleString('vi-VN');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Mở & đóng modal
  function openAddTxModal() {
    modalAddTx.classList.add('is-open');
    modalAddTx.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (titleInput) {
      setTimeout(() => titleInput.focus(), 100);
    }
  }

  function closeAddTxModal() {
    modalAddTx.classList.remove('is-open');
    modalAddTx.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (formAddTx) formAddTx.reset();
    setType('out');
  }

  function setType(type) {
    currentTxType = type;
    if (type === 'out') {
      if (radioOut) radioOut.classList.add('is-active');
      if (radioIn) radioIn.classList.remove('is-active');
      if (categorySelect && categorySelect.value === 'thu nhập') {
        categorySelect.value = 'ăn uống';
      }
    } else {
      if (radioIn) radioIn.classList.add('is-active');
      if (radioOut) radioOut.classList.remove('is-active');
      if (categorySelect) {
        categorySelect.value = 'thu nhập';
      }
    }
  }

  if (btnOpenAddTx) btnOpenAddTx.addEventListener('click', openAddTxModal);
  if (btnCloseAddTx) btnCloseAddTx.addEventListener('click', closeAddTxModal);
  if (btnCancelAddTx) btnCancelAddTx.addEventListener('click', closeAddTxModal);

  modalAddTx.addEventListener('click', (e) => {
    if (e.target === modalAddTx) closeAddTxModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalAddTx.classList.contains('is-open')) {
      closeAddTxModal();
    }
  });

  if (radioOut) {
    radioOut.addEventListener('click', () => setType('out'));
  }
  if (radioIn) {
    radioIn.addEventListener('click', () => setType('in'));
  }

  // Icon SVG tương ứng cho danh mục
  const categoryIcons = {
    'ăn uống': {
      bg: 'rgba(245, 158, 11, 0.15)',
      color: '#F59E0B',
      label: 'Ăn uống',
      svg: '<svg class="lucide lucide-coffee" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Zm0 0h1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1"/><path d="M6 2v2"/></svg>'
    },
    'di chuyển': {
      bg: 'rgba(16, 185, 129, 0.15)',
      color: '#10B981',
      label: 'Di chuyển',
      svg: '<svg class="lucide lucide-fuel" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="22" x2="15" y2="22"/><rect width="10" height="13" x="4" y="9" rx="2"/><path d="M14 9h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V7.5a1.5 1.5 0 0 0-3 0V9"/><circle cx="9" cy="14" r="2"/></svg>'
    },
    'mua sắm': {
      bg: 'rgba(236, 72, 153, 0.15)',
      color: '#EC4899',
      label: 'Mua sắm',
      svg: '<svg class="lucide lucide-shopping-bag" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>'
    },
    'hóa đơn': {
      bg: 'rgba(59, 130, 246, 0.15)',
      color: '#3B82F6',
      label: 'Hóa đơn & Nhà ở',
      svg: '<svg class="lucide lucide-zap" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>'
    },
    'thu nhập': {
      bg: 'rgba(56, 179, 116, 0.15)',
      color: '#38B374',
      label: 'Thu nhập & Lương',
      svg: '<svg class="lucide lucide-briefcase" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>'
    }
  };

  // Cập nhật toàn bộ UI trên các Tab
  function renderAllTabsFromState() {
    const netSavings = currentState.totalIncome - currentState.totalExpense;
    const remainingBudget = Math.max(0, currentState.budgetTotal - currentState.totalExpense);
    const spentBudgetPercent = Math.min(100, (currentState.totalExpense / currentState.budgetTotal) * 100);

    // 1. CẬP NHẬT TAB 1: TỔNG QUAN
    // Ví chính
    document.querySelectorAll('.wallet-card-balance').forEach(el => {
      const card = el.closest('.overview-wallet-card');
      if (card && !card.classList.contains('savings') && !card.classList.contains('invest')) {
        el.textContent = `${formatMoney(currentState.mainWallet)} ₫`;
      }
    });

    // 4 card chỉ số trên Tab 1
    const overviewMetricCards = document.querySelectorAll('#tab-tong-quan .overview-metric-card');
    if (overviewMetricCards.length >= 4) {
      // Số dư
      const val0 = overviewMetricCards[0].querySelector('.metric-value-num');
      if (val0) val0.textContent = `${formatMoney(currentState.mainWallet)} ₫`;

      // Thu nhập
      const val1 = overviewMetricCards[1].querySelector('.metric-value-num');
      if (val1) val1.textContent = `+${formatMoney(currentState.totalIncome)} ₫`;

      // Chi tiêu
      const val2 = overviewMetricCards[2].querySelector('.metric-value-num');
      if (val2) val2.textContent = `-${formatMoney(currentState.totalExpense)} ₫`;

      // Ngân sách còn lại
      const val3 = overviewMetricCards[3].querySelector('.metric-value-num');
      if (val3) val3.textContent = `${formatMoney(remainingBudget)} ₫`;
      const sub3 = overviewMetricCards[3].querySelector('div:last-child');
      if (sub3) sub3.textContent = `Đã chi ${spentBudgetPercent.toFixed(1)}% từ ${formatMoney(currentState.budgetTotal)} ₫`;
    }

    // 2. CẬP NHẬT TAB 2: GIAO DỊCH
    const filterOutBtn = document.getElementById('filterChipOut');
    const filterInBtn = document.getElementById('filterChipIn');
    const allChipBtn = document.querySelector('.tx-filter-chips-group .tx-filter-chip[data-filter="all"]');

    if (filterOutBtn) filterOutBtn.textContent = `Chi tiêu (-${formatMoney(currentState.totalExpense)} ₫)`;
    if (filterInBtn) filterInBtn.textContent = `Thu nhập (+${formatMoney(currentState.totalIncome)} ₫)`;
    if (allChipBtn) allChipBtn.textContent = `Tất cả (${currentState.txCount})`;
    const txCountElem = document.getElementById('demoTxVisibleCount');
    if (txCountElem) txCountElem.textContent = `${currentState.txCount} giao dịch`;

    // 3. CẬP NHẬT TAB 3: NGÂN SÁCH
    const budgetCardTitle = document.querySelector('#tab-ngan-sach .budget-overview-bar-card div[style*="font-size: 28px"]');
    if (budgetCardTitle) {
      budgetCardTitle.innerHTML = `${formatMoney(remainingBudget)} ₫ <span style="font-size: 15px; font-weight: 600; color: #64748B;">còn lại từ ${formatMoney(currentState.budgetTotal)} ₫</span>`;
    }

    const budgetPercentPill = document.querySelector('#tab-ngan-sach .budget-overview-bar-card span[style*="background: #CCD9E8"]');
    if (budgetPercentPill) {
      const isWarn = spentBudgetPercent > 90;
      budgetPercentPill.textContent = `Đã chi ${spentBudgetPercent.toFixed(2)}% (${isWarn ? 'Cảnh báo hạn mức' : 'An toàn'})`;
      budgetPercentPill.style.background = isWarn ? '#FEE2E2' : '#CCD9E8';
      budgetPercentPill.style.color = isWarn ? '#DC2626' : '#0B1B3D';
    }

    const budgetProgressBar = document.querySelector('#tab-ngan-sach .budget-overview-bar-card div[style*="height: 100%"]');
    if (budgetProgressBar) {
      budgetProgressBar.style.width = `${spentBudgetPercent}%`;
      if (spentBudgetPercent > 95) {
        budgetProgressBar.style.background = 'linear-gradient(90deg, #F59E0B, #EF4444)';
      } else {
        budgetProgressBar.style.background = 'linear-gradient(90deg, #38B374, #4ADE80)';
      }
    }

    const budgetSummaryRow = document.querySelector('#tab-ngan-sach .budget-overview-bar-card div:last-child span:last-child');
    if (budgetSummaryRow) {
      budgetSummaryRow.innerHTML = `Đã chi <strong>${formatMoney(currentState.totalExpense)} ₫</strong> trong <strong>${formatMoney(currentState.budgetTotal)} ₫</strong>`;
    }

    // Cập nhật 4 danh mục ngân sách chi tiết
    const catBoxes = document.querySelectorAll('.budget-category-box');
    catBoxes.forEach(box => {
      const titleText = box.querySelector('.cat-title-text')?.textContent.toLowerCase() || '';
      for (const [key, data] of Object.entries(currentState.categories)) {
        if (titleText.includes(key)) {
          const catPercent = Math.min(100, (data.spent / data.limit) * 100);
          const fill = box.querySelector('.cat-progress-fill');
          if (fill) fill.style.width = `${catPercent}%`;

          const meta = box.querySelector('.cat-amount-meta');
          if (meta) {
            const remain = data.limit - data.spent;
            const remainStr = remain >= 0 ? `Còn ${Math.round(remain/1000)}k` : `Vượt ${Math.round(Math.abs(remain)/1000)}k`;
            meta.innerHTML = `<span>Đã chi: <strong>${formatMoney(data.spent)} ₫</strong></span><span>Hạn mức: <strong>${formatMoney(data.limit)} ₫</strong> (${remainStr})</span>`;
          }

          const pill = box.querySelector('.status-pill');
          if (pill) {
            if (data.spent >= data.limit) {
              pill.className = 'status-pill warning';
              pill.innerHTML = `100% (Vượt hạn mức)`;
            } else if (catPercent >= 85) {
              pill.className = 'status-pill warning';
              pill.innerHTML = `${Math.round(catPercent)}% (Sắp hết)`;
            } else {
              pill.className = 'status-pill normal';
              pill.innerHTML = `${Math.round(catPercent)}% (An toàn)`;
            }
          }
          break;
        }
      }
    });

    // 4. CẬP NHẬT TAB 4: BÁO CÁO
    const reportIncome = document.getElementById('reportTotalIncome');
    const reportExpense = document.getElementById('reportTotalExpense');
    const reportNet = document.getElementById('reportNetSavings');
    const reportInsight = document.getElementById('reportDerivedInsight');

    if (reportIncome) reportIncome.textContent = `+${formatMoney(currentState.totalIncome)} ₫`;
    if (reportExpense) reportExpense.textContent = `-${formatMoney(currentState.totalExpense)} ₫`;
    if (reportNet) {
      reportNet.textContent = `${netSavings >= 0 ? '+' : '-'}${formatMoney(netSavings)} ₫`;
      reportNet.style.color = netSavings >= 0 ? '#0B1B3D' : '#EF4444';
    }

    if (reportInsight) {
      const savingsRate = currentState.totalIncome > 0 ? ((netSavings / currentState.totalIncome) * 100).toFixed(1) : 0;
      reportInsight.textContent = `Dựa trên số liệu mẫu cập nhật: Tỷ lệ tích lũy đạt ${savingsRate}% trên tổng thu nhập (${netSavings >= 0 ? '+' : '-'}${formatMoney(netSavings)} ₫). Dữ liệu tính toán phản ứng tức thì với các giao dịch thử nghiệm mới.`;
    }

    // 5. CẬP NHẬT MÀN HÌNH ĐIỆN THOẠI MÔ PHỎNG (HERO PHONE)
    const phoneBalance = document.querySelector('.phone-inner-screen .acc-balance-text');
    if (phoneBalance) phoneBalance.textContent = `${formatMoney(currentState.mainWallet)} ₫`;
  }

  // Xử lý gửi Form thêm giao dịch
  if (formAddTx) {
    formAddTx.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = (titleInput?.value || '').trim();
      const amount = parseInt(amountInput?.value || '0', 10);
      const categoryKey = categorySelect?.value || 'ăn uống';
      const wallet = walletSelect?.value || 'Tài khoản chính';

      if (!title) {
        showWebToast('Vui lòng nhập nội dung giao dịch', 'error');
        return;
      }

      if (isNaN(amount) || amount <= 0) {
        showWebToast('Số tiền giao dịch không hợp lệ', 'error');
        return;
      }

      // Cập nhật State
      const isMainWallet = wallet.toLowerCase().includes('chính');
      if (currentTxType === 'out') {
        if (isMainWallet) {
          currentState.mainWallet -= amount;
        }
        currentState.totalExpense += amount;
        if (currentState.categories[categoryKey]) {
          currentState.categories[categoryKey].spent += amount;
        }
      } else {
        if (isMainWallet) {
          currentState.mainWallet += amount;
        }
        currentState.totalIncome += amount;
      }
      currentState.txCount += 1;

      // Tạo DOM Row mới cho Tab Giao dịch
      const catConfig = categoryIcons[categoryKey] || categoryIcons['ăn uống'];
      const txListContainer = document.getElementById('txEntriesList');
      const todayHeader = txListContainer?.querySelector('.tx-date-group-header');

      const newRow = document.createElement('div');
      newRow.className = 'demo-tx-row is-user-added';
      newRow.setAttribute('data-type', currentTxType);
      newRow.setAttribute('data-title', title.toLowerCase());
      newRow.setAttribute('data-category', categoryKey);
      newRow.style.animation = 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)';

      newRow.innerHTML = `
        <div class="tx-left-block">
          <div class="tx-cat-badge" style="background: ${catConfig.bg}; color: ${catConfig.color};">
            ${catConfig.svg}
          </div>
          <div>
            <div class="tx-name-title">${escapeHtml(title)} <span style="font-size: 10px; font-weight: 700; color: #38B374; background: #DCFCE7; padding: 1px 6px; border-radius: 4px; margin-left: 4px;">Mới tạo</span></div>
            <div class="tx-meta-desc">${catConfig.label} • Vừa xong • ${escapeHtml(wallet)}</div>
          </div>
        </div>
        <div class="tx-amount-col">
          <div class="tx-amount-val ${currentTxType === 'in' ? 'inflow' : 'outflow'}">${currentTxType === 'in' ? '+' : '-'}${formatMoney(amount)} ₫</div>
          <div style="font-size: 11px; color: #94A3B8;">${currentTxType === 'in' ? 'Thu nhập' : 'Chi tiêu'}</div>
        </div>
      `;

      if (todayHeader && todayHeader.nextSibling) {
        todayHeader.parentNode.insertBefore(newRow, todayHeader.nextSibling);
      } else if (txListContainer) {
        txListContainer.prepend(newRow);
      }

      // Cập nhật lại UI toàn hệ thống
      renderAllTabsFromState();

      // Cập nhật bộ lọc tìm kiếm
      const searchInput = document.getElementById('txSearchInput');
      if (searchInput) searchInput.dispatchEvent(new Event('input'));

      // Đóng modal và hiển thị Toast thông báo
      closeAddTxModal();
      showWebToast(`Đã thêm giao dịch: ${title} (${currentTxType === 'in' ? '+' : '-'}${formatMoney(amount)} ₫)`);

      // Tự động chuyển qua tab Giao dịch nếu chưa ở tab đó để người dùng nhìn thấy ngay
      const tabTxBtn = document.getElementById('tabBtn2');
      if (tabTxBtn && !tabTxBtn.classList.contains('is-active')) {
        tabTxBtn.click();
      }
    });
  }

  // Xử lý nút Đặt lại dữ liệu gốc (Reset)
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      currentState = JSON.parse(JSON.stringify(BASE_STATE));

      // Xóa các row giao dịch do người dùng thêm vào
      document.querySelectorAll('.demo-tx-row.is-user-added').forEach(el => el.remove());

      // Cập nhật lại UI
      renderAllTabsFromState();

      // Reset ô tìm kiếm
      const searchInput = document.getElementById('txSearchInput');
      if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
      }

      showWebToast('Đã khôi phục dữ liệu demo mẫu ban đầu');
    });
  }
}

/* ==========================================================================
   11. SOURCE CODE REPOSITORY & LOCAL BUILD MODAL
   Hiển thị thông tin mã nguồn chuẩn xác, cấu trúc dự án và lệnh khởi chạy
   ========================================================================== */
function initSourceCodeModal() {
  const modalSource = document.getElementById('modalSourceCode');
  const btnCloseSource = document.getElementById('btnCloseSourceModal');
  const openBtns = document.querySelectorAll('#btnOpenSourceCodeModal, .js-open-source-modal, a[href="#modalSourceCode"]');

  if (!modalSource) return;

  function openSourceModal(e) {
    if (e) e.preventDefault();
    modalSource.classList.add('is-open');
    modalSource.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeSourceModal() {
    modalSource.classList.remove('is-open');
    modalSource.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', openSourceModal);
  });

  if (btnCloseSource) {
    btnCloseSource.addEventListener('click', closeSourceModal);
  }

  modalSource.addEventListener('click', (e) => {
    if (e.target === modalSource) closeSourceModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalSource.classList.contains('is-open')) {
      closeSourceModal();
    }
  });
}

/* ==========================================================================
   12. WEB TOAST NOTIFICATION UTILITY
   Hiển thị thông báo nổi trang nhã, không che khuất nội dung
   ========================================================================== */
function showWebToast(message, type = 'success') {
  const toast = document.getElementById('barodWebToast');
  const textElem = document.getElementById('toastMessageText');
  if (!toast || !textElem) return;

  textElem.textContent = message;
  toast.classList.add('is-visible');

  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3200);
}
