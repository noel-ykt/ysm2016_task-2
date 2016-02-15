(function (root) {
    var EMPTY = root.maze.EMPTY;
    var WALL = root.maze.WALL;
    var PATH = root.maze.PATH;
    var CURRENT = root.maze.CURRENT;

    function getNextWavePoints(currentPoint, mazeWidth, mazeHeight) {
        var result = [];
        /**
         * Вычисляем точки по горизонтали
         */
        for (var x = ((currentPoint.x || 1) - 1); x <= (currentPoint.x < mazeWidth ? currentPoint.x + 1 : mazeWidth); x++) {
            result.push({
                x: x,
                y: currentPoint.y
            });
        }

        /**
         * Вычисляем точки по вертикали
         */
        for (var y = ((currentPoint.y || 1) - 1); y <= (currentPoint.y < mazeHeight ? currentPoint.y + 1 : mazeHeight); y++) {
            result.push({
                x: currentPoint.x,
                y: y
            });
        }
        return result;
    }

    function isValidNextWavePoint(maze, x, y) {
        var isNotWall = maze[y][x] != WALL;
        var isNotMe = maze[y][x] != CURRENT;
        var isEmpty = maze[y][x] == EMPTY;
        return isNotWall && isNotMe && isEmpty;
    }

    function analyzePoints(maze, mazeWidth, mazeHeight, points, currentWavewNum) {
        var isFinished = false;
        var nextPoints = [];
        var nextWaveNum = currentWavewNum + 1;
        var nextWavePoints;
        points.forEach(function (point) {
            if (point.y == (maze.length - 1)) {
                isFinished = true;
                //exitCoord = {
                //    x: point.x,
                //    y: point.y
                //};
                return false;
            }
            nextWavePoints = getNextWavePoints(point, mazeWidth, mazeHeight);
            nextWavePoints.forEach(function (nextPoint) {
                if (isValidNextWavePoint(maze, nextPoint.x, nextPoint.y)) {
                    nextPoints.push({
                        x: nextPoint.x,
                        y: nextPoint.y
                    });
                    maze[nextPoint.y][nextPoint.x] = nextWaveNum;
                }
            });
        });
        currentWavewNum++;

        document.querySelector('.outer').innerHTML = '';
        document.querySelector('.outer').appendChild(
            root.maze.render_li(maze)
        );

        if (!isFinished) {
            setTimeout(function () {
                analyzePoints(maze, mazeWidth, mazeHeight, nextPoints, currentWavewNum);
            }, 100);
        }
    }

    /**
     * Функция находит путь к выходу и возвращает найденный маршрут
     *
     * @param {number[][]} maze карта лабиринта представленная двумерной матрицей чисел
     * @param {number} x координата точки старта по оси X
     * @param {number} y координата точки старта по оси Y
     * @returns {[number, number][]} маршрут к выходу представленный списоком пар координат
     */
    function solution(maze, x, y) {
        var startPoints = [{x: x, y: y}];
        var startWave = 1;
        var mazeHeight = (maze.length - 1);
        var mazeWidth = (maze[0].length - 1);
        maze[y][x] = 1;

        analyzePoints(maze, mazeWidth, mazeHeight, startPoints, startWave);

        return [];
    }

    root.maze.solution = solution;
})(this);
