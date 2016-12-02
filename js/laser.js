var Laser = (function() {
    var mirrorStyle = {
        NULL: 0,
        NORMAL: 1,
        TRIANGLE: 2
    }

    var dirType = {
        UP_RIGHT: 0,
        UP: 1,
        UP_LEFT: 2,
        LEFT: 3,
        DOWN_LEFT: 4,
        DOWN: 5,
        DOWN_RIGHT: 6,
        RIGHT: 7,
    }

    var mirrorType = {  // Where the mirror are pointing
        NORMAL: {
            UP_RIGHT: 1,
            RIGHT: 2,
            DOWN_RIGHT: 3,
            DOWN: 4,
            DOWN_LEFT: 5,
            LEFT: 6,
            UP_LEFT: 7,
            UP: 8
        },
        TRIANGLE: {
            UP_RIGHT: 1,
            DOWN_RIGHT: 2,
            DOWN_LEFT: 3,
            UP_LEFT: 4
        }
    }

    var direction = dirType.UP,
        startDirection = dirType.UP,
        startPosition = [0, 0],
        currentPosition = [0, 0],
        nextPosition = [[-3, -3], [-3, -3]],
        gridSize = [0, 0],
        tileSize = [0, 0],
        tiles = [],
        objects = {},
        color = "#F00",
        width = 5,
        utils = Utils,
        lampsCount = -1,
        poweredLamps = [],
        levelComplete = false,
        levelLosed = false,
        movements = [];  // [direction, x, y]

    var context = document.getElementById("board-canvas").getContext("2d");

    function draw() {
        direction = startDirection;
        poweredLamps = [];
        movements = getNextMovement(startDirection, startPosition[0], startPosition[1]);

        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = width;
        context.lineCap = "round";

        drawFirstLine();

        while (true) {
            if (movements == [[-3, -3]]) {
                break;
            }

            var x = movements[0][1],
                y = movements[0][2];

            movements[0] = getNextMovement(movements[0][0], movements[0][1], movements[0][2])[0];

            //for (var i=0; i < data.length; i++) {
            if (!inScreen(movements[0][1], movements[0][2])) {
                break;
            }

            drawLine(x, y, movements[0][1], movements[0][2]);
            //}


            //nextMovementIsPosible();
            /*if (nextPosible) {
                drawLine(currentPosition[0], currentPosition[1], nextPosition[0][0], nextPosition[0][1]);

                if (nextPosition[1] != [-3, -3]) {
                    var x = currentPosition[0],
                        y = currentPosition[1];
                    
                    drawLine
                }
            }*/
        }

        context.stroke();
    }

    function setTiles(tilesGrid) {
        tiles = tilesGrid;
    }

    function getNextMovement(dir, x, y) {
        var onMirror = false,
            mirror = -1,
            mStyle = mirrorStyle.NULL,
            nextX = x,
            nextY = y,
            dire = -1;

        if (utils.checkForWall(objects["WALLS"], x, y)) {
            return [[-3, -3, -3]];
        }

        if (utils.checkForBomb(objects["BOMBS"], x, y)) {
            levelLosed = true;
            return [[-3, -3, -3]];
        }

        if (utils.checkForLamp(objects["LAMPS"], x, y)) {
            poweredLamps.push([x, y]);
            if (lampsCount == poweredLamps.length) {
                levelComplete = true;
                return [[-3, -3, -3]];  // Level complete
            }
        }

        if (x >= 0 && y >= 0 && x < gridSize[0] && y < gridSize[1]) {
            if (tiles[x][y][0] != mirrorStyle.NULL) {
                onMirror = true;
                mStyle = tiles[x][y][0];
                mirror = tiles[x][y][1];
            }
        }
        
        if (!onMirror) {
            if (dir == dirType.UP_RIGHT) {
                nextX = x + 1;
                nextY = y - 1;

            } else if (dir == dirType.UP) {
                nextY = y - 1;
            
            } else if (dir == dirType.UP_LEFT) {
                nextX = x - 1;
                nextY = y - 1;
            
            } else if (dir == dirType.LEFT) {
                nextX = x - 1;

            } else if (dir == dirType.DOWN_LEFT) {
                nextX = x - 1;
                nextY = y + 1;

            } else if (dir == dirType.DOWN) {
                nextY = y + 1;

            } else if (dir == dirType.DOWN_RIGHT) {
                nextX = x + 1;
                nextY = y + 1;

            } else if (dir == dirType.RIGHT) {
                nextX = x + 1;
            }

            return [[dir, nextX, nextY]];

        } else if (onMirror) {
            if (mStyle == mirrorStyle.NORMAL) {
                if (dir == dirType.UP_RIGHT) {
                    if (mirror == mirrorType.NORMAL.DOWN) {
                        nextX = x + 1;
                        nextY = y + 1;
                        dir = dirType.DOWN_RIGHT;
                    } else if (mirror == mirrorType.NORMAL.LEFT) {
                        nextX = x - 1;
                        nextY = y - 1;
                        dir = dirType.UP_LEFT;
                    } else {
                        return [[-3, -3, -3]];
                    }

                } else if (dir == dirType.UP) {
                    if (mirror == mirrorType.NORMAL.DOWN_RIGHT) {
                        nextX = x + 1;
                        dir = dirType.RIGHT;
                    } else if (mirror == mirrorType.NORMAL.DOWN_LEFT) {
                        nextX = x - 1;
                        dir = dirType.LEFT;
                    } else {
                        return [[-3, -3, -3]];
                    }

                } else if (dir == dirType.UP_LEFT) {
                    if (mirror == mirrorType.NORMAL.DOWN) {
                        nextX = x - 1;
                        nextY = y + 1;
                        dir = dirType.DOWN_LEFT;
                    } else if (mirror == mirrorType.NORMAL.RIGHT) {
                        nextX = x + 1;
                        nextY = y - 1;
                        dir = dirType.UP_RIGHT;
                    } else {
                        return [[-3, -3, -3]];
                    }

                } else if (dir == dirType.LEFT) {
                    if (mirror == mirrorType.NORMAL.UP_RIGHT) {
                        nextY = y - 1;
                        dir = dirType.UP;
                    } else if (mirror == mirrorType.NORMAL.DOWN_RIGHT) {
                        nextY = y + 1;
                        dir = dirType.DOWN;
                    } else {
                        return [[-3, -3, -3]];
                    }

                } else if (dir == dirType.DOWN_LEFT) {
                    if (mirror == mirrorType.NORMAL.UP) {
                        nextX = x - 1;
                        nextY = y - 1;
                        dir = dirType.UP_LEFT;
                    } else if (mirror == mirrorType.NORMAL.RIGHT) {
                        nextX = x + 1;
                        nextY = y + 1;
                        dir = dirType.DOWN_RIGHT;
                    } else {
                        return [[-3, -3, -3]];
                    }

                } else if (dir == dirType.DOWN) {
                    if (mirror == mirrorType.NORMAL.UP_RIGHT) {
                        nextX = x + 1;
                        dir = dirType.RIGHT;
                    } else if (mirror == mirrorType.NORMAL.UP_LEFT) {
                        nextX = x - 1;
                        dir = dirType.LEFT;
                    } else {
                        return [[-3, -3, -3]];
                    }

                } else if (dir == dirType.DOWN_RIGHT) {
                    if (mirror == mirrorType.NORMAL.UP) {
                        nextX = x + 1;
                        nextY = y - 1;
                        dir = dirType.UP_RIGHT;
                    } else if (mirror == mirrorType.NORMAL.LEFT) {
                        nextX = x - 1;
                        nextY = y + 1;
                        dir = dirType.DOWN_LEFT;
                    } else {
                        return [[-3, -3, -3]];
                    }

                } else if (dir == dirType.RIGHT) {
                    if (mirror == mirrorType.NORMAL.UP_LEFT) {
                        nextY = y - 1;
                        dir = dirType.UP;
                    } else if (mirror == mirrorType.NORMAL.DOWN_LEFT) {
                        nextY = y + 1;
                        dir = dirType.DOWN;
                    } else {
                        return [[-3, -3, -3]];
                    }
                }

                return [[dir, nextX, nextY]];

            } else if (mStyle == mirrorStyle.TRIANGLE) {
                // Cómo sigo dos rayos láser por separado?
                var rays = [[-3, -3, -3], [-3, -3, -3]];

                if (dir == dirType.UP_RIGHT) {
                    if (mirror == mirrorType.TRIANGLE.DOWN_LEFT) {
                        rays[0][0] = dirType.UP_LEFT;
                        rays[0][1] = x - 1;
                        rays[0][2] = y - 1;

                        rays[1][0] = dirType.DOWN_RIGHT;
                        rays[1][1] = x + 1;
                        rays[1][2] = y + 1;
                    }
                } else if (dir == dirType.UP_LEFT) {
                    if (mirror == mirrorType.TRIANGLE.DOWN_RIGHT) {
                        nextX = x + 1;
                        nextY = y - 1;
                        dir = dirType.UP_RIGHT;
                        rays[0][0] = dirType.UP_RIGHT;
                        rays[0][1] = x + 1;
                        rays[0][2] = y - 1;

                        rays[1][0] = dirType.DOWN_LEFT;
                        rays[1][1] = x - 1;
                        rays[1][2] = y + 1;
                    }
                } else if (dir == dirType.DOWN_LEFT) {
                    if (mirror == mirrorType.TRIANGLE.UP_RIGHT) {
                        nextX = x - 1;
                        nextY = y - 1;
                        dir = dirType.UP_LEFT;
                        rays[0][0] = dirType.UP_LEFT;
                        rays[0][1] = x - 1;
                        rays[0][2] = y - 1;

                        rays[1][0] = dirType.DOWN_RIGHT;
                        rays[1][1] = x + 1;
                        rays[1][2] = y + 1;
                    }
                } else if (dir == dirType.DOWN_RIGHT) {
                    if (mirror == mirrorType.TRIANGLE.UP_LEFT) {
                        // TODO: follow all directions
                        nextX = x + 1;
                        nextY = y - 1;
                        dir = dirType.UP_RIGHT;
                        rays[0][0] = dirType.UP_RIGHT;
                        rays[0][1] = x + 1;
                        rays[0][2] = y - 1;

                        rays[1][0] = dirType.DOWN_LEFT;
                        rays[1][1] = x - 1;
                        tays[1][2] = y + 1;
                    }
                }

                return rays;
            }
        }

        return [[-3, -3, -3]];
    }

    function drawFirstLine() {
        var x = startPosition[0],
            y = startPosition[1];

        if (direction == dirType.UP_RIGHT) {
            drawLine(x, y, x + 1, y - 1);

        } else if (direction == dirType.UP) {
            drawLine(x, y, x, y - 1);

        } else if (direction == dirType.UP_LEFT) {
            drawLine(x, y, x - 1, y - 1);

        } else if (direction == dirType.LEFT) {
            drawLine(x, y, x - 1, y);

        } else if (direction == dirType.DOWN_LEFT) {
            drawLine(x, y, x - 1, y + 1);

        } else if (direction == dirType.DOWN) {
            drawLine(x, y, x, y + 1);

        } else if (direction == dirType.DOWN_RIGHT) {
            drawLine(x, y, x + 1, y + 1);

        } else if (direction == dirType.RIGHT) {
            drawLine(x, y, x + 1, y);
        }
    }

    function drawLine(fx, fy, tx, ty) {
        movements[0][1] = tx;
        movements[0][2] = ty;

        var x1 = fx * tileSize[0] + tileSize[0] / 2,
            y1 = (fy + 1) * tileSize[1] - tileSize[1] / 2,
            x2 = tx * tileSize[0] + tileSize[0] / 2,
            y2 = (ty + 1) * tileSize[1] - tileSize[1] / 2;

        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
    }

    function setData(_gridSize, _tileSize, _tiles, _laserPosition, _laserDirection, _objects, _lampsCount) {
        levelComplete = false;
        levelLosed = false;

        gridSize = _gridSize;
        tileSize = _tileSize;
        tiles = _tiles;
        objects = _objects;
        startPosition = _laserPosition;
        startDirection = translateDirection(_laserDirection);
        direction = startDirection,
        lampsCount = _lampsCount;
    }

    function translateDirection(strDirection) {
        var _direction;

        if (strDirection == "up-right") {
            _direction = dirType.UP_RIGHT;
        } else if (strDirection == "up") {
            _direction = dirType.UP;
        } else if (strDirection == "up-left") {
            _direction = dirType.UP_LEFT;
        } else if (strDirection == "left") {
            _direction = dirType.LEFT;
        } else if (strDirection == "down-left") {
            _direction = dirType.DOWN_LEFT;
        } else if (strDirection == "down") {
            _direction = dirType.DOWN;
        } else if (strDirection == "down-right") {
            _direction = dirType.DOWN_RIGHT;
        } else if (strDirection == "right") {
            _direction = dirType.RIGHT;
        }

        return _direction;
    }

    function inScreen(x, y) {
        return (x >= -1 && y >= -1 && x <= gridSize[0] + 1 && y <= gridSize[1] + 1);
    }

    function checkLevelComplete() {
        return levelComplete;
    }

    function setLevelComplete(complete) {
        levelComplete = complete;
    }

    function checkLevelLosed() {
        return levelLosed;
    }

    function setLevelLosed(losed) {
        levelLosed = losed;
    }

    function getPoweredLamps() {
        return poweredLamps;
    }

    return {
        draw: draw,
        setTiles: setTiles,
        setData: setData,
        checkLevelComplete: checkLevelComplete,
        checkLevelLosed: checkLevelLosed,
        setLevelLosed: setLevelLosed,
        getPoweredLamps: getPoweredLamps
    }
})();