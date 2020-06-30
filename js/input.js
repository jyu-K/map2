window.addEventListener('DOMContentLoaded',
    function () {

    //ページが読み込まれたタイミングで実行される
        let c;
        let subject = document.getElementById('subject');
        let memo = document.getElementById('memo');
        let save = document.getElementById('save');
        let cancel = document.getElementById('cancel');
        let board = document.getElementById('board');

        // Canvas APIを利用した処理
        c = board.getContext('2d');
        c.strokeStyle = '#e80';
        c.lineWidth = 3;

        save.addEventListener('click',
            function (e) {
            //保存ボタンクリックしたとき動く
                e.preventDefault();
                if (subject.validity.valid === false ||
                    memo.validity.valid === false) {
                    //件名・メモが入力されていない時実行される
                    window.alert('件名メモいるよ　');
                    return;
                }
            //セッションストレージから現在位置を取得するコード
            let cpos_latitude = sessionStorage.getItem('cpos_latitude');
            let cpos_longitude = sessionStorage.getItem('cpos_longitude');
            if (cpos_latitude === null || cpos_longitude === null) {
                window.alert('トップページからアクセスしてんやい');
                location.href = 'index.html';
            }
            //ローカルストレージにメモ情報をとうろくするとこ
            let list = localStorage.getItem('memolist');
            if (list === null) {
                list = [];
            } else {
                list = JSON.parse(list);
            }
            list.push({
                //ローカルストレージに保存する内容
                latitude: cpos_latitude,
                longitude: cpos_longitude,
                subject: subject.value,
                memo: memo.value,
                picture: board.toDataURL(),
                updated: new Date()
            });
            list = JSON.stringify(list);
            localStorage.setItem('memolist', list);
            location.href = 'index.html';
            }, false
        );

        cancel.addEventListener('click',
            function () {
            //キャンセルボタンクリックしたとき実行される
          
                location.href = 'index.html';
            }, false
        );
    
        let ondown = function(e) { 
          // タッチ開始／マウスダウン時の処理
          e.preventDefault();
          flag = true;
          if (e.touches) { e = e.touches[0]; }
          let c_rect = e.target.getBoundingClientRect();
          o_x = e.clientX - c_rect.left;
          o_y = e.clientY - c_rect.top;
        };

        let onup = function(e) {
          // タッチ終了／マウスアップ時の処理
          e.preventDefault();
          flag = false;
        };

        let onmove = function(e) {
          // タッチ移動中／マウス移動中の処理
          e.preventDefault();
          if (flag) {
            // マウスが押されている場合の描画処理
            if (e.touches) { e = e.touches[0]; }
            let c_rect = e.target.getBoundingClientRect();
            let x = e.clientX - c_rect.left;
            let y = e.clientY - c_rect.top;
            c.beginPath();
            c.moveTo(o_x, o_y);
            c.lineTo(x, y);
            c.stroke();
            o_x = x;
            o_y = y;
          }
        };

        if (window.ontouchstart === undefined) {
          // タッチイベントに対応していない場合の処理
          board.addEventListener('mousedown', ondown, false);
          board.addEventListener('mouseup',   onup,   false);
          board.addEventListener('mousemove', onmove, false);
        } else {
          // タッチイベントに対応している場合の処理
          board.addEventListener('touchstart',ondown, false);
          board.addEventListener('touchend',  onup,   false);
          board.addEventListener('touchmove', onmove, false);
        }
    
    }, false
);