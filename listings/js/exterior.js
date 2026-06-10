document.addEventListener('DOMContentLoaded', () => {
    // 必要な要素の取得
    const mainImage1 = document.getElementById('mainImage1');
    const mainImage2 = document.getElementById('mainImage2');
    const imageDescription = document.getElementById('imageDescription');
    const thumbnailWrapper = document.getElementById('thumbnailWrapper');
    const thumbnails = document.querySelectorAll('.thumbnail');

    // 画像切り替え用の変数
    let activeImage = mainImage1;
    let inactiveImage = mainImage2;

    /**
     * 画像を切り替える関数
     * @param {string} newSrc - 新しい画像のURL
     * @param {string} newAlt - 新しい画像の代替テキスト
     * @param {string} newDescription - 新しい画像の説明文
     */
    function changeImage(newSrc, newAlt, newDescription) {
        // 現在表示中の画像をフェードアウト
        activeImage.classList.add('fade-out');

        // 新しい画像を読み込む
        const preloadImage = new Image();
        preloadImage.onload = () => {
            // 非表示の画像を更新
            inactiveImage.src = newSrc;
            inactiveImage.alt = newAlt;
            inactiveImage.style.opacity = '1';

            // 説明文をフェードアウト
            imageDescription.classList.add('fade-out');

            // 0.6秒後に画像を切り替え
            setTimeout(() => {
                activeImage.style.opacity = '0';
                activeImage.classList.remove('fade-out');

                // アクティブな画像を入れ替え
                [activeImage, inactiveImage] = [inactiveImage, activeImage];

                // 説明文を更新してフェードイン
                imageDescription.textContent = newDescription;
                imageDescription.classList.remove('fade-out');
                imageDescription.classList.add('text-pop-in');

                // アニメーション効果を削除
                setTimeout(() => {
                    imageDescription.classList.remove('text-pop-in');
                }, 500);
            }, 600);
        };
        preloadImage.src = newSrc;
    }

    /**
     * サムネイル画像のクリックイベントを設定
     */
    function setupThumbnails() {
        thumbnails.forEach(thumbnail => {
            // クリックとタッチの両方に対応
            const handleClick = (e) => {
                e.preventDefault();

                // クリックされたサムネイルをアクティブに
                thumbnails.forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');

                // 画像を切り替え
                changeImage(
                    thumbnail.src,
                    thumbnail.alt,
                    thumbnail.dataset.description
                );
            };

            thumbnail.addEventListener('click', handleClick);
            thumbnail.addEventListener('touchend', handleClick);
        });
    }

    /**
         * 画面サイズに応じてレイアウトを調整
         */
    function updateLayout() {
        const width = window.innerWidth;

        // 全サイズ共通で折り返しなし（nowrap）と、左詰め（flex-start）を徹底する
        thumbnailWrapper.style.flexWrap = 'nowrap';
        thumbnailContainer.style.justifyContent = 'flex-start';
        thumbnailWrapper.style.justifyContent = 'flex-start';

        if (width <= 659) {
            thumbnailWrapper.style.gap = '10px';
        } else if (width <= 960) {
            thumbnailWrapper.style.gap = '15px';
        } else {
            thumbnailWrapper.style.gap = '25px';
        }
    }

    // 初期設定
    setupThumbnails();
    updateLayout();

    // 画面サイズが変更されたときにレイアウトを更新
    window.addEventListener('resize', updateLayout);
});