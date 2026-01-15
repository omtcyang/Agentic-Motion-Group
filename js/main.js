document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.img-compare-container').forEach(function(container) {
    const afterImg = container.querySelector('.img-after');
    const slider = container.querySelector('.img-compare-slider');
    // 支持所有 hint 类名
    const hint = container.querySelector('.img-compare-hint-black, .img-compare-hint-white');
    const initialPercent = 20;

    // 初始化
    function resetCompare() {
      if (afterImg) {
        afterImg.style.clipPath = 'inset(0 ' + (100 - initialPercent) + '% 0 0)';
      }
      if (slider) {
        slider.style.left = initialPercent + '%';
      }
    }

    // 滑块拖动
    function setSlider(x) {
      const rect = container.getBoundingClientRect();
      let offset = x - rect.left;
      offset = Math.max(0, Math.min(offset, rect.width));
      const percent = offset / rect.width * 100;
      afterImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      slider.style.left = percent + '%';
    }

    // 鼠标悬停时滑动
    container.addEventListener('mousemove', function(e) {
      setSlider(e.clientX);
    });

    // 鼠标进入时隐藏提示
    container.addEventListener('mouseenter', function() {
      if (hint) hint.style.display = 'none';
    });

    // 鼠标离开时恢复提示和初始比例
    container.addEventListener('mouseleave', function() {
      if (hint) hint.style.display = '';
      resetCompare();
    });

    // 支持触摸
    let startX = 0, startY = 0;
    container.addEventListener('touchstart', function(e) {
      if (hint) hint.style.display = 'none';
      if (e.touches.length > 0) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    }, {passive: false});

    container.addEventListener('touchmove', function(e) {
      if (e.touches.length > 0) {
        setSlider(e.touches[0].clientX);
        // 判断左右滑动，阻止页面滚动
        var dx = Math.abs(e.touches[0].clientX - startX);
        var dy = Math.abs(e.touches[0].clientY - startY);
        if (dx > dy) {
          e.preventDefault();
        }
      }
    }, {passive: false});

    container.addEventListener('touchend', function(e) {
      if (hint) hint.style.display = '';
      resetCompare();
    });

    // 页面加载时初始化一次
    resetCompare();
  });

  // 添加视频播放功能
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        const placeholder = container.querySelector('.video-placeholder');
        
        if (video && placeholder) {
            // 点击占位图时播放视频
            placeholder.addEventListener('click', function() {
                // 隐藏占位图
                placeholder.style.display = 'none';
                // 播放视频
                video.play();
                
                // 添加播放控制
                video.addEventListener('click', function() {
                    if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                        // 显示暂停时的控制界面
                        showVideoControls(video, placeholder);
                    }
                });
                
                // 视频结束时显示占位图
                video.addEventListener('ended', function() {
                    placeholder.style.display = 'flex';
                });
            });
            
            // 显示视频控制界面（暂停时）
            function showVideoControls(videoEl, placeholderEl) {
                const controls = document.createElement('div');
                controls.className = 'video-controls';
                controls.innerHTML = `
                    <div class="play-button">
                        <div class="play-icon"></div>
                    </div>
                `;
                controls.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgb(0, 0, 0, 0.1);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    z-index: 10;
                    cursor: pointer;
                `;
                
                controls.addEventListener('click', function(e) {
                    e.stopPropagation();
                    videoEl.play();
                    controls.remove();
                });
                
                container.appendChild(controls);
            }
        }
    });

  // 点击视频外部区域暂停视频并显示占位图
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.video-container')) {
            videoContainers.forEach(container => {
                const video = container.querySelector('video');
                const placeholder = container.querySelector('.video-placeholder');
                const controls = container.querySelector('.video-controls');
                
                if (video && !video.paused) {
                    video.pause();
                    if (controls) controls.remove();
                    if (placeholder) placeholder.style.display = 'flex';
                }
            });
        }
    });

});
