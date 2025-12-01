// クリッカブルエリアの位置とサイズを更新する関数
function updateClickableAreas() {
    $('.floor-plan').each(function() {
        const container = $(this);
        const img = container.find('img');
        const originalWidth = parseInt(container.attr('data-original-width'));
        const scale = img.width() / originalWidth;

        // ハイライトエリアの更新
        container.find('.highlight-area').each(function() {
            const area = $(this);
            const originalDimensions = {
                left: parseFloat(area.attr('data-original-left')),
                top: parseFloat(area.attr('data-original-top')),
                width: parseFloat(area.attr('data-original-width')),
                height: parseFloat(area.attr('data-original-height'))
            };

            area.css({
                left: (originalDimensions.left * scale) + 'px',
                top: (originalDimensions.top * scale) + 'px',
                width: (originalDimensions.width * scale) + 'px',
                height: (originalDimensions.height * scale) + 'px'
            });
        });

        // ラベルの位置更新
        container.find('.area-label').each(function() {
            const label = $(this);
            const originalPosition = {
                left: parseFloat(label.attr('data-original-left')),
                top: parseFloat(label.attr('data-original-top'))
            };

            label.css({
                left: (originalPosition.left * scale) + 'px',
                top: (originalPosition.top * scale) + 'px'
            });
        });
    });
}

// モーダル管理
class ModalManager {
    static init() {
        // クリッカブルエリアクリック時の処理
        $('.highlight-area').on('click', function(e) {
            e.preventDefault();
            ModalManager.show(this);
        });

        // モーダルを閉じる処理
        $('.modal-close, .modal').on('click', function(e) {
            if (e.target === this) {
                ModalManager.hide();
            }
        });
    }

    static show(element) {
        const modal = $('#imageModal');
        const modalContent = modal.find('.modal-content');
        const modalImage = modal.find('.modal-image');
        const modalTitle = modal.find('.modal-title');
        const panoramaContainer = $('#panoramaContainer');
        const imageUrl = $(element).attr('href');
        
        modalTitle.text($(element).attr('data-title'));
        
        if (imageUrl.includes('pannellum')) {
            ModalManager.showPanorama(imageUrl, modalImage, panoramaContainer, modalContent);
        } else {
            ModalManager.showImage(imageUrl, modalImage, panoramaContainer, modalContent);
        }
        
        modal.css('display', 'flex');
    }

    static showImage(url, modalImage, panoramaContainer, modalContent) {
        panoramaContainer.hide();
        modalContent.css('width', '');
        
        const tempImage = new Image();
        tempImage.onload = function() {
            const maxWidth = Math.min(window.innerWidth * 0.9, 1200);
            const maxHeight = window.innerHeight * 0.9;
            
            let width = this.width;
            let height = this.height;
            
            if (width > maxWidth) {
                height = height * (maxWidth / width);
                width = maxWidth;
            }
            
            if (height > maxHeight) {
                width = width * (maxHeight / height);
                height = maxHeight;
            }
            
            modalContent.css('width', `${width + 40}px`);
            
            modalImage.show().attr('src', url);
        };
        
        tempImage.src = url;
    }

    static showPanorama(url, modalImage, panoramaContainer, modalContent) {
        modalImage.hide();
        modalContent.css('width', '95%');
        modalContent.css('max-width', '1200px');
        panoramaContainer.show();
        
        const panoramaUrl = url.replace(/^#pannellum=/, '');
        
        pannellum.viewer('panoramaContainer', {
            type: 'equirectangular',
            panorama: panoramaUrl,
            autoLoad: true,
            compass: true
        });
    }

    static hide() {
        const modal = $('#imageModal');
        const panoramaContainer = $('#panoramaContainer');
        const modalContent = modal.find('.modal-content');
        
        if (panoramaContainer.is(':visible')) {
            panoramaContainer.empty();
        }
        
        modalContent.css('width', '');
        modal.hide();
    }
}

// 初期化
$(document).ready(function() {
    ModalManager.init();
    
    // 画像読み込み完了時の処理
    $('.floor-plan img').on('load', updateClickableAreas);

    // 初回読み込み時の処理
    $('.floor-plan img').each(function() {
        if (this.complete) {
            $(this).trigger('load');
        }
    });

    // ウィンドウリサイズ時の処理
    let resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateClickableAreas, 100);
    });
});