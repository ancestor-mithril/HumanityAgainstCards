const config = require("../../config"),
    database = require("../../utils/database"),
    color = require("../../colors"),
    log = require("../../utils/log"),
    engine = require("../../../client/gamecore/library"),
    map = require("./../../map").RoomMap,
    f_header = "[routes/game/game_handler.js]";

let game_manager;
if (config.game_debug){
    setTimeout(() => game_manager = new (engine.GameManager)([{sid: 0}], 1),
    3000);
}
module.exports = function (app, secured) {
    app.post("/game_manager/:roomID",
        secured,
        async (req, res) => {
            try {
                if (!req.body) throw "No provided header data !";
                if (!req.params.roomID) throw "No roomID present";

                if (!config.game_debug){
                    game_manager = map.get(parseInt(req.params.roomID));
                }

                if (game_manager === undefined)
                    throw "Room not found";

                let response = await game_manager.response(req.body);

                if (response.error !== undefined)
                    throw `Game Manager Error: "${response}"`;

                res.status(200).send(JSON.stringify({success: true, data: response}));
            } catch (e) {
                res.status(417).send(JSON.stringify({success: false, err: e}));
                console.log(e);
            }
        });
};
