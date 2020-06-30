window.addEventListener('DOMContentLoaded',
    function () {
        //ページ本体が読み込まれた時点で実行する
        let w_id, gmap, c_point;
        let m_list = new google.maps.MVCArray();
        let result = document.getElementById('result');
        let stopwatch = document.getElementById('stopwatch');
        let showcurrent = document.getElementById('showcurrent');
        
        let removemarker = function(){
            m_list.forEach(function(marker, index) {marker.setMap(null); });
        };
    
        let showmap = function(e){
            removemarker();
        //メモタイトルをタップした場合の処理を定義
        let id = e.target.dataset.id;
        let list = localStorage.getItem('memolist');
            if (list !== null) {
                //メモ情報が存在する処理を定義
                list = JSON.parse(list);
                let item = list[id];
                let point = new google.maps.LatLng(
                    item.latitude, item.longitude);
                let marker = new google.maps.Marker({
                    //マーカーの基本情報を定義
                    map: gmap,
                    position: point
                });
                let msg = `<strong>${h(item.subject)}</strong><br />${h(item.memo)}`;
                if (item.picture){
                    msg += `<br /><img src="${h(item.picture)}" width="100" height="100" />`;
                }
                let info = new google.maps.InfoWindow({
                    //メッセージウィンドウの基本情報を定義
                    content: msg
                });
                google.maps.event.addListener(marker, 'click',
                    function() {
                    //マーカータップの挙動かくとこ
                    info.open(gmap, marker);
                });
                gmap.setCenter(point);
                m_list.push(marker);
            }
        };
    
        let removememo = function(e) {
            removemarker();
            //メモリストから対象のメモを削除するコード
            let id = e.target.dataset.id;
            let list = JSON.parse(localStorage.getItem('memolist'));
            list = list.filter(function(memo, c_index, ary) {
                //削除対象のメモを除去
                return id !== c_index.toString();
            });
            localStorage.setItem('memolist', JSON.stringify(list));
            showmemo();
        };
        
    
        let showmemo = function(){
            //ローカルストレージからデータを取得するコード
            let msg = '';
            let list = localStorage.getItem('memolist');
            if (list !== null) {
                //ローカルストレージからmemolistをっ取得できた場合の処理
                list = JSON.parse(list);
                for (let i = 0; i < list.length; i++){
                    //リストを表すタグを組み立て
                    msg += `<li>
                        <a href="#" class="show" data-id="${h(i)}">
                        ${h(list[i].subject)}
                        </a>
                        <a class="del" href="#" data-id="${h(i)}">×</a>
                        </li>`;
                }
                let r_list = document.getElementById('list');
                r_list.innerHTML = msg;
                let subjects = document.querySelectorAll('#list a.show');
                for (let subject of subjects) {
                    subject.addEventListener('click', showmap, false);
                }
                let deletes = document.querySelectorAll('#list a.del');
                for(let del of deletes) {
                    del.addEventListener('click', removememo, false);
                }
            }
        };
        
        stopwatch.addEventListener('click',
            function(e) {
                navigator.geolocation.clearWatch(w_id);
            }, false
        );
        
        showcurrent.addEventListener('click',
            function(e) {
                removemarker();
                gmap.setCenter(c_point);
            }, false
        );
    
        if (navigator.geolocation) {
            //現在位置を取得するコード
            w_id = navigator.geolocation.watchPosition(
                function(pos){
                    //位置情報の取得に成功したときの処理
                    c_point = new google.maps.LatLng(
                    pos.coords.latitude, pos.coords.longitude);
                    gmap = new google.maps.Map(
                        result,
                    {
                        zoom: 14,
                        center: c_point,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                );
                sessionStorage.setItem(
                    'cpos_latitude', pos.coords.latitude);
                sessionStorage.setItem(
                    'cpos_longitude', pos.coords.longitude);
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
        showmemo();
    }, false
);