document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.sidebar-nav > ul > li > a');
    const progressBar = document.getElementById('scroll-progress');
    const dateElement = document.getElementById('current-date');
    const sidebarToggles = document.querySelectorAll('.sidebar-toggle');

    // 1. スライドに自動でIDを付与 (slide-01, slide-02...)
    const slides = document.querySelectorAll('.presentation-slide');
    slides.forEach((slide, index) => {
        const slideNumber = (index + 1).toString().padStart(2, '0');
        slide.id = `slide-${slideNumber}`;
    });

    // 2. サイドバーのスライドリスト項目にクリックイベントを設定
    // テキスト内の番号（01, 02...）を抽出してジャンプさせる堅牢なロジック
    const sidebarSlideItems = document.querySelectorAll('.sidebar-nav ul ul li');
    sidebarSlideItems.forEach((item) => {
        item.style.cursor = 'pointer';
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = 'rgba(255,255,255,0.1)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'transparent';
        });
        
        item.addEventListener('click', (e) => {
            e.stopPropagation(); // 親要素のイベント発火を防止
            
            // spanタグ内またはテキスト内の2桁の数字を探す
            const text = item.textContent;
            const match = text.match(/(\d{2})/);
            
            if (match) {
                const slideNumber = match[1];
                const targetSlide = document.getElementById(`slide-${slideNumber}`);
                if (targetSlide) {
                    window.scrollTo({
                        top: targetSlide.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 現在の日付を表示
    if (dateElement) {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        dateElement.textContent = now.toLocaleDateString('ja-JP', options);
    }

    // スクロール時の処理
    window.addEventListener('scroll', () => {
        let current = '';
        
        // 進捗バーの更新
        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        }

        // アクティブセクションの判定
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // PDF出力ボタン
    const btnPrint = document.querySelector('.btn-print');
    if (btnPrint) {
        btnPrint.addEventListener('click', () => {
            window.print();
        });
    }

    // チャプターへのスムーズスクロール
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
            if (window.innerWidth <= 768) {
                document.body.classList.remove('sidebar-open');
            }
        });
    });

    // モバイルのサイドバー開閉
    if (sidebarToggles.length) {
        sidebarToggles.forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.classList.toggle('sidebar-open');
            });
        });
    }

    // スライドリンクを押したらメニューを閉じる
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                document.body.classList.remove('sidebar-open');
            }
        });
    });
});
