var Board = (function() {
    var xSize = 11,
        ySize = 11,
        tileWidth = 0,
        tileHeight = 0,
        bgColor = "#333",
        fgColor = "#555",
        lineColor = "#FFF",
        overTile = [],
        tiles = [],
        drawLaser = false;

    var board = document.getElementById("board-canvas");
    var context = board.getContext("2d");
    var laser = Laser;

    function init() {
        tileWidth = board.width / xSize;
        tileHeight = board.height / ySize;
        tiles = [];
        for (var x = 0; x < xSize; x++) {
            tiles[x] = [];
            for (var y = 0; y < ySize; y++) {
                tiles[x][y] = 0;
            }
        }

        laser.setTiles(tiles);
        laser.setGridSize(xSize, ySize, tileWidth, tileHeight);
        draw();
    }

    function draw() {
        drawBackground();
        drawGrid();
        drawOverTile();
        drawImageTiles();

        //if (drawLaser) {
        laser.draw(context, tiles);
        //}
    }

    function drawBackground() {
        context.fillStyle = bgColor;
        context.fillRect(0, 0, board.width, board.height);
    }

    function drawGrid() {
        context.beginPath();

        context.lineWidth = 2;
        context.strokeStyle = lineColor;

        for (var i = 1; i < xSize; i++) {
            context.moveTo(tileWidth * i, 0);
            context.lineTo(tileWidth * i, board.height);
        }

        for (var i = 1; i < ySize; i++) {
            context.moveTo(0, tileHeight * i);
            context.lineTo(board.width, tileHeight * i);
        }

        context.stroke();
    }

    function drawOverTile() {
        if (overTile.length !== 0) {
            var x = overTile[0],
                y = overTile[1];

            context.fillStyle = fgColor;
            context.fillRect(tileWidth * x - 1, tileHeight * y - 1, tileWidth + 2, tileHeight + 2);
            context.fill();
        }
    }

    function drawImageTiles() {
        for (var x = 0; x < xSize; x++) {
            for (var y = 0; y < ySize; y++) {
                if (tiles[x][y] !== 0) {
                    img = new Image();
                    img.src = "img/mirror" + tiles[x][y] + ".png";
                    context.drawImage(img, tileWidth * x, tileHeight * y, tileWidth, tileHeight);
                }
            }
        }
    }

    board.addEventListener("click", function(event) {
        drawLaser = false;

        var row = overTile[0],
            column = overTile[1];

        tiles[row][column] = tiles[row][column] + 1;
        if (tiles[row][column] === 5) {
            tiles[row][column] = 0;
        }

        laser.setTiles(tiles);
        draw();
    }, false);

    board.addEventListener("mousemove", function(event) {
        overTile[0] = parseInt(event.offsetX / tileWidth);
        overTile[1] = parseInt(event.offsetY / tileHeight);
        draw();
    }, false);

    document.getElementById("clear-button").onclick = function() {
        drawLaser = false;
        for (var x = 0; x < tiles.length; x++) {
            for (var y = 0; y < tiles[x].length; y++) {
                tiles[x][y] = 0;
            }
        }

        draw();
    };

    document.getElementById("fire-button").onclick = function() {
        drawLaser = true;
        draw();
    }

    return {
        init: init,
        draw: draw
    };
})();