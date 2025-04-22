$(document).ready(function() {
    // 텍스트 애니메이션 함수
    function animateText() {
        const activeSlide = mainBannerSwiper.slides[mainBannerSwiper.activeIndex];
        const text = $(activeSlide).find('.main-banner-txt p');
        
        let chars = text.text().split('');
        let html = chars.map((char, i) => {
            if (char === ' ') return ' ';
            return `<span style="animation-delay: ${0.2 + (i * 0.02)}s">${char}</span>`;
        }).join('');
        
        text.html(html);
    }

    // 메인 배너 슬라이더
    const mainBannerSwiper = new Swiper('.main-banner-swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        effect: 'fade',
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        on: {
            init: function() {
                // 초기 로드 시 애니메이션 적용
                setTimeout(animateText, 100);
            },
            slideChangeTransitionStart: function() {
                // 이전 슬라이드의 텍스트 초기화
                $('.main-banner-txt p').html(function(_, html) {
                    return html.replace(/<span>/g, '').replace(/<\/span>/g, '');
                });
            },
            slideChangeTransitionEnd: function() {
                // 슬라이드 변경 시 애니메이션 적용
                animateText();
            }
        }
    });


    // 섹션1 슬라이더 - 기본 페이드 효과
    const section1Swiper = new Swiper('.section1-slide', {
        effect: 'fade',  // 기본 페이드 효과
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.section1-slide .swiper-pagination',
            clickable: true
        }
    });

    section1Swiper.on('slideChangeTransitionStart', function() {
        const activeSlide = this.slides[this.activeIndex];
        $(activeSlide).find('.news-main-content').css('opacity', 0);
        $(activeSlide).find('.news-main-image').css('opacity', 0);
    });

    section1Swiper.on('slideChangeTransitionEnd', function() {
        const activeSlide = this.slides[this.activeIndex];
        $(activeSlide).find('.news-main-content').animate({opacity: 1}, 500);
        $(activeSlide).find('.news-main-image').animate({opacity: 1}, 500);
    });




    // 스크롤 이벤트 핸들러 수정
    function checkScroll() {
        const windowHeight = $(window).height();
        const scrollTop = $(window).scrollTop();
        const triggerOffset = 400; // 섹션 상단이 뷰포트 상단에 도달하기 200px 전에 활성화

        // Section 1, 2, 3의 .after-line 요소 체크 (섹션 기준, 오프셋 적용)
        $('.conSection:not(.section4)').each(function() {
            const section = $(this);
            const afterLine = section.find('.after-line');

            if (afterLine.length === 0 || afterLine.hasClass('active')) {
                return;
            }

            const sectionOffsetTop = section.offset().top;

            // 현재 스크롤 위치가 (섹션 상단 위치 - 200px) 보다 크면 활성화
            if (scrollTop > sectionOffsetTop - triggerOffset) {
                 afterLine.addClass('active');
            }
        });

        // Section 4의 .after-line 요소 체크
        const triggerPointSticky = scrollTop + windowHeight * 0.8; 
        $('.section4 .after-line').each(function() {
            const element = $(this);
            if (element.hasClass('active')) {
                return;
            }
            const sectionTop = element.offset().top;
            if (sectionTop < triggerPointSticky) {
                element.addClass('active');
            }
        });

        // section-container 요소 체크
        const eightyPercentViewport = windowHeight * 0.8;
        $('.section-container').each(function() {
            const element = $(this);
            if (element.hasClass('active')) {
                return;
            }
            const rect = element[0].getBoundingClientRect();
            const elementTopViewport = rect.top;
            if (elementTopViewport < eightyPercentViewport) {
                element.addClass('active');
            }
        });

        // section2-cont-item 요소들 체크
        const eightyFivePercentViewport = windowHeight * 0.85;
        $('.section2-cont-item').each(function(index) {
            const element = $(this);
            if (element.hasClass('active')) {
                return;
            }
            const rect = element[0].getBoundingClientRect();
            const elementTopViewport = rect.top;
            if (elementTopViewport < eightyFivePercentViewport) {
                const delay = index * 200;
                setTimeout(() => {
                    element.addClass('active');
                }, delay);
            }
        });

        // section3, section4 다크모드 체크 (offset().top 유지 또는 변경 고려)
        // ... (다크모드 체크 로직 - 현재 offset 사용, 문제 없다면 유지) ...
        const section3 = $('.section3');
        const section4 = $('.section4');
        if(section3.length || section4.length) {
            const section3Top = section3.offset().top;
            const section3Bottom = section3Top + section3.outerHeight();
            const section4Top = section4.offset().top;
            const section4Bottom = section4Top + section4.outerHeight();
            const triggerPointDark = scrollTop + (windowHeight * 0.5);

            if ((triggerPointDark >= section3Top && scrollTop <= section3Bottom) || 
                (triggerPointDark >= section4Top && scrollTop <= section4Bottom)) {
                $('body').addClass('dark-mode');
            } else {
                $('body').removeClass('dark-mode');
            }
        }

        // section3-cont-item 요소들 체크
        $('.section3-cont-item').each(function(index) {
            const element = $(this);
            if (element.hasClass('active')) {
                return;
            }
            const rect = element[0].getBoundingClientRect();
            const elementTopViewport = rect.top;
            if (elementTopViewport < eightyFivePercentViewport) {
                const delay = index * 200;
                setTimeout(() => {
                    element.addClass('active');
                }, delay);
            }
        });
    }


    
    // 초기 로드 시 체크 -> $(document).ready() 안으로 이동
    // checkScroll(); 

    // 스크롤 이벤트에 스로틀링 적용
    let isScrolling = false;
    $(window).scroll(function() {
        if (!isScrolling) {
            isScrolling = true;
            setTimeout(function() {
                checkScroll(); 
                handleSection4Scroll();
                startGraphCounter();
                isScrolling = false;
            }, 50);
        }
    });

    // DOM 준비 완료 후 초기 체크 실행 (초기 활성화 문제 방지 위해 지연 유지)
    $(document).ready(function() {
        setTimeout(function() {
            checkScroll();
        }, 500); 

        setTimeout(() => {
            startGraphCounter();
        }, 1000);
    });

    // section4 스크롤 이벤트 처리
    function handleSection4Scroll() {
        const section4 = $('.section4');
        if(section4.length) {
            const section4Top = section4.offset().top;
            const section4Bottom = section4Top + section4.outerHeight();
            const windowHeight = $(window).height();
            const scrollTop = $(window).scrollTop();
            const triggerPoint = scrollTop + (windowHeight * 0.5);

            // section4 영역에 들어왔는지 체크
            if (triggerPoint >= section4Top && scrollTop <= section4Bottom) {
                const section4Conts = $('.section4-cont');
                const sectionHeight = section4.outerHeight();
                const contHeight = sectionHeight / section4Conts.length;
                
                section4Conts.each(function(index) {
                    const contTop = section4Top + (contHeight * index);
                    const contBottom = contTop + contHeight;
                    
                    if (scrollTop >= contTop && scrollTop < contBottom) {
                        $(this).addClass('active');
                    } else if (scrollTop < contTop) {
                        // 스크롤이 위로 올라갈 때는 active 클래스를 제거
                        $(this).removeClass('active');
                    }
                });
            } else {
                // section4 영역을 벗어나면 모든 active 클래스 제거
                $('.section4-cont').removeClass('active');
            }
        }
    }

    // circle 애니메이션 처리
    let animationInterval = null;

    function startCircleAnimation() {
        // 이미 실행 중인 애니메이션이 있다면 중지
        if (animationInterval) {
            clearInterval(animationInterval);
        }

        // 모든 circle의 active 클래스 제거
        function resetCircles() {
            for (let i = 1; i <= 6; i++) {
                $(`#circle${i}`).removeClass('active');
                $(`.circle-list li:nth-child(${i})`).removeClass('active');
            }
        }

        // 초기 상태 설정
        resetCircles();
        let currentCircle = 1;
        const totalCircles = 6;
        const interval = 3000; // 3초 간격

        // 첫 번째 circle 활성화
        $(`#circle${currentCircle}`).addClass('active');
        $(`.circle-list li:nth-child(${currentCircle})`).addClass('active');

        // setInterval로 순차적 애니메이션 실행
        animationInterval = setInterval(() => {
            resetCircles();
            currentCircle = currentCircle % totalCircles + 1;
            $(`#circle${currentCircle}`).addClass('active');
            $(`.circle-list li:nth-child(${currentCircle})`).addClass('active');
        }, interval);
    }

    // 초기 로드 시 애니메이션 시작
    $(document).ready(function() {
        // DOM이 완전히 로드된 후 약간의 지연을 두고 애니메이션 시작
        setTimeout(() => {
            startCircleAnimation();
        }, 500);
    });

    // 헤더 스크롤 이벤트 처리
    let lastScrollTop = 0;
    const header = $('.header');
    const headerHeight = header.outerHeight();

    $(window).scroll(function() {
        const scrollTop = $(window).scrollTop();
        
        // 스크롤 위치에 따라 header에 scrolled 클래스 추가/제거
        if (scrollTop > 50) {
            header.addClass('scrolled');
        } else {
            header.removeClass('scrolled');
        }
        
        if (scrollTop > lastScrollTop) {
            // 스크롤 다운
            header.css('transform', `translateY(-${headerHeight}px)`);
        } else {
            // 스크롤 업
            header.css('transform', 'translateY(0)');
        }
        
        lastScrollTop = scrollTop;
    });

    // 초기 로드 시 헤더 위치 설정
    header.css({
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'width': '100%',
        'transition': 'transform 0.3s ease',
        'z-index': '1000'
    });

    // graph-list 카운터 애니메이션 처리
    function startGraphCounter() {
        const graphList = $('.graph-list li');
        const windowHeight = $(window).height();
        const scrollTop = $(window).scrollTop();
        const windowMiddle = scrollTop + (windowHeight * 0.4); // 화면 중간 지점

        graphList.each(function() {
            const item = $(this);
            const dd = item.find('dd');
            const targetNumber = parseInt(dd.text());
            const itemTop = item.offset().top;
            const itemHeight = item.outerHeight();
            const itemBottom = itemTop + itemHeight;

            // 아이템이 화면 중간 지점을 지나갔는지 확인
            if (itemTop <= windowMiddle && itemBottom >= windowMiddle && !item.hasClass('counted')) {
                item.addClass('counted');
                let currentNumber = 0;
                const duration = 2000; // 2초 동안 카운트
                const steps = 60; // 60프레임
                const increment = targetNumber / steps;
                const interval = duration / steps;

                const counter = setInterval(() => {
                    currentNumber += increment;
                    if (currentNumber >= targetNumber) {
                        currentNumber = targetNumber;
                        clearInterval(counter);
                    }
                    dd.text(Math.floor(currentNumber));
                }, interval);
            }
        });
    }

    // 스크롤 이벤트에 graph 카운터 추가
    $(window).scroll(function() {
        if (!isScrolling) {
            isScrolling = true;
            setTimeout(function() {
                checkScroll();
                handleSection4Scroll();
                startGraphCounter();
                isScrolling = false;
            }, 100); // 스로틀링 시간 증가
        }
    });

    // 초기 로드 시에도 체크
    $(document).ready(function() {
        // DOM이 완전히 로드된 후 약간의 지연을 두고 체크
        setTimeout(() => {
            startGraphCounter();
        }, 1000); // 초기 로드 지연 시간 증가
    });

});