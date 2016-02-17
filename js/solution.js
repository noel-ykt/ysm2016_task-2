(function (root) {
    var EMPTY = root.maze.EMPTY;
    var WALL = root.maze.WALL;
    var PATH = root.maze.PATH;
    var CURRENT = root.maze.CURRENT;

    var EXIT_COORD = null;
    var END_WAVE_NUM = 0;
    var PATH_TO_EXIT = [];

    var WAVE_GEN_FINISHED = false;
    var PATH_FIND_FINISHED = false;

    var NEXT_WAVE_POINTS;
    var CURRENT_WAVE_POINT;

    function getNearbyWavePoints(currentPoint, mazeWidth, mazeHeight) {
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

    function generateWave(maze, mazeWidth, mazeHeight, points, currentWavewNum) {
        NEXT_WAVE_POINTS = [];
        var nextWaveNum = currentWavewNum + 1;
        var nextWavePoints;
        points.forEach(function (point) {
            if (point.y == (maze.length - 1)) {
                WAVE_GEN_FINISHED = true;
                EXIT_COORD = [point.x, point.y];
                END_WAVE_NUM = currentWavewNum;
                return false;
            }
            nextWavePoints = getNearbyWavePoints(point, mazeWidth, mazeHeight);
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
        var waveNum;
        var nextWavePoints = getNearbyWavePoints(currentPoint, mazeWidth, mazeHeight);
        nextWavePoints.forEach(function (nextPoint) {
            waveNum = maze[nextPoint.y][nextPoint.x];
            if (waveNum == prevWaveNum) {
                CURRENT_WAVE_POINT = {
                    x: nextPoint.x,
                    y: nextPoint.y
                };
                return false;
            }
        });
        return [CURRENT_WAVE_POINT.x, CURRENT_WAVE_POINT.y];
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
        var mazeHeight = (maze.length - 1);
        var mazeWidth = (maze[0].length - 1);

        /**
         * Ищем выход по волновому алгоритму
         */
        NEXT_WAVE_POINTS = [{x: x, y: y}];
        var waveNum = 1;
        maze[y][x] = waveNum;
        while (!WAVE_GEN_FINISHED) {
            generateWave(maze, mazeWidth, mazeHeight, NEXT_WAVE_POINTS, waveNum);
            waveNum++;
        }
        NEXT_WAVE_POINTS = null;

        /**
         * Определяем путь до входа
         */
        PATH_TO_EXIT.push(EXIT_COORD);
        CURRENT_WAVE_POINT = {
            x: EXIT_COORD[0],
            y: EXIT_COORD[1]
        };
        while (!PATH_FIND_FINISHED) {
            PATH_TO_EXIT.push(findPrevWave(maze, mazeWidth, mazeHeight, CURRENT_WAVE_POINT, END_WAVE_NUM--));
            if (CURRENT_WAVE_POINT.x == x && CURRENT_WAVE_POINT.y == y) {
                PATH_FIND_FINISHED = true;
            }
        }
        CURRENT_WAVE_POINT = null;

        return PATH_TO_EXIT.reverse();
    }

    root.maze.solution = solution;
})(this);
