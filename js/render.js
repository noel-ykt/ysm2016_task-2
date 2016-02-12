(function (root) {
    var EMPTY = root.maze.EMPTY;
    var WALL = root.maze.WALL;
    var PATH = root.maze.PATH;
    var CURRENT = root.maze.CURRENT;

    /**
     * Создает HTML элемент заданного типа с заданным CSS классом
     *
     * @param {string} type тип создаваемого HTML элемента
     * @param {string} className CSS класс
     * @param {undefined} val
     * @returns {HTMLElement} HTML элемент
     */
    function element(type, className, val) {
        var elem = document.createElement(type);
        elem.className = className;
        if (val) {
            elem.innerText = val;
        }
        return elem;
    }

    /**
     * Создает визуализацию лабиринта по его схеме с возможностью наложения маршрута
     *
     * @param {number[][]} maze схема лабиринта
     * @param {[number, number][]} [path] маршрут
     * @returns {HTMLElement} HTML элемент
     */
    function render(maze, path) {
        if (path && path.length) {
            var point, 
                i;

            for (i = 0; i < path.length; i++) {
                point = path[i];
                maze[point[1]][point[0]] = PATH;
            }
            point = path[path.length - 1];
            maze[point[1]][point[0]] = CURRENT;
        }

        var containerElem = element('div', 'maze'),
            rowElem,
            type,
            row, 
            cell,
            x, 
            y;

        for (y = 0; y < maze.length; y++) {
            row = maze[y];
            rowElem = element('div', 'maze__row');

            for (x = 0; x < row.length; x++) {
                cell = row[x];

                switch (cell) {
                    case WALL:
                        type = 'wall';
                        break;

                    case PATH:
                        type = 'path';
                        break;

                    case CURRENT:
                        type = 'current';
                        break;

                    default:
                        type = undefined;
                }

                rowElem.appendChild(
                    element('div', 'maze__cell' + (type ? ' maze__cell_' + type : ''))
                );
            }

            containerElem.appendChild(rowElem);
        }

        return containerElem;
    }

    function render_li(maze) {
        var containerElem = element('div', 'maze'),
            rowElem,
            cellElem,
            type,
            row,
            cell,
            x,
            y;

        for (y = 0; y < maze.length; y++) {
            row = maze[y];
            rowElem = element('div', 'maze__row');

            for (x = 0; x < row.length; x++) {
                cell = row[x];

                switch (cell) {
                    case WALL:
                        type = 'wall';
                        break;

                    default:
                        type = undefined;
                }

                cellElem = element('div', 'maze__cell' + (type ? ' maze__cell_' + type : ''));
                if (cell > 0) {
                    cellElem.style.backgroundColor = 'hsl(' + cell + ', 56%, 40%)';
                }
                cellElem.appendChild(
                    element('span', 'maze__cell__inner', cell != -1 ? cell : undefined)
                );
                rowElem.appendChild(
                    cellElem
                );
            }

            containerElem.appendChild(rowElem);
        }

        return containerElem;
    }

    root.maze.render = render;
    root.maze.render_li = render_li;
})(this);
