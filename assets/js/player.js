/*
  미리듣기 재생 담당입니다.
  Wix 시절에는 HTML 삽입(iframe) 안에서 돌던 코드였고,
  정적 사이트로 옮기면서 페이지에서 바로 동작하도록 고쳤습니다.

  화면 구성은 src/public/audioGridMarkup.js 가 만들고,
  이 파일은 그 결과물의 이름(.track, .play, .icon, .bar, .fill, .time, .t-title,
  data-audio-src, data-duration)에 기대어 동작합니다.
*/
(function () {
    'use strict';

    var current = null;   // 지금 재생 중인 트랙 정보

    function formatTime(seconds) {
        if (!isFinite(seconds) || seconds < 0) { return '0:00'; }
        var m = Math.floor(seconds / 60);
        var s = Math.floor(seconds % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function stopCurrent() {
        if (!current) { return; }
        current.audio.pause();
        current.el.classList.remove('is-playing');
        if (current.icon) { current.icon.innerHTML = '&#9654;'; }
        current.btn.setAttribute('aria-label', current.label + ' 재생');
        current = null;
    }

    function wireTrack(el) {
        var src = el.getAttribute('data-audio-src');
        var btn = el.querySelector('.play');
        var fill = el.querySelector('.fill');
        var bar = el.querySelector('.bar');
        var timeEl = el.querySelector('.time');
        var titleEl = el.querySelector('.t-title');
        var iconEl = el.querySelector('.icon');
        var label = titleEl ? titleEl.textContent : '트랙';
        var audio = null;

        if (!src || !btn) { return; }

        // 음원은 실제로 누를 때까지 내려받지 않습니다.
        function ensureAudio() {
            if (audio) { return audio; }
            audio = new Audio();
            audio.preload = 'none';
            audio.src = src;

            audio.addEventListener('timeupdate', function () {
                var total = audio.duration || Number(el.getAttribute('data-duration')) || 0;
                if (total > 0) { fill.style.width = ((audio.currentTime / total) * 100) + '%'; }
                timeEl.textContent = formatTime(audio.currentTime);
            });
            audio.addEventListener('ended', function () {
                fill.style.width = '0';
                timeEl.textContent = '0:00';
                stopCurrent();
            });
            audio.addEventListener('error', function () {
                timeEl.textContent = '재생 불가';
            });
            return audio;
        }

        btn.addEventListener('click', function () {
            var isThis = current && audio && current.audio === audio;
            if (isThis) { stopCurrent(); return; }

            // 한 번에 한 곡만 재생되도록 나머지를 멈춥니다.
            stopCurrent();
            var a = ensureAudio();
            a.play().catch(function () { timeEl.textContent = '재생 불가'; });
            el.classList.add('is-playing');
            if (iconEl) { iconEl.innerHTML = '&#10073;&#10073;'; }
            btn.setAttribute('aria-label', label + ' 일시정지');
            current = { audio: a, el: el, btn: btn, icon: iconEl, label: label };
        });

        // 진행 막대를 눌러 재생 위치를 옮깁니다.
        bar.addEventListener('click', function (event) {
            var a = ensureAudio();
            var total = a.duration || Number(el.getAttribute('data-duration')) || 0;
            if (!total) { return; }
            var rect = bar.getBoundingClientRect();
            var ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
            a.currentTime = total * ratio;
            fill.style.width = (ratio * 100) + '%';
        });
    }

    var list = document.querySelectorAll('.track');
    for (var i = 0; i < list.length; i += 1) { wireTrack(list[i]); }
})();
