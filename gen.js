class Generation {

    arr = [];
    h; //縦セル数
    w; //横セル数
    n_th = 1; //第何世代か
    invariant="unknown"; //もう変化しないかどうか

    constructor(h, w) {
        this.h = h;
        this.w = w;
        
        for (let i = 0; i <= h + 1; i++) {
            this.arr[i] = [];

            for (let j = 0; j <= w + 1; j++) {
                this.arr[i][j] = 0;
            }
        }
        /*  for(let i=0; i<=h+1; i++){
              this.arr[i]=new Array(w+2).fill(0) }*/
    }


    toggle(x, y) {
        this.arr[x][y] = 1 - this.arr[x][y];
        this.invariant="unknown";
    }


    getGenView() {
        let viewArr = [];
        for (let i = 0; i < this.h; i++) {
            viewArr[i] = [];

            for (let j = 0; j < this.w; j++) {
                viewArr[i][j] = this.arr[i + 1][j + 1];
            }
        }
        return viewArr;
    }


    updateGen() {

        if(this.invariant==true){return;} //不変であることがわかっているなら何もしない

        //次世代のセルを格納する
        let nextArr = [];
        for (let i = 0; i <= this.h + 1; i++) {
            nextArr[i] = [];

            for (let j = 0; j <= this.w + 1; j++) {                
                nextArr[i][j] = 0;
            }
        }

        
        for (let i = 1; i <= this.h; i++) {
            for (let j = 1; j <= this.w; j++) { 

                //周囲の「生」の総数
                let dense = this.arr[i + 1][j + 1] + this.arr[i + 1][j] + this.arr[i + 1][j - 1]
                          + this.arr[i][j + 1]                          + this.arr[i][j - 1]
                          + this.arr[i - 1][j + 1] + this.arr[i - 1][j] + this.arr[i - 1][j - 1];

                if ((this.arr[i][j] == 1 && dense == 2) || dense == 3) {

                    nextArr[i][j] = 1;

                    if(this.arr[i][j]==0){ 
                        this.invariant=false; 
                    }
                } else {
                    nextArr[i][j] = 0;

                    if(this.arr[i][j]==1){ 
                        this.invariant=false; 
                    }
                }
            }
        }

        if(this.invariant=="unknown"){ 

            this.invariant=true; //どのセルも変化しないということなので

        }else if(this.invariant==false){

            this.arr = nextArr;
            this.n_th ++;
            this.invariant="unknown";
        }
    }
}

