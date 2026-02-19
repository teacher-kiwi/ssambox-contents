/**
 * 쌤박스(SsamBox) 공통 자바스크립트
 *
 * 모든 콘텐츠에서 사용하는 공통 기능:
 * - 컨트롤바 생성 (제목 + 전체화면 버튼)
 * - 전체화면 토글 (F 키 단축키)
 * - 컨트롤바 자동 숨김/표시
 * - 로딩 화면 관리
 *
 * 사용법:
 *   SsamBox.init({ title: '태양계 시뮬레이션' });
 */

var SsamBox = (function () {
  "use strict";

  var config = {
    title: "쌤박스 콘텐츠",
    autoHide: true,
    autoHideDelay: 3000,
  };

  var controls = null;
  var hideTimer = null;
  var isHidden = false;

  /**
   * 초기화 — 컨트롤바 생성, 이벤트 바인딩
   */
  function init(options) {
    if (typeof options === "string") {
      config.title = options;
    } else if (options) {
      config.title = options.title || config.title;
      config.autoHide =
        options.autoHide !== undefined ? options.autoHide : config.autoHide;
      config.autoHideDelay = options.autoHideDelay || config.autoHideDelay;
    }

    _createControls();
    _bindEvents();
    _startAutoHide();
    _hideLoading();
  }

  /**
   * 컨트롤바 DOM 생성
   */
  function _createControls() {
    controls = document.createElement("div");
    controls.className = "ssambox-controls";
    controls.id = "ssambox-controls";

    controls.innerHTML =
      '<div class="ssambox-controls__left">' +
      '<span class="ssambox-controls__logo">📦</span>' +
      '<span class="ssambox-controls__title">' +
      _escapeHtml(config.title) +
      "</span>" +
      "</div>" +
      '<div class="ssambox-controls__right">' +
      '<button class="ssambox-btn ssambox-btn--fullscreen" id="ssambox-fullscreen-btn" title="전체화면">' +
      '<span class="ssambox-btn__icon">⛶</span>' +
      "<span>전체화면</span>" +
      "</button>" +
      "</div>";

    document.body.appendChild(controls);

    // 전체화면 버튼 클릭 이벤트
    var btn = document.getElementById("ssambox-fullscreen-btn");
    if (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleFullscreen();
      });
    }
  }

  /**
   * 이벤트 바인딩
   */
  function _bindEvents() {
    // 마우스 움직임: 컨트롤바 표시
    document.addEventListener("mousemove", _onMouseMove);
    document.addEventListener("touchstart", _onMouseMove, { passive: true });

    // 전체화면 변경 감지 → 버튼 텍스트 업데이트 + 캔버스 리사이즈
    document.addEventListener("fullscreenchange", _onFullscreenChange);
  }

  /**
   * 마우스/터치 움직임 시 컨트롤바 표시
   */
  function _onMouseMove() {
    _showControls();
    _startAutoHide();
  }

  /**
   * 컨트롤바 표시
   */
  function _showControls() {
    if (controls && isHidden) {
      controls.classList.remove("ssambox-controls--hidden");
      isHidden = false;
    }
  }

  /**
   * 컨트롤바 숨김
   */
  function _hideControls() {
    if (controls && !isHidden && config.autoHide) {
      controls.classList.add("ssambox-controls--hidden");
      isHidden = true;
    }
  }

  /**
   * 자동 숨김 타이머 시작
   */
  function _startAutoHide() {
    if (!config.autoHide) return;
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(_hideControls, config.autoHideDelay);
  }

  /**
   * 전체화면 토글
   */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function () {
        // 전체화면 실패 시 조용히 무시
      });
    } else {
      document.exitFullscreen();
    }
  }

  /**
   * 전체화면 상태 변경 시 버튼 업데이트
   */
  function _onFullscreenChange() {
    var btn = document.getElementById("ssambox-fullscreen-btn");
    if (!btn) return;

    var icon = btn.querySelector(".ssambox-btn__icon");
    var text = btn.querySelector("span:nth-child(2)");

    if (document.fullscreenElement) {
      if (icon) icon.textContent = "⛶";
      if (text) text.textContent = "나가기";
    } else {
      if (icon) icon.textContent = "⛶";
      if (text) text.textContent = "전체화면";
    }

    // 전체화면 전환 후 컨트롤바 잠시 표시
    _showControls();
    _startAutoHide();

    // 캔버스 리사이즈 트리거 (레터박스 적용 후 캔버스가 새 크기를 반영하도록)
    setTimeout(function () {
      window.dispatchEvent(new Event("resize"));
    }, 100);
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
   * HTML 이스케이프
   */
  function _escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // 공개 API
  return {
    init: init,
    toggleFullscreen: toggleFullscreen,
  };
})();
