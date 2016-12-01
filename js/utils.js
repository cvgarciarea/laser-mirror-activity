var Utils = (function() {
    function checkForObject(objects, x, y) {
        var lamps = objects["LAMPS"],
            bombs = objects["BOMBS"],
            walls = objects["WALLS"];

        return (checkForLamp(lamps, x, y) || checkForBomb(bombs, x, y) || checkForWall(walls, x, y));
    }

    function checkForObjectIgnoreLamps(objects, x, y) {
        var bombs = objects["BOMBS"],
            walls = objects["WALLS"];

        return (checkForBomb(bombs, x, y) || checkForWall(walls, x, y));
    }

    function checkForLamp(lamps, x, y) {
        for (var i=0; i < lamps.length; i++) {
            if (lamps[i][0] == x && lamps[i][1] == y) {
                return true;
            }
        }

        return false;
    }

    function checkForBomb(bombs, x, y) {
        for (var i=0; i < bombs.length; i++) {
            if (bombs[i][0] == x && bombs[i][1] == y) {
                return true;
            }
        }

        return false;
    }

    function checkForWall(walls, x, y) {
        for (var i=0; i < walls.length; i++) {
            if (walls[i][0] == x && walls[i][1] == y) {
                return true;
            }
        }

        return false;
    }

    return {
        checkForObject: checkForObject,
        checkForObjectIgnoreLamps: checkForObjectIgnoreLamps,
        checkForLamp: checkForLamp,
        checkForBomb: checkForBomb,
        checkForWall: checkForWall
    }
})();