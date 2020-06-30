window.addEventListener('DOMContentLoaded',
    function () {
        //ページ本体が読み込まれた時点で実行する
        let w_id;
        let result = document.getElementById('result');
        let stopwatch = document.getElementById('stopwatch');
    
        stopwatch.addEventListener('click',
            function(e) {
                navigator.geolocation.clearWatch(w_id);
            },false
        );
    
        if (navigator.geolocation) {
            //現在位置を取得するコード
            w_id = navigator.geolocation.watchPosition(
                function(pos){
                    //位置情報の取得に成功したときの処理
                    msg = `緯度： ${pos.coords.latitude}<br />
                           経度： ${pos.coords.longitude}<br />
                           方位： ${pos.coords.heading}`;
                    result.innerHTML = msg;
                },
                function(err) {
                    let msgs = [
                        '',
                        'Geolocationの利用が許可されてないよ',
                        '位置情報を取得できんよ',
                        '位置情報とりようときタイムアウトしたばい'
                    ];
                    result.textContent = msgs[err.code];
                },
                {
                    //位置情報取得のためのオプション
                    timeout : 7000,
                    maximumAge : 500,
                    enableHighAccuracy : false
                }
            );
                
        } else {
            window.alert('Geolocation APIに対応しているブラウザーでアクセスしてくれよな！');
        }
        
    },false
);