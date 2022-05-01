let currentColor = 'black';
let canDraw = false;

var restore_array = [];
var index = -1;

let screen = document.querySelector('#tela');
let clear = document.querySelector('.clear');
let ctx = screen.getContext('2d');

// Events
document.querySelectorAll('.colorArea .color').forEach(item => {
    item.addEventListener('click', colorClickEvent);
});

screen.addEventListener("mouseout", function( ){
    canDraw = false;
});

screen.addEventListener('mousedown', mouseDownEvent);
screen.addEventListener('mousemove', mouseMoveEvent);
screen.addEventListener('mouseup', mouseUpEvent);

clear.addEventListener("click", clearScreen);

document.addEventListener('keydown', function(event) {
    if(event.ctrlKey && event.key === 'z') {
        cUndo();
    }
});

// Functions
function colorClickEvent(e){
    let color = e.target.getAttribute('data-color');
    currentColor = color;

    document.querySelector('.color.actived').classList.remove('actived');
    e.target.classList.add('actived');
}

function mouseDownEvent(e){
    canDraw = true;
    mouseX = e.pageX - screen.offsetLeft;
    mouseY = e.pageY - screen.offsetTop
}

function mouseMoveEvent(e){
    if(canDraw){
        draw(e.pageX, e.pageY);
        mouseX = e.pageX - screen.offsetLeft;
        mouseY = e.pageY - screen.offsetTop
    }
}

function mouseUpEvent(e){
    if(canDraw){
        draw(e.pageX, e.pageY);
        mouseX = 0;
        mouseY = 0;
        canDraw = false;
    }
    e.preventDefault();

    if(e.type != 'mouseout'){

        restore_array.push(ctx.getImageData(0, 0, screen.width, screen.height));
        index += 1;
    }
}

function draw(x,y){

    const range = document.querySelector('.range')

    let pointX = x - screen.offsetLeft;
    let pointY = y - screen.offsetTop;

    ctx.beginPath();
    ctx.lineWidth = range.value;
    ctx.lineJoin = "round";
    ctx.moveTo(mouseX, mouseY);
    ctx.lineTo(pointX, pointY);
    ctx.closePath();
    ctx.strokeStyle = currentColor;
    ctx.stroke();

    mouseX = pointX;
    mouseY = pointY;
}

function clearScreen(){
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);

    restore_array = [];
    index = -1;
}

function cUndo(){
    if(index <= 0){
        clearScreen();
    }
    else{
        index -= 1;
        restore_array.pop();
        ctx.putImageData(restore_array[index], 0, 0);
    }
}