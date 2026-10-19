# indigosound.art 정적 사이트

Wix로 운영하던 `indigobluestudio.wixsite.com/indigoblue-soundstud` 를
정적 HTML·CSS·JS로 옮긴 결과물입니다. GitHub Pages에 그대로 올릴 수 있습니다.

## 구성

- `../tools/template.html` — 사람이 고치는 원본입니다. 문구와 구조는 여기서 수정합니다.
- `index.html` — 생성 결과물입니다. 직접 고치지 말고 생성기를 다시 실행해 주세요.
- `assets/css/site.css` — 사이트 전체의 디자인입니다.
- `assets/js/player.js` — 미리듣기 재생을 담당합니다.
- `assets/img`, `assets/video` — Wix 미디어에서 내려받아 둔 이미지와 배경 영상입니다.
- `CNAME` — GitHub Pages에 커스텀 도메인을 알려 주는 파일입니다.

## 다시 만드는 방법

```
node tools/build.mjs
```

포트폴리오 카드 23칸과 미리듣기 18곡은 Wix 시절에 쓰던
`src/public/portfolioProjects.js`, `src/public/audioTracks.js`,
`src/public/projectGridMarkup.js`, `src/public/audioGridMarkup.js` 를
그대로 읽어서 만듭니다. 따라서 곡이나 프로젝트를 바꿀 때에는
지금까지와 똑같이 그 파일들만 고친 뒤 생성기를 한 번 실행하면 됩니다.

## 발행하는 방법

발행용 공개 저장소는 `BlueVillian/indigosound.art` 이고,
그 저장소의 루트가 이 `site/` 폴더입니다.
`git subtree` 로 이 폴더만 떼어 내어 올립니다.

```
node tools/build.mjs
git add site && git commit -m "사이트 내용 수정"
git subtree split --prefix=site -b site-root
git push https://github.com/BlueVillian/indigosound.art.git site-root:main
git branch -D site-root
```

이 저장소는 Wix와 연결되어 있으므로, 발행용 저장소에는
`site/` 안의 파일만 올라가고 Wix 쪽 코드는 올라가지 않습니다.

## 확인해 둘 점

미리듣기 음원 18곡은 `site/assets/audio` 안에 함께 들어 있으므로,
Wix 미디어 서버를 더 이상 참조하지 않습니다. 다만 `src/public/audioTracks.js` 의
`AUDIO_BASE_URL` 이 상대 경로가 되었기 때문에, 같은 모듈을 Wix 페이지 코드에서
그대로 쓰면 음원을 찾지 못합니다. Wix 쪽에서 다시 재생해야 한다면
그 페이지에서는 절대 주소를 따로 지정해야 합니다.
