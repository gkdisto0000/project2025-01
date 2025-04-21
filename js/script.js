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
        // after-line 요소 체크 (기존 코드 유지)
        $('.after-line').each(function() {
            const sectionTop = $(this).offset().top;
            const windowHeight = $(window).height();
            const scrollTop = $(window).scrollTop();
            const triggerPoint = scrollTop + (windowHeight * 0.8);
            
            if (sectionTop < triggerPoint) {
                $(this).addClass('active');
            }
        });
    
        // section-container 요소 체크
        $('.section-container').each(function() {
            const sectionTop = $(this).offset().top;
            const windowHeight = $(window).height();
            const scrollTop = $(window).scrollTop();
            const triggerPoint = scrollTop + (windowHeight * 0.8);
            
            if (sectionTop < triggerPoint) {
                $(this).addClass('active');
            }
        });
    
        // section2-cont-item 요소들 체크 추가
        $('.section2-cont-item').each(function(index) {
            const itemTop = $(this).offset().top;
            const windowHeight = $(window).height();
            const scrollTop = $(window).scrollTop();
            const triggerPoint = scrollTop + (windowHeight * 0.85);
            
            if (itemTop < triggerPoint) {
                // setTimeout을 사용하여 순차적으로 나타나도록 설정
                const delay = index * 200; // 각 아이템 사이 0.2초 딜레이
                setTimeout(() => {
                    $(this).addClass('active');
                }, delay);
            }
        });

        // section3, section4 다크모드 체크
        const section3 = $('.section3');
        const section4 = $('.section4');
        if(section3.length || section4.length) {  // section3 또는 section4가 존재하는 경우에만 실행
            const section3Top = section3.offset().top;
            const section3Bottom = section3Top + section3.outerHeight();
            const section4Top = section4.offset().top;
            const section4Bottom = section4Top + section4.outerHeight();
            const windowHeight = $(window).height();
            const scrollTop = $(window).scrollTop();
            const triggerPoint = scrollTop + (windowHeight * 0.5); // 화면 중간 지점에서 전환

            // 섹션3 또는 섹션4 영역에 들어왔는지 체크
            if ((triggerPoint >= section3Top && scrollTop <= section3Bottom) || 
                (triggerPoint >= section4Top && scrollTop <= section4Bottom)) {
                $('body').addClass('dark-mode');
            } else {
                $('body').removeClass('dark-mode');
            }
        }


        $('.section3-cont-item').each(function(index) {
            const itemTop = $(this).offset().top;
            const windowHeight = $(window).height();
            const scrollTop = $(window).scrollTop();
            const triggerPoint = scrollTop + (windowHeight * 0.85);
            
            if (itemTop < triggerPoint) {
                // setTimeout을 사용하여 순차적으로 나타나도록 설정
                const delay = index * 200; // 각 아이템 사이 0.2초 딜레이
                setTimeout(() => {
                    $(this).addClass('active');
                }, delay);
            }
        });


        
    }


    
    // 초기 로드 시 체크
    checkScroll();

    // 스크롤 이벤트에 스로틀링 적용
    let isScrolling = false;
    $(window).scroll(function() {
        if (!isScrolling) {
            isScrolling = true;
            setTimeout(function() {
                checkScroll();
                isScrolling = false;
            }, 50);
        }
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
                    } else {
                        $(this).removeClass('active');
                    }
                });
            }
        }
    }

    // 스크롤 이벤트에 section4 처리 추가
    $(window).scroll(function() {
        if (!isScrolling) {
            isScrolling = true;
            setTimeout(function() {
                checkScroll();
                handleSection4Scroll();
                isScrolling = false;
            }, 50);
        }
    });

    // 초기 로드 시 section4 처리
    handleSection4Scroll();






});