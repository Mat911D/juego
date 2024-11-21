// Configuración básica del juego
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Cargar la imagen del personaje
const playerImage = new Image();
playerImage.src = 'valery.png'; // Reemplaza esto con la ruta de tu imagen

// Estado del juego
const gameState = {
  player: {
    x: 50,
    y: 500,
    width: 50,   // Ajusta este tamaño según las proporciones de tu imagen
    height: 50,  // Ajusta este tamaño según las proporciones de tu imagen
    speed: 5,
    dx: 0,
    dy: 0,
  },
  love: {
    x: 700,
    y: 100,
    width: 40,
    height: 40,
    color: 'pink',
  },
  controls: {
    up: { x: 50, y: 50, width: 100, height: 50 },
    down: { x: 50, y: 150, width: 100, height: 50 },
    left: { x: 50, y: 250, width: 50, height: 50 },
    right: { x: 150, y: 250, width: 50, height: 50 },
  },
  gameOver: false,
  loveFound: false,
};

// Función para detectar si el toque está dentro de un área
function isTouchingControl(touchX, touchY, control) {
  return (
    touchX > control.x && 
    touchX < control.x + control.width && 
    touchY > control.y && 
    touchY < control.y + control.height
  );
}

// Manejo de toques (para móviles)
canvas.addEventListener('touchstart', (e) => {
  const touchX = e.touches[0].clientX - canvas.offsetLeft;
  const touchY = e.touches[0].clientY - canvas.offsetTop;

  // Detectar cuál botón fue tocado
  if (isTouchingControl(touchX, touchY, gameState.controls.up)) {
    gameState.player.dy = -gameState.player.speed;
  } else if (isTouchingControl(touchX, touchY, gameState.controls.down)) {
    gameState.player.dy = gameState.player.speed;
  } else if (isTouchingControl(touchX, touchY, gameState.controls.left)) {
    gameState.player.dx = -gameState.player.speed;
  } else if (isTouchingControl(touchX, touchY, gameState.controls.right)) {
    gameState.player.dx = gameState.player.speed;
  }
});

// Detener el movimiento cuando se deja de tocar
canvas.addEventListener('touchend', () => {
  gameState.player.dx = 0;
  gameState.player.dy = 0;
});

// Función para mover al jugador
function movePlayer() {
  gameState.player.x += gameState.player.dx;
  gameState.player.y += gameState.player.dy;

  // Evitar que el jugador salga del canvas
  if (gameState.player.x < 0) gameState.player.x = 0;
  if (gameState.player.x > canvas.width - gameState.player.width) gameState.player.x = canvas.width - gameState.player.width;
  if (gameState.player.y < 0) gameState.player.y = 0;
  if (gameState.player.y > canvas.height - gameState.player.height) gameState.player.y = canvas.height - gameState.player.height;
}

// Función para dibujar los controles táctiles
function drawControls() {
  // Dibuja los botones de dirección (flechas)
  ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
  ctx.fillRect(gameState.controls.up.x, gameState.controls.up.y, gameState.controls.up.width, gameState.controls.up.height);
  ctx.fillRect(gameState.controls.down.x, gameState.controls.down.y, gameState.controls.down.width, gameState.controls.down.height);
  ctx.fillRect(gameState.controls.left.x, gameState.controls.left.y, gameState.controls.left.width, gameState.controls.left.height);
  ctx.fillRect(gameState.controls.right.x, gameState.controls.right.y, gameState.controls.right.width, gameState.controls.right.height);

  // Agregar texto en los botones (opcional)
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('↑', gameState.controls.up.x + 35, gameState.controls.up.y + 30);
  ctx.fillText('↓', gameState.controls.down.x + 35, gameState.controls.down.y + 30);
  ctx.fillText('←', gameState.controls.left.x + 15, gameState.controls.left.y + 30);
  ctx.fillText('→', gameState.controls.right.x + 15, gameState.controls.right.y + 30);
}

// Función para dibujar al jugador (con la imagen)
function drawPlayer() {
  ctx.drawImage(playerImage, gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);
}

function drawLove() {
  ctx.fillStyle = gameState.love.color;
  ctx.beginPath();
  ctx.arc(gameState.love.x, gameState.love.y, gameState.love.width, 0, Math.PI * 2);
  ctx.fill();
}

// Verificar si el jugador ha alcanzado el corazón
function checkCollision() {
  const playerX = gameState.player.x + gameState.player.width / 2;
  const playerY = gameState.player.y + gameState.player.height / 2;

  const loveX = gameState.love.x + gameState.love.width / 2;
  const loveY = gameState.love.y + gameState.love.height / 2;

  const distance = Math.sqrt((playerX - loveX) ** 2 + (playerY - loveY) ** 2);
  if (distance < (gameState.player.width / 2 + gameState.love.width / 2)) {
    gameState.loveFound = true;
    gameState.gameOver = true;
    displayMessage("¡Has encontrado el amor!");
  }
}

// Función para mostrar el mensaje final
function displayMessage(message) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText(message, canvas.width / 2 - ctx.measureText(message).width / 2, canvas.height / 2);
}

// Función principal del juego
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

  if (!gameState.gameOver) {
    movePlayer();
    drawPlayer();
    drawLove();
    drawControls();  // Dibujar los botones táctiles
    checkCollision();
  }
  
  // Si el jugador ha encontrado el amor, muestra el mensaje
  if (gameState.loveFound) {
    setTimeout(() => {
      displayMessage("¡Te amo mucho! <3");
    }, 1000);
  } else {
    requestAnimationFrame(gameLoop);
  }
}

// Iniciar el juego cuando la imagen esté completamente cargada
playerImage.onload = function () {
  gameLoop();
};
