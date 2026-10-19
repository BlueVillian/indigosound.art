/*
  마무리 영역의 패럴렉스를 담당합니다.

  섹션이 화면에 드러난 정도를 0에서 1 사이의 값으로 환산한 다음,
  파란 영역은 아래에서 위로, 문구는 위에서 아래로 서로 반대 방향으로 움직입니다.
  두 요소가 다른 속도로 움직이므로 깊이가 있는 것처럼 보입니다.

  히어로의 등장 애니메이션은 CSS 가 담당하므로 여기서는 다루지 않습니다.
*/
(function () {
    'use strict';

    var section = document.querySelector('.ib-outro');
    if (!section) { return; }

    var arc = section.querySelector('.ib-outro__arc');
    var headline = section.querySelector('.ib-outro__headline');
    if (!arc || !headline) { return; }

    // 움직임을 줄여 달라는 설정이면 제자리에 두고 아무것도 하지 않습니다.
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion && reduceMotion.matches) { return; }

    var ARC_TRAVEL = 180;       // 파란 영역이 아래에서 올라오는 거리입니다.
    var HEADLINE_TRAVEL = 110;  // 문구가 위에서 내려오는 거리입니다.

    var pending = false;

    // 섹션이 화면에 보이는 높이의 비율입니다.
    // 섹션이 마지막 구역이라 끝까지 스크롤해도 화면을 다 채우지는 못하므로,
    // 스크롤 위치가 아니라 드러난 정도를 기준으로 삼아야 1에 도달합니다.
    function progress() {
        var rect = section.getBoundingClientRect();
        var shown = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        var span = Math.min(rect.height, window.innerHeight);
        if (span <= 0) { return 1; }
        return Math.min(1, Math.max(0, shown / span));
    }

    function apply() {
        pending = false;
        var remaining = 1 - progress();
        arc.style.transform =
            'translateX(-50%) translateY(' + (remaining * ARC_TRAVEL).toFixed(1) + 'px)';
        headline.style.transform =
            'translateY(' + (remaining * -HEADLINE_TRAVEL).toFixed(1) + 'px)';
    }

    function schedule() {
        if (pending) { return; }
        pending = true;
        window.requestAnimationFrame(apply);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    apply();
})();
