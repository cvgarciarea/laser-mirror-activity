var LevelsManager = (function() {
    var levels = {
        FIRST: {
            canvasSize: [598, 448],
            gridSize: [14, 9],
            laserPosition: [6, 8],
            laserDirection: "up",
            mirrorsCount: {
                NORMAL: 1,
                CRISTAL: 0
            },
            objects: {
                LAMPS: [[13, 4]],
                BOMBS: [],
                WALLS: []
            }
        },

        SECOND: {
            canvasSize: [598, 448],
            gridSize: [14, 9],
            laserPosition: [13, 8],
            laserDirection: "left",
            mirrorsCount: {
                NORMAL: 3,
                CRISTAL: 0
            },
            objects: {
                LAMPS: [[10, 0]],
                BOMBS: [[4, 1], [11, 2]],
                WALLS: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [11, 0], [12, 0], [13, 0],
                        [0, 1], [1, 1], [2, 1], [3, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1], [11, 1], [12, 1], [13, 1],
                        [0, 2], [1, 2], [2, 2], [3, 2], [12, 2], [13, 2],
                        [0, 3], [1, 3], [2, 3], [3, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3], [10, 3], [11, 3], [12, 3], [13, 3],
                        [0, 4], [1, 4], [2, 4], [3, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [11, 4], [12, 4], [13, 4]]
            }
        },

        THIRD: {
            canvasSize: [598, 448],
            gridSize: [14, 9],
            laserPosition: [6, 8],
            laserDirection: "up",
            mirrorsCount: {
                NORMAL: 3,
                CRISTAL: 0
            },
            objects: {
                LAMPS: [[7, 2], [6, 3], [8, 3], [0, 4], [7, 4]],
                BOMBS: [],
                WALLS: []
            }
        },

        FOURTH: {
            canvasSize: [598, 448],
            gridSize: [14, 10],
            laserPosition: [3, 9],
            laserDirection: "up-right",
            mirrorsCount: {
                NORMAL: 0,
                CRISTAL: 3
            },
            objects: {
                LAMPS: [[10, 0], [9, 5], [8, 6]],
                BOMBS: [],
                WALLS: []
            }
        }
    };

    function getLevelData(level) {
        return levels[level];
    }

    return {
        getLevelData: getLevelData
    }
})();