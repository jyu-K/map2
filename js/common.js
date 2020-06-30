let h = function(str) {
    //h関数の日処理を定義
    if (str !==null) {
        str = str.toString();
        str = str.replace(/&/g, '&amp;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
    } else {
        //引数strが空である場合の処理
        str = '';
    }
    return str;
}