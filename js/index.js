(function (root) {
    var map = root.maze.MAZE_21;
    var path = root.maze.solution(map, 1, 0);

    document.querySelector('.outer').appendChild(
        root.maze.render(map, path)
    );
})(this);
