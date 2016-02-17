(function (root) {
    var EMPTY = root.maze.EMPTY;
    var WALL = root.maze.WALL;
    var PATH = root.maze.PATH;
    var CURRENT = root.maze.CURRENT;

    var EXIT_COORD = null;
    var LAST_WAVE_NUM = 0;
    var PATH_TO_EXIT = [];

    var WAVE_GEN_FINISHED = false;
    var PATH_FIND_FINISHED = false;

    var NEXT_WAVE_POINTS;
    var PREV_WAVE_POINT;

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

    function isValidPrevWavePoint(maze, x, y, prevWaveNum) {
        return maze[y][x] == prevWaveNum;
    }

    function generateWave(maze, mazeWidth, mazeHeight, points, currentWavewNum) {
        NEXT_WAVE_POINTS = [];
        var nextWaveNum = currentWavewNum + 1;
        var nextWavePoints;
        points.forEach(function (point) {
            if (point.y == (maze.length - 1)) {
                WAVE_GEN_FINISHED = true;
                EXIT_COORD = [point.x, point.y];
                LAST_WAVE_NUM = currentWavewNum;
                return false;
            }
            nextWavePoints = getNextWavePoints(point, mazeWidth, mazeHeight);
            nextWavePoints.forEach(function (nextPoint) {
                if (isValidNextWavePoint(maze, nextPoint.x, nextPoint.y)) {
                    NEXT_WAVE_POINTS.push({
                        x: nextPoint.x,
                        y: nextPoint.y
                    });
                    maze[nextPoint.y][nextPoint.x] = nextWaveNum;
                }
            });
        });
        //currentWavewNum++;

        //document.querySelector('.outer').innerHTML = '';
        //document.querySelector('.outer').appendChild(
        //    root.maze.render_li(maze)
        //);

        //if (!isFinished) {
        //    setTimeout(function () {
        //        generateWave(maze, mazeWidth, mazeHeight, nextPoints, currentWavewNum);
        //    }, 100);
        //}
    }

    function findPrevWave(maze, mazeWidth, mazeHeight, currentPoint, prevWaveNum) {
        var nextWavePoints = getNextWavePoints(currentPoint, mazeWidth, mazeHeight);
        nextWavePoints.forEach(function (nextPoint) {
            if (isValidPrevWavePoint(maze, nextPoint.x, nextPoint.y, prevWaveNum)) {
                PREV_WAVE_POINT = {
                    x: nextPoint.x,
                    y: nextPoint.y
                };
                return false;
            }
        });
        return [PREV_WAVE_POINT.x, PREV_WAVE_POINT.y];
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

        /**
         * Ищем выход по волновому алгоритму
         */
        NEXT_WAVE_POINTS = [{x: x, y: y}];
        var startWaveNum = 1;
        var mazeHeight = (maze.length - 1);
        var mazeWidth = (maze[0].length - 1);
        maze[y][x] = 1;
        while (!WAVE_GEN_FINISHED) {
            generateWave(maze, mazeWidth, mazeHeight, NEXT_WAVE_POINTS, startWaveNum);
            startWaveNum++;
        }

        /**
         * Определяем путь до входа
         */
        PATH_TO_EXIT.push(EXIT_COORD);
        PREV_WAVE_POINT = {
            x: EXIT_COORD[0],
            y: EXIT_COORD[1]
        };
        while (!PATH_FIND_FINISHED) {
            PATH_TO_EXIT.push(findPrevWave(maze, mazeWidth, mazeHeight, PREV_WAVE_POINT, LAST_WAVE_NUM--));
            if (PREV_WAVE_POINT.x == x && PREV_WAVE_POINT.y == y) {
                PATH_FIND_FINISHED = true;
            }
        }

        return PATH_TO_EXIT.reverse();
    }

    root.maze.solution = solution;
})(this);
