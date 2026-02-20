/**
 * 쌤박스(SsamBox) 공통 자바스크립트 v2
 *
 * [역할 재정의]
 * 전체화면 제어는 외부 플랫폼(content_detail.html)이 전담합니다.
 * 내부 콘텐츠는 "주어진 공간에 맞춰 렌더링하기"에만 집중합니다.
 *
 * 사용법:
 *   SsamBox.init({ title: '태양계 시뮬레이션' });
 */

var SsamBox = (function () {
  "use strict";

  var config = {
    title: "쌤박스 콘텐츠",
  };

  /**
   * 초기화 — 로딩 화면 제거
   */
  function init(options) {
    if (typeof options === "string") {
      config.title = options;
    } else if (options) {
      config.title = options.title || config.title;
    }

    _hideLoading();
  }

  /**
   * 로딩 화면 숨김
   */
  function _hideLoading() {
    var loading = document.getElementById("ssambox-loading");
    if (loading) {
      setTimeout(function () {
        loading.classList.add("ssambox-loading--done");
        setTimeout(function () {
          loading.remove();
        }, 500);
      }, 300);
    }
  }

  /**
   * 주어진 비율에 맞는 최적 캔버스 크기 계산
   * iframe 뷰포트(window.innerWidth/Height)를 기준으로 letterbox 없이
   * 비율을 유지하는 최대 픽셀 크기를 반환합니다.
   *
   * @param {number} ratioW - 가로 비율 (예: 16)
   * @param {number} ratioH - 세로 비율 (예: 9)
   * @returns {{ width: number, height: number }}
   *
   * 사용 예:
   *   var sz = SsamBox.getOptimalCanvasSize(16, 9);
   *   createCanvas(sz.width, sz.height);
   */
  function getOptimalCanvasSize(ratioW, ratioH) {
    var ratio = ratioW / ratioH;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    if (vw / vh > ratio) {
      // 뷰포트가 더 넓음 → 높이 기준으로 맞춤
      return { width: Math.floor(vh * ratio), height: vh };
    } else {
      // 뷰포트가 더 좁음(또는 같음) → 너비 기준으로 맞춤
      return { width: vw, height: Math.floor(vw / ratio) };
    }
  }

  // 공개 API
  return {
    init: init,
    getOptimalCanvasSize: getOptimalCanvasSize,
  };
})();
