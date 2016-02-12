(function (root) {
    var EMPTY = root.maze.EMPTY;
    var WALL = root.maze.WALL;
    var PATH = root.maze.PATH;
    var CURRENT = root.maze.CURRENT;

    function checkSteps(nextCoords, maze, finishCoor, waveNum) {
        var isFinished = false;
        var isNotWall, isNotMe, isEmpty;
        var tmpNextSteps = [];
        nextCoords.forEach(function (step) {
            if (step.y == (maze.length - 1)) {
                isFinished = true;
                finishCoor = {
                    x: step.x,
                    y: step.y
                };
                return false;
            }
            for (var scanX = ((step.x || 1) - 1); scanX <= (step.x < (maze[0].length - 1) ? step.x + 1 : (maze[0].length - 1)); scanX++) {
                isNotWall = maze[step.y][scanX] != WALL;
                isNotMe = maze[step.y][scanX] != CURRENT;
                isEmpty = maze[step.y][scanX] <= 0;
                if (isNotWall && isNotMe && isEmpty) {
                    tmpNextSteps.push({
                        x: scanX,
                        y: step.y
                    });
                    maze[step.y][scanX] = waveNum + 1;
                }
            }
            for (var scanY = ((step.y || 1) - 1); scanY <= (step.y < (maze.length - 1) ? step.y + 1 : (maze.length - 1)); scanY++) {
                isNotWall = maze[scanY][step.x] != WALL;
                isNotMe = maze[scanY][step.x] != CURRENT;
                isEmpty = maze[scanY][step.x] <= 0;
                if (isNotWall && isNotMe && isEmpty) {
                    tmpNextSteps.push({
                        x: step.x,
                        y: scanY
                    });
                    maze[scanY][step.x] = waveNum + 1;
                }
            }
        });
        waveNum++;

        document.querySelector('.outer').innerHTML = '';
        document.querySelector('.outer').appendChild(
            root.maze.render_li(maze)
        );

        if (!isFinished) {
            setTimeout(function () {
                checkSteps(tmpNextSteps, maze, finishCoor, waveNum);
            }, 200);
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
        var startCoord = [{x: x, y: y}];
        var finishCoor = null;
        var startStep = 1;
        var mazeHeight = (maze.length - 1);
        var mazeWidth = (maze[0].length - 1);
        maze[y][x] = 1;

        checkSteps(startCoord, maze, finishCoor, startStep);

        return [];
    }

    root.maze.solution = solution;
})(this);
