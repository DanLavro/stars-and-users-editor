let radius = 80;
let starXCoord = 100;
let starYCoord = 100;
let vertex = 5;

const colors = ['red', 'blue', 'green', 'yellow', 'black'];

const container = document.getElementById('container');

const canvasOutputColor = document.createElement('canvas');
canvasOutputColor.width = 600;
canvasOutputColor.height = 50;
container.appendChild(canvasOutputColor);

const canvasWithStars = document.createElement('canvas');
canvasWithStars.width = 600;
canvasWithStars.height = 600;
canvasWithStars.style.border = '1px solid';
container.appendChild(canvasWithStars);

const ctx = canvasWithStars.getContext('2d');

const ctxOutputCanvas = canvasOutputColor.getContext('2d');

function drawStar(radius, starXCoord, starYCoord, n, color, innerRadius = 0.5) {
  ctx.beginPath();
  ctx.save();
  ctx.translate(starXCoord, starYCoord);
  ctx.moveTo(0, 0 - radius);

  for (let i = 0; i < n; i++) {
    ctx.rotate(Math.PI / n);
    ctx.lineTo(0, 0 - radius * innerRadius);
    ctx.rotate(Math.PI / n);
    ctx.lineTo(0, 0 - radius);
  }

  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
  ctx.closePath();
  ctx.stroke();
}

for (let i = 1; i <= 5; i++) {
  drawStar(radius, starXCoord * i, starYCoord * i, vertex, colors[i - 1]);
}

function fillOutputCanvas(color) {
  ctxOutputCanvas.fillStyle = color;
  ctxOutputCanvas.fillRect(
    0,
    0,
    canvasOutputColor.width,
    canvasOutputColor.height
  );
}

canvasWithStars.addEventListener('click', (event) => {
  let color = undefined;

  let x = event.offsetX;
  let y = event.offsetY;

  console.log(x, y);

  let data = ctx.getImageData(x, y, 1, 1).data;

  if (data[3] == 0) {
    color = 'white';
  } else {
    color = `rgb(${data[0]},${data[1]},${data[2]})`;
  }
  fillOutputCanvas(color);
});
