var Laser = (function() {

    var dirType = {
        UP: 0,
        DOWN: 1,
        RIGHT: 2,
        LEFT: 3
    }

    var mirrorType = {  // Where the mirror are pointing
        NULL: 0,
        UP_RIGHT: 1,
        DOWN_RIGHT: 2,
        DOWN_LEFT: 3,
        UP_LEFT: 4
    }

    var direction = dirType.UP,
        startDirection = dirType.UP,
        startPosition = [0, 0],
        currentPosition = [0, 0],
        nextPosition = [0, 0],
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
        levelLosed = false;

    function draw(context) {
        direction = startDirection;
        poweredLamps = [];

        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = width;
        context.lineCap = "round"

        drawFirstLine(context);

        var nextPosible = true;

        while (nextPosible) {
            nextPosible = nextMovementIsPosible();
            if (nextPosible) {
                drawLine(context, currentPosition[0], currentPosition[1], nextPosition[0], nextPosition[1]);
            }
        }

        context.stroke();
    }

    function setTiles(tilesGrid) {
        tiles = tilesGrid;
    }

    function nextMovementIsPosible() {
        var x = currentPosition[0],
            y = currentPosition[1],
            onMirror = false,
            mirror = -1,
            nextX = -2,
            nextY = -2;

        if (utils.checkForWall(objects["WALLS"], x, y)) {
            return false;
        }

        if (utils.checkForBomb(objects["BOMBS"], x, y)) {
            levelLosed = true;
            return false;
        }

        if (utils.checkForLamp(objects["LAMPS"], x, y)) {
            poweredLamps.push([x, y]);
            if (lampsCount === poweredLamps.length) {
                levelComplete = true;
                return false;  // Level complete
            }
        }

        if (x >= 0 && y >= 0 && x < gridSize[0] && y < gridSize[1]) {
            if (tiles[x][y] !== 0) {
                onMirror = true;
                mirror = tiles[x][y];
            }
        }
        
        if (!onMirror) {
            if (direction === dirType.UP) {
                nextPosition[0] = x;
                nextPosition[1] = y - 1;
            } else if (direction === dirType.DOWN) {
                nextPosition[0] = x;
                nextPosition[1] = y + 1;
            } else if (direction === dirType.RIGHT) {
                nextPosition[0] = x + 1;
                nextPosition[1] = y;
            } else if (direction === dirType.LEFT) {
                nextPosition[0] = x - 1;
                nextPosition[1] = y;
            }

            return (nextPosition[0] >= -1 && nextPosition[1] >= -1 &&
                    nextPosition[0] <= gridSize[0] + 1 && nextPosition[1] <= gridSize[1] + 1);
        
        } else if (onMirror) {
            if (direction === dirType.UP) {
                nextY = y;
                if (mirror === mirrorType.UP_RIGHT || mirror === mirrorType.UP_LEFT) {
                    return false;
                } else if (mirror === mirrorType.DOWN_RIGHT) {
                    nextX = x + 1;
                    direction = dirType.RIGHT;
                } else if (mirror === mirrorType.DOWN_LEFT) {
                    nextX = x - 1;
                    direction = dirType.LEFT;
                }

            } else if (direction === dirType.DOWN) {
                nextY = y;
                if (mirror === mirrorType.DOWN_RIGHT || mirror === mirrorType.DOWN_LEFT) {
                    return false;
                } else if (mirror === mirrorType.UP_RIGHT) {
                    nextX = x + 1;
                    direction = dirType.RIGHT;
                } else if (mirror === mirrorType.UP_LEFT) {
                    nextX = x - 1;
                    direction = dirType.LEFT;
                }

            } else if (direction === dirType.RIGHT) {
                nextX = x;
                if (mirror === mirrorType.UP_RIGHT || mirror === mirrorType.DOWN_RIGHT) {
                    return false;
                } else if (mirror === mirrorType.UP_LEFT) {
                    nextY = y - 1;
                    direction = dirType.UP;
                } else if (mirror === mirrorType.DOWN_LEFT) {
                    nextY = y + 1;
                    direction = dirType.DOWN;
                }

            } else if (direction === dirType.LEFT) {
                nextX = x;
                if (mirror === mirrorType.UP_LEFT || mirror === mirrorType.DOWN_LEFT) {
                    return false;
                } else if (mirror === mirrorType.UP_RIGHT) {
                    nextY = y - 1;
                    direction = dirType.UP;
                } else if (mirror === mirrorType.DOWN_RIGHT) {
                    nextY = y + 1;
                    direction = dirType.DOWN;
                }
            }

            nextPosition[0] = nextX;
            nextPosition[1] = nextY;

            return true;
        }

        return false;
    }

    function drawFirstLine(context) {
        if (startDirection === dirType.UP) {
            drawLine(context, startPosition[0], startPosition[1], startPosition[0], startPosition[1] - 1);
        } else if (startDirection === dirType.DOWN) {
            drawLine(context, startPosition[0], startPosition[1], startPosition[0], startPosition[1] + 1);
        } else if (startDirection === dirType.RIGHT) {
            drawLine(context, startPosition[0], startPosition[1], startPosition[0] + 1, startPosition[1]);
        } else if (startDirection === dirType.LEFT) {
            drawLine(context, startPosition[0], startPosition[1], startPosition[0] - 1, startPosition[1]);
        }
    }

    function drawLine(context, fx, fy, tx, ty) {
        currentPosition[0] = tx;
        currentPosition[1] = ty;

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

        if (strDirection == "up") {
            _direction = dirType.UP;
        } else if (strDirection == "down") {
            _direction = dirType.DOWN;
        } else if (strDirection == "right") {
            _direction = dirType.RIGHT;
        } else if (strDirection == "left") {
            _direction = dirType.LEFT;
        }

        return _direction;
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