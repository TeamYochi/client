<template>
    <div>
            <div>
                <div>
                    <div>
                    <div class="container">
                        <div class="canvas-wrapper">
                            <video id="video" playsinline style="
                            -webkit-transform: scaleX(-1);
                            transform: scaleX(-1);
                            visibility: hidden;
                            width: auto;
                            height: auto;
                            ">
                            </video>
                            <canvas id="output"></canvas>
                            <canvas id="e_canvas"></canvas>
                        </div>
                        <div id="scatter-gl-container"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
    // import Object1 from '../components/movenet/object1.vue';
    import MoveNet from '../components/js/movenet';
 
    export default {
        data() {
            e_canvas: "";
            e_ctx: "";
            // components: Object1
        },
        mounted() {
            this.getMovenet();
        },
        methods: {
            async getMovenet() {
                // 추가(전체)
                // 시작 전 위치 확인(안정된 위치에서 시작하게)
                // 뜰 때 안 겹치게 하기
                
                let clear = false;
                this.e_canvas = document.getElementById("e_canvas");
                this.e_ctx = e_canvas.getContext("2d");

                /**
                 * @description 랜덤으로 길이에 해당하는 스트링을 생성해주는 함수
                 * @param {number} num 랜덤 스트링 길이
                 * @returns {string} 랜덤스트링
                 */
                const generateRandomString = (num) => {
                        const characters =
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                        let result = "";
                        const charactersLength = characters.length;
                        for (let i = 0; i < num; i++) {
                        result += characters.charAt(
                            Math.floor(Math.random() * charactersLength)
                        );
                    }

                    return result;
                };

                /**
                 * @description 사각형 그리는 함수
                 * @param {CanvasRenderingContext2D} ctx canvas의 2D CONTEXT
                 * @param {number} x 렌더링될 x좌표
                 * @param {number} y 렌더링될 y좌표
                 */
                
                // const i = Math.floor((Math.random() * 5) + 1);

                function checkLine(ctx, width, height) {
                    ctx.beginPath();
                    ctx.moveTo(0, 50);
                    ctx.lineTo(width, 50);

                    ctx.moveTo(0, height-20);
                    ctx.lineTo(width, height-20);

                    ctx.strokeStyle = 'blue';
                    ctx.linewidth = 1;
                    ctx.stroke();

                    const human = new Image();
                    human.src = `/img/human3.png`;
                    ctx.drawImage(human, width/4, 0, width/2, height-10);
                }

                function showPoint(ctx, point, width) {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(width/2-200, 10, 400, 160);

                    ctx.fillStyle = 'green';
                    ctx.font = 'normal 700 120px serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('はる', width/2-100, 100, 120);


                    ctx.fillStyle = 'black';
                    ctx.font = 'normal 800 120px serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(`${point}`, width/2+100, 100, 120);
                }

                function drawImg(ctx,x, y,i) {
                    const img = new Image();
                    img.src = `/img/Sakura${i}.png`;
                    ctx.drawImage(img, x, y, 200, 200);
                }

                function checkTouch(target, object, width) {
                    // return true;
                    return width-target.x > object.x_coor-160 && width-target.x < object.x_coor + 160 && target.y > object.y_coor-160 && target.y < object.y_coor + 160
                }


                /**
                 * @description 캔버스상에 그리기 함수를 모아놓고 한번에 실행해 애니메이션을 만드는 함수
                 * @param {CanvasRenderingContext2D} ctx canvas의 2D CONTEXT
                 * @param {number} speed 사각형 내려오는거 속도
                 */
                function drawRain(ctx, speed, width, height) {
                    let rightCount = 0;
                    let point = 0;
                    // 객체
                    const coordObj1 = {} // 좌표 top_left : {x_coor, y_coor} top_right : {x_coor+width, y_coor} bottom_left : {x_coor, y_coor+height} bottom_right : {x_coor+width, y_coor+height}
                    e_canvas.width = width;
                    e_canvas.height = height;

                    // 1초마다 객체 생성코드
                    setInterval(() => {
                        coordObj1[generateRandomString(10)] = {
                            x_coor: Math.random() * (e_canvas.width - 180), // 640 : canvas width , 20 : rect width
                            y_coor: 20,
                            idx : Math.floor((Math.random() * 7) + 1)
                        }
                    }, [3000])
                    
                    const render = (coordArr) => {
                        
                        checkLine(ctx, e_canvas.width, e_canvas.height);
                        // console.log(coordArr);
                        setTimeout(() => {
                            for(let i = 0; i < 17; i++) {
                                if(coordArr[i].y > 50 && coordArr[16].y < e_canvas.height-20) {
                                    rightCount++;
                                }
                            }
                            if(rightCount === 17) {
                                clear = true;
                            }
                            rightCount = 0;
                        }, 5000);
                        // 만들어진 객체 키를 이용해 사각형을 그리는 함수
                        if(clear) {
                            ctx.clearRect(0, 0, e_canvas.width, e_canvas.height);
                            showPoint(ctx, point, e_canvas.width);
                        Array.from(Object.keys(coordObj1)).forEach((el) => {
                            const { x_coor, y_coor,idx } = coordObj1[el];
                            var tempKey = undefined;

                            coordArr.forEach((coord) => {
                                if (checkTouch(coord, coordObj1[el], e_canvas.width)) {
                                    tempKey = el
                                }
                            });

                            // console.log(tempKey)


                            if (tempKey || y_coor > e_canvas.height) {
                                if(coordObj1[el].idx <= 5) {
                                    point += 20;
                                } else {
                                    point -= 10;
                                }
                                delete coordObj1[el]
                                return;
                            }

                                drawImg(ctx, x_coor, y_coor,idx)
                                //스피드에 따라 대충 속도변환
                                coordObj1[el].y_coor = y_coor + speed
                                
                                // console.log(coordObj)
                                
                            })
                        }
                            // console.log(coordObj1)
                        // console.log(movenet.coordArr.length)

                        // movenet.coordArr = []

                        // console.log(coordObj)

                        // window.requestAnimationFrame(render);
                    }
                    const movenet = new MoveNet(render);

                    // window.requestAnimationFrame(render);
                }

                function drawRand(ctx, width, height) {
                    let rightCount = 0;
                    let point = 0;

                    // 객체
                    const coordObj2 = {} // 좌표 top_left : {x_coor, y_coor} top_right : {x_coor+width, y_coor} bottom_left : {x_coor, y_coor+height} bottom_right : {x_coor+width, y_coor+height}
                    e_canvas.width = width;
                    e_canvas.height = height;

                    // 1초마다 객체 생성코드
                    setInterval(() => {
                        coordObj2[generateRandomString(10)] = {
                            x_coor: Math.random() * (e_canvas.width - 120), // 640 : canvas width , 20 : rect width
                            y_coor: Math.random() * (e_canvas.height - 120),
                            idx : Math.floor((Math.random() * 7) + 1)
                        }
                    }, [5000])

                    const render = (coordArr) => {
                        checkLine(ctx, e_canvas.width, e_canvas.height);
                        
                        setTimeout(() => {
                            for(let i = 0; i < 17; i++) {
                                if(coordArr[i].y > 50 && coordArr[16].y < e_canvas.height-20) {
                                    rightCount++;
                                }
                            }
                            if(rightCount === 17) {
                                clear = true;
                            }
                            rightCount = 0;
                        }, 5000);
                        
                        if(clear) {
                            ctx.clearRect(0, 0, e_canvas.width, e_canvas.height);
                            showPoint(ctx, point, e_canvas.width);
                            // 만들어진 객체 키를 이용해 사각형을 그리는 함수
                            Array.from(Object.keys(coordObj2)).forEach((el) => {
                                const { x_coor, y_coor, idx } = coordObj2[el];
                                var tempKey = undefined;
    
                                coordArr.forEach((coord) => {
                                    // console.log(idx)
                                    if (checkTouch(coord, coordObj2[el], e_canvas.width)) {
                                        tempKey = el
                                    }
                                });
    
                                if (tempKey) {
                                    console.log("tempKey", tempKey)
                                    if(coordObj2[el].idx <= 5) {
                                        point += 20;
                                    } else {
                                        point -= 10;
                                    }
                                    delete coordObj2[el]
                                    return;
                                }
                                setInterval(() => {
                                    if(!tempKey) {
                                        delete coordObj2[el]
                                        return;
                                    }
                                }, 8000)
                                if(coordObj2.length == 0) {
                                    const makeRand = () => {
                                        coordObj2[generateRandomString(10)] = {
                                            x_coor: Math.random() * (e_canvas.width - 120), // 640 : canvas width , 20 : rect width
                                            y_coor: Math.random() * (e_canvas.height - 120),
                                            idx : Math.floor((Math.random() * 5) + 1)
                                        }
                                    }
                                }
    
                                drawImg(ctx, x_coor, y_coor, idx)
                                //스피드에 따라 대충 속도변환
                                // coordObj[el].y_coor = y_coor + speed
    
                                // console.log(coordObj)
                                
                                // 추가(랜덤)
                                // 서있는 자세 확인해서 몸에 안 생기게 하기
                                // 일정 시간 지나도 안 터진 상자 자동으로 터지기
                            })
                        }
                        // console.log(movenet.coordArr.length)

                        // movenet.coordArr = []

                        // console.log(coordObj)

                        // window.requestAnimationFrame(render);
                    }
                    const movenet = new MoveNet(render);

                    // window.requestAnimationFrame(render);
                    }

                if(this.$route.name === 'movenetRain') {
                    drawRain(this.e_ctx, 1.2, this.e_canvas.width, this.e_canvas.height);
                } else if(this.$route.name === 'movenetRand') {
                    drawRand(this.e_ctx, this.e_canvas.width, this.e_canvas.height);
                }
            }
        }
    }
</script>

<style>
    .container {
        margin: auto;
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;    
    }
    .canvas-wrapper, #output, #video, #e_canvas {
        position: absolute;
        margin: 0;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;
    }
    .canvas-wrapper {
        z-index: 10;
    }
    /* @media(max-width: ;) {
        
    } */
</style>