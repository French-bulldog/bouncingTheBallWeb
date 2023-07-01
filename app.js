// 背景替換funtcion
let init = 0;
function changeBackground() {
    background = document.querySelector('.background');
    if (init == 0) {
        background.style.backgroundImage = "url('https://images.pexels.com/photos/3490963/pexels-photo-3490963.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')";
        init = 1;
    }
    else if (init == 1) {
        background.style.backgroundImage = "url('https://images.pexels.com/photos/3262554/pexels-photo-3262554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')";
        init = 2;
    }
    else {
        background.style.backgroundImage = "url('https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')";
        init = 0;
    }
}
setInterval(changeBackground, 2000);

// ---------------------------------------------------------------------------------

// 彈跳球funtcion
const c = document.getElementById("Canvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");

// 球初始設定
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;

// 板子初始設定
let board_x = 100;
let board_y = 550;
let board_height = 5;
let board_width = 200;
c.addEventListener("mousemove", function (e) {
    board_x = e.clientX - 200;
})

// 磚塊初始設定
let touchCount = 0;
let RockArray = [];
// 產出 min ~ max 區間值
function getRandom(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}
class Rock {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        RockArray.push(this);
        this.visable = true;
    }

    drawRock() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    touchOtherBall(ballX, ballY) {
        return (
            ballX >= this.x - radius &&
            ballX <= this.x + this.width + radius &&
            ballY <= this.y + this.height + radius &&
            ballY >= this.y - radius
        );
    }
}


// 產出所有磚塊物件
for (let i = 0; i < 10; i++) {
    new Rock(getRandom(0, 950), getRandom(0, 500));
}

function drawCircle() {
    // 檢查球碰到磚塊
    RockArray.forEach((rock, index) => {
        if (rock.visable && rock.touchOtherBall(circle_x, circle_y)) {
            touchCount++;
            rock.visable = false;
            // 改變 X,Y方向速度，並將rock從RockArray中刪除
            // 從下方撞擊
            if (circle_y >= rock.y + rock.height) {
                ySpeed *= -1;
            }
            // 從上方撞擊
            else if ((circle_y <= rock.y)) {
                ySpeed *= -1;
            }
            // 從左方撞擊
            else if (circle_x <= rock.x) {
                xSpeed *= -1;
            }
            // 從右方撞擊
            else if (circle_x >= rock.x + rock.width) {
                xSpeed *= -1;
            }

            // RockArray.splice(RockArray.indexOf(rock), 1);
            // if (RockArray.length == 0) {
            //     alert("恭喜你破關，按下確定可重新遊玩");
            //     location.reload();
            // }

            // 改善效能 O(n)
            if (touchCount == 10) {
                alert("恭喜你破關，按下確定可重新遊玩");
                location.reload();
            }
        }
    });


    // 檢查球碰到地板反彈
    if (circle_x >= board_x + -radius &&
        circle_x <= board_x + 200 + radius &&
        circle_y >= board_y + -radius) {
        ySpeed *= -1;
        circle_y -= 40;
    }

    // 檢查球是否觸及畫布邊緣
    // 左右邊界
    if (circle_x >= canvasWidth - radius || circle_x <= radius) {
        xSpeed *= -1;
    }
    // 上下邊界
    if (circle_y >= canvasHeight - radius || circle_y <= radius) {
        ySpeed *= -1;
    }

    // 判斷沒接到球
    if (circle_y + radius == canvasHeight) {
        alert("沒接到球Game Over，按下確定重新遊玩");
        location.reload();
    }

    // 更動圓座標
    circle_x += xSpeed; // 更新水平位置
    circle_y += ySpeed; // 更新垂直位置

    // 每次畫之前先更新背景
    ctx.fillStyle = "aqua";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);  //fillRect 畫方形 (x,y,w,h)

    // 劃出全部磚塊
    RockArray.forEach(rock => {
        if (rock.visable)
            rock.drawRock()
    });

    // 劃出板子
    ctx.fillStyle = "black";
    ctx.fillRect(board_x, board_y, board_width, board_height);

    // 劃出圓球  
    // arc(x, y = 圓中心點, radius = 半徑, startAngle = 初始角度, endAngle = 最後角度)
    // 2 pi = 360度
    ctx.beginPath(); //不斷清除子路徑;
    ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
    ctx.stroke();   //球外框
    ctx.fillStyle = "yellow";
    ctx.fill();     //填滿球實心
}

let game = setInterval(drawCircle, 25);