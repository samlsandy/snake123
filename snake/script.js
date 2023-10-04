document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.querySelector('.game-container');
    const snakeElement = document.getElementById('snake');
    const foodElement = document.getElementById('food');
    const badFoodElement = document.getElementById('bad-food');
    const goodFoodElement = document.getElementById('good-food');
    const scoreElement = document.getElementById('score');

    let snake = [{x: 10, y: 10}];
    let food = generateRandomPosition();
    let badFood = generateRandomPosition();
    let goodFood = generateRandomPosition();
    let direction = {x: 0, y: 0};
    let score = 0;

    function draw() {
        snakeElement.style.left = snake[0].x * 20 + 'px';
        snakeElement.style.top = snake[0].y * 20 + 'px';

        foodElement.style.left = food.x * 20 + 'px';
        foodElement.style.top = food.y * 20 + 'px';

        badFoodElement.style.left = badFood.x * 20 + 'px';
        badFoodElement.style.top = badFood.y * 20 + 'px';

        goodFoodElement.style.left = goodFood.x * 20 + 'px';
        goodFoodElement.style.top = goodFood.y * 20 + 'px';

        scoreElement.textContent = `Score: ${score}`;
    }

    function update() {
        const newHead = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

        // 檢查是否吃到食物
        if (newHead.x === food.x && newHead.y === food.y) {
            food = generateRandomPosition();
            // 分數加一
            score++;
        } else {
            snake.pop();
        }

        // 檢查是否碰到紅色物體
        if (newHead.x === badFood.x && newHead.y === badFood.y) {
            badFood = generateRandomPosition();
            // 分數減一
            score--;
        }

        // 檢查是否碰到紫色物體
        if (newHead.x === goodFood.x && newHead.y === goodFood.y) {
            goodFood = generateRandomPosition();
            // 分數加一
            score++;
        }

        // 檢查是否超出邊界，如果超出，讓蛇重新出現在對面的邊界
        if (newHead.x < 0) newHead.x = 19;
        if (newHead.x > 19) newHead.x = 0;
        if (newHead.y < 0) newHead.y = 19;
        if (newHead.y > 19) newHead.y = 0;

        snake.unshift(newHead);

        // 計算紅色和紫色物體的新位置
        badFood = moveAwayFromSnake(badFood);
        goodFood = moveTowardsSnake(goodFood);
    }

    function gameLoop() {
        update();
        draw();
        setTimeout(gameLoop, 100);
    }

    function generateRandomPosition() {
        let position = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
        while (isPositionOccupied(position)) {
            position = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
        }
        return position;
    }

    function isPositionOccupied(position) {
        return snake.some(segment => segment.x === position.x && segment.y === position.y);
    }

    function moveAwayFromSnake(position) {
        const distances = [];

        // 計算到蛇的每個部分的距離
        for (const segment of snake) {
            const distance = Math.sqrt(Math.pow(position.x - segment.x, 2) + Math.pow(position.y - segment.y, 2));
            distances.push(distance);
        }

        // 找到距離最遠的蛇的部分
        const maxDistanceIndex = distances.indexOf(Math.max(...distances));
        const maxDistanceSegment = snake[maxDistanceIndex];

        // 計算新位置，讓紅色物體遠離蛇
        const newX = position.x + (position.x - maxDistanceSegment.x);
        const newY = position.y + (position.y - maxDistanceSegment.y);

        return {x: newX, y: newY};
    }

    function moveTowardsSnake(position) {
        const distances = [];

        // 計算到蛇的每個部分的距離
        for (const segment of snake) {
            const distance = Math.sqrt(Math.pow(position.x - segment.x, 2) + Math.pow(position.y - segment.y, 2));
            distances.push(distance);
        }

        // 找到距離最近的蛇的部分
        const minDistanceIndex = distances.indexOf(Math.min(...distances));
        const minDistanceSegment = snake[minDistanceIndex];

        // 計算新位置，讓紫色物體靠近蛇
        const newX = position.x + (minDistanceSegment.x - position.x);
        const newY = position.y + (minDistanceSegment.y - position.y);

        return {x: newX, y: newY};
    }

    document.addEventListener('keydown', handleKeyDown);

    function handleKeyDown(event) {
        switch(event.key) {
            case 'ArrowUp':
                direction = {x: 0, y: -1};
                break;
            case 'ArrowDown':
                direction = {x: 0, y: 1};
                break;
            case 'ArrowLeft':
                direction = {x: -1, y: 0};
                break;
            case 'ArrowRight':
                direction = {x: 1, y: 0};
                break;
        }
    }

    gameLoop();
});
