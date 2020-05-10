const config = require("../../config"),
    database = require("../../utils/database"),
    color = require("../../colors"),
    log = require("../../utils/log"),
    engine = require("../../../client/gamecore/library");
f_header = "[routes/game/game_handler.js]";

var game_manager = new engine.GameManager(3, 0, [0, 1, 2]);

module.exports = function (app,secured) {
    app.post("/game_manager/response", secured, async (req, res) => {
        try {
            if (!req.body) throw "No provided header data !";
            let response;
            if (req.body.header === 'get_id'){
                if (this.SID === undefined){ //TEMPORARY SID, this will be available on the client side
                    this.SID = 0;
                }
                response = {header: 'sent_id', id: this.SID++};
            }
            else{
                response = game_manager.response(req.body);
            }
            if (response.error !== undefined) throw `Awkward client error thrown "${response.error}"`;
            //console.log(JSON.stringify({  success: true, data: response }));
            res.status(200).send(JSON.stringify({  success: true, data: response }));
        } catch (e) {
            console.log(JSON.stringify({ success: false, err: e }));
            res.status(417).send(JSON.stringify({ success: false, err: e }));
        }
    });
};
    