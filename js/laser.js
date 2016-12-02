var Laser = (function() {
    var mirrorStyle = {
        NULL: 0,
        NORMAL: 1,
        CRISTAL: 2
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
        CRISTAL: {
            HORIZONTAL1: 1,
            VERTICAL1: 2,
            HORIZONTAL2: 3,
            VERTICAL2: 4
        }
    }

    var direction = dirType.UP,
        previousDirection = dirType.UP,
        startDirection = dirType.UP,
        startPosition = [0, 0],
        currentPosition = [0, 0],
        nextPosition = [-3, -3],
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
        drawedPoints = [];  // [x, y, direction]

    var context = document.getElementById("board-canvas").getContext("2d");

    function draw() {
        direction = startDirection;
        poweredLamps = [];
        drawedPoints = [];

        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = width;
        context.lineCap = "round";

        drawFirstLine();

        loop = true;
        while (loop) {
            if (currentPosition == [-3, -3]) {
                break;
            }

            var x = currentPosition[0],
                y = currentPosition[1];

            getNextMovement(x, y);

            for (var i=0; i < drawedPoints.length; i++) {
                if (drawedPoints[i][0] == nextPosition[0] && drawedPoints[i][1] == nextPosition[1] && drawedPoints[i][2] == direction) {
                    // Exiting before a infinite bucle
                    loop = false;
                }
            }

            if (!inScreen(nextPosition[0], nextPosition[1])) {
                break;
            }

            drawLine(x, y, nextPosition[0], nextPosition[1]);
        }

        context.stroke();
    }

    function setTiles(tilesGrid) {
        tiles = tilesGrid;
    }

    function getNextMovement(x, y) {
        var onMirror = false,
            mirror = -1,
            mStyle = mirrorStyle.NULL,
            nextX = x,
            nextY = y;

        if (utils.checkForWall(objects["WALLS"], x, y)) {
            nextPosition = [-3, -3];
            return;
        }

        if (utils.checkForBomb(objects["BOMBS"], x, y)) {
            levelLosed = true;
            nextPosition = [-3, -3];
            return;
        }

        if (utils.checkForLamp(objects["LAMPS"], x, y)) {
            poweredLamps.push([x, y]);
            if (lampsCount == poweredLamps.length) {
                levelComplete = true;
                nextPosition = [-3, -3];
                return;
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
            if (direction == dirType.UP_RIGHT) {
                nextPosition = [x + 1, y - 1];

            } else if (direction == dirType.UP) {
                nextPosition = [x, y - 1];
            
            } else if (direction == dirType.UP_LEFT) {
                nextPosition = [x - 1, y - 1];
            
            } else if (direction == dirType.LEFT) {
                nextPosition = [x - 1, y];

            } else if (direction == dirType.DOWN_LEFT) {
                nextPosition = [x - 1,  y + 1];

            } else if (direction == dirType.DOWN) {
                nextPosition = [x, y + 1];

            } else if (direction == dirType.DOWN_RIGHT) {
                nextPosition = [x + 1, y + 1];

            } else if (direction == dirType.RIGHT) {
                nextPosition = [x + 1, y];
            }

            return;

        } else if (onMirror) {
            if (mStyle == mirrorStyle.NORMAL) {
                if (direction == dirType.UP_RIGHT) {
                    if (mirror == mirrorType.NORMAL.DOWN) {
                        nextPosition = [x + 1, y + 1];
                        direction = dirType.DOWN_RIGHT;
                    
                    } else if (mirror == mirrorType.NORMAL.LEFT) {
                        nextPosition = [x - 1, y - 1];
                        direction = dirType.UP_LEFT;

                    } else {
                        nextPosition = [-3, -3];
                        return;
                    }

                } else if (direction == dirType.UP) {
                    if (mirror == mirrorType.NORMAL.DOWN_RIGHT) {
                        nextPosition = [x + 1, y];
                        direction = dirType.RIGHT;

                    } else if (mirror == mirrorType.NORMAL.DOWN_LEFT) {
                        nextPosition = [x - 1, y];
                        direction = dirType.LEFT;

                    } else {
                        nextPosition = [-3, -3];
                        return;
                    }

                } else if (direction == dirType.UP_LEFT) {
                    if (mirror == mirrorType.NORMAL.DOWN) {
                        nextPosition = [x - 1, y + 1];
                        direction = dirType.DOWN_LEFT;

                    } else if (mirror == mirrorType.NORMAL.RIGHT) {
                        nextPosition = [x + 1, y - 1];
                        direction = dirType.UP_RIGHT;

                    } else {
                        nextPosition = [-3, -3];
                        return;
                    }

                } else if (direction == dirType.LEFT) {
                    if (mirror == mirrorType.NORMAL.UP_RIGHT) {
                        nextPosition = [x, y - 1];
                        direction = dirType.UP;

                    } else if (mirror == mirrorType.NORMAL.DOWN_RIGHT) {
                        nextPosition = [x, y + 1];
                        direction = dirType.DOWN;

                    } else {
                        nextPosition = [-3, -3];
                        return;
                    }

                } else if (direction == dirType.DOWN_LEFT) {
                    if (mirror == mirrorType.NORMAL.UP) {
                        nextPosition = [x - 1, y - 1];
                        direction = dirType.UP_LEFT;

                    } else if (mirror == mirrorType.NORMAL.RIGHT) {
                        nextPosition = [x + 1, y + 1];
                        direction = dirType.DOWN_RIGHT;

                    } else {
                        nextPosition = [-3, -3];
                        return;
                    }

                } else if (direction == dirType.DOWN) {
                    if (mirror == mirrorType.NORMAL.UP_RIGHT) {
                        nextPosition = [x + 1, y];
                        direction = dirType.RIGHT;

                    } else if (mirror == mirrorType.NORMAL.UP_LEFT) {
                        nextPosition = [x - 1, y];
                        direction = dirType.LEFT;

                    } else {
                        nextPosition = [-3, -3];
                        return;
                    }

                } else if (direction == dirType.DOWN_RIGHT) {
                    if (mirror == mirrorType.NORMAL.UP) {
                        nextPosition = [x + 1, y - 1];
                        direction = dirType.UP_RIGHT;

                    } else if (mirror == mirrorType.NORMAL.LEFT) {
                        nextPosition = [x - 1, y + 1];
                        direction = dirType.DOWN_LEFT;

                    } else {
                        nextPosition = [-3, -3];
                        return;
                    }

                } else if (direction == dirType.RIGHT) {
                    if (mirror == mirrorType.NORMAL.UP_LEFT) {
                        nextPosition = [x, y - 1];
                        direction = dirType.UP;

                    } else if (mirror == mirrorType.NORMAL.DOWN_LEFT) {
                        nextPosition = [x, y + 1];
                        direction = dirType.DOWN;

                    } else {
                        nextPosition = [-3, -3];
                        return;
                    }
                }

                return;

            } else if (mStyle == mirrorStyle.CRISTAL) {
                if (direction == dirType.UP_RIGHT) {
                    if (mirror == mirrorType.CRISTAL.HORIZONTAL1) {
                        nextPosition = [x + 1, y];
                        direction = dirType.RIGHT;
                    
                    } else if (mirror == mirrorType.CRISTAL.VERTICAL1) {
                        nextPosition = [x, y - 1];
                        direction = dirType.UP;
                    
                    } else {
                        nextPosition = [-3, -3];
                    }

                } else if (direction == dirType.UP) {
                    if (mirror == mirrorType.CRISTAL.HORIZONTAL2) {
                        nextPosition = [x + 1, y - 1];
                        direction = dirType.UP_RIGHT;  // or left?

                    } else if (mirror == mirrorType.CRISTAL.VERTICAL2) {
                        nextPosition = [x - 1, y - 1];
                        direction = dirType.UP_LEFT;  // or left?
                    
                    } else {
                        nextPosition = [-3, -3];
                    }

                } else if (direction == dirType.UP_LEFT) {
                    if (mirror == mirrorType.CRISTAL.HORIZONTAL1) {
                        nextPosition = [x - 1, y];
                        direction = dirType.LEFT;

                    } else if (mirror == mirrorType.CRISTAL.VERTICAL1) {
                        nextPosition = [x, y - 1];
                        direction = dirType.UP;
                    
                    } else {
                        nextPosition = [-3, -3];
                    }

                } else if (direction == dirType.LEFT) {
                    if (mirror == mirrorType.CRISTAL.HORIZONTAL2) {
                        nextPosition = [x - 1, y + 1];
                        direction = dirType.DOWN_LEFT;

                    } else if (mirror == mirrorType.CRISTAL.VERTICAL2) {
                        nextPosition = [x - 1, y - 1];
                        direction = dirType.UP_LEFT;

                    } else {
                        nextPosition = [-3, -3];
                    }

                } else if (direction == dirType.DOWN_LEFT) {
                    if (mirror == mirrorType.CRISTAL.HORIZONTAL1) {
                        nextPosition = [x - 1, y];
                        direction = dirType.LEFT;

                    } else if (mirror == mirrorType.CRISTAL.VERTICAL1) {
                        nextPosition = [x, y + 1];
                        direction = dirType.DOWN;
                    
                    } else {
                        nextPosition = [-3, -3];
                    }

                } else if (direction == dirType.DOWN) {
                    if (mirror == mirrorType.CRISTAL.HORIZONTAL2) {
                        nextPosition = [x + 1, y + 1];
                        direction = dirType.DOWN_RIGHT;  // or left?

                    } else if (mirror == mirrorType.CRISTAL.VERTICAL2) {
                        nextPosition = [x - 1, y + 1];
                        direction = dirType.DOWN_LEFT;  // or right?
                    
                    } else {
                        nextPosition = [-3, -3];
                    }

                } else if (direction == dirType.DOWN_RIGHT) {
                    if (mirror == mirrorType.CRISTAL.HORIZONTAL1) {
                        nextPosition = [x + 1, y];
                        direction = dirType.RIGHT;

                    } else if (mirror == mirrorType.CRISTAL.VERTICAL1) {
                        nextPosition = [x, y + 1];
                        direction = dirType.DOWN;
                    
                    } else {
                        nextPosition = [-3, -3];
                    }

                } else if (direction == dirType.RIGHT) {
                    if (mirror == mirrorType.CRISTAL.HORIZONTAL2) {
                        nextPosition = [x + 1, y - 1];
                        direction = dirType.UP_RIGHT;

                    } else if (mirror == mirrorType.CRISTAL.VERTICAL2) {
                        nextPosition = [x + 1, y + 1];
                        direction = dirType.DOWN_RIGHT;
                    
                    } else {
                        nextPosition = [-3, -3];
                    }
                }
            }
        }

        return;
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
        drawedPoints.push([fx, fy, previousDirection]);
        previousDirection = direction;
        currentPosition = [tx, ty];

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
        previousDirection = direction;
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