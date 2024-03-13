
$(() => {

    //セル描画関数
    function drawTable(r, c) {

        $("#tbody").empty();

        for (let i = 0; i < r; i++) {

            let tr = $("<tr>");
            $("#tbody").append(tr);

            for (let j = 0; j < c; j++) {  //セルは0から数える
                let td = $("<td>");

                td.data("row", i);
                td.data("col", j);

                tr.append(td);
            }
        }
    }


    //画面更新
    //FireFoxだと画面を更新してもセルの数はそのままのようだ
    let r = $("#rows").val();
    let c = $("#cols").val();

    drawTable(r, c);
    let gen = new Generation(r, c);


    //サイズを反映ボタン
    $("#form").on("submit", (event) => {

        sizeChange();
        event.preventDefault();        //ページ更新拒否
    });

    function sizeChange() {
        let r = Number($("#rows").val());
        let c = Number($("#cols").val());

        //1~99の整数のみ受け付ける
        if (Number.isInteger(r) && Number.isInteger(c) && 0 < r && r < 100 && 0 < c && c < 100) {

            $("#container").css("width", Math.max(c * 15.3, 950)); //コンテナのサイズ調整

            drawTable(r, c);
            gen = new Generation(r, c);

            $("#n_th").text("第1世代");

            $("td").on("click", on_off);
        }
    };


    //セルをクリックする
    $("td").click(on_off);

    function on_off() {
        let x = Number($(this).data("row"));
        let y = Number($(this).data("col"));

        gen.toggle(x + 1, y + 1);
        draw();
    }

    function draw() {
        $("td").each(callBack_draw);
    }

    function callBack_draw() {
        let x = Number($(this).data("row"));
        let y = Number($(this).data("col"));

        if (gen.getGenView()[x][y] == 1) {

            $(this).attr("class", "on"); //「生」状態のレイアウト
        }
        else {
            $(this).removeAttr("class");
        }
    }


    /*塗りつぶし操作(不具合)
    $("td").on("mousedown",()=>{
        $("td").on("mouseenter",on_off);

        $("body").on("mouseup",()=>{
            $("td").off("mouseenter");
        });
    });*/

    /*塗りつぶし操作*/
    $("td").on("mousedown", (ev) => {
        console.log(ev);
        $("td").on("mouseenter", on_off);

    });
    //bodyへのmouseupイベントは外に出し、登録を1回のみにしました。
    //どんな場合でもbody内でmouseupしたら、tdのmouseenterを消しますが、それで問題ないはずです。
    $("body").on("mouseup", (ev) => {
        console.log(ev)
        $("td").off("mouseenter");
    });
    //dragstartイベント登録
    $("td").on("dragstart", (ev) => {
        console.log(ev);
        ev.stopImmediatePropagation();    //td要素に対する、他のあらゆるdragstartイベントへの伝播を止めます。
        ev.preventDefault();    //td要素の既定dragstart動作を止めます。
    });


    //+10ボタンおよび+50ボタン
    //無名関数を使って記述するとなぜかthisに要素が入らなくてうまくいかない。

    $(".plus10or50").on("click", callback1050);

    function callback1050() {

        for (let i = 0; i < $(this).attr("value"); i++) {

            let x = Math.floor(gen.h * Math.random());
            let y = Math.floor(gen.w * Math.random());

            gen.toggle(x + 1, y + 1);
        }
        draw();
    };



    //次の世代>ボタン
    $("#next").on("click", () => {
        gen.updateGen();
        $("#n_th").text(`第${gen.n_th}世代`);
        draw();
    });



    let timer; //setIntervalを停止する用

    //ライフゲーム開始ボタン
    $("#start").on("click", () => {

        $("#stop").prop("disabled", "");
        $("#submit, #start, #next, .plus10or50").prop("disabled", "disabled");

        $("td").off("click");

        let interval = $("#select").val();  //実行間隔

        timer = setInterval(() => {
            gen.updateGen();

            //もう変わらない場合は停止させる。
            if (gen.invariant == true) {

                clearInterval(timer)

                $("#submit, #start, #next, .plus10or50").prop("disabled", "");
                $("#stop").prop("disabled", "disabled");

                $("td").on("click", on_off);
            };

            $("#n_th").text(`第${gen.n_th}世代`);

            draw();

        }, interval);
    });



    //停止ボタン
    $("#stop").on("click", () => {
        clearInterval(timer);

        $("#submit, #start, #next, .plus10or50").prop("disabled", "");
        $("#stop").prop("disabled", "disabled");

        $("td").on("click", on_off);
    })
    //セルやボタンのクリックについて、フラグを使うとは？

});

