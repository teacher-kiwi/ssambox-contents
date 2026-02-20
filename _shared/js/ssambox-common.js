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

  // 공개 API
  return {
    init: init,
  };
})();
