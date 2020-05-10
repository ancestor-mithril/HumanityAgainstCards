const
    room = require("../../database/room");

module.exports = function (app) {
    app.get("/get_hosted_rooms",
        async (req, res) => {
            try {

                let rooms = await room.get_rooms_for_host(req.headers.session);

                if (rooms === false) throw "internal error";

                let room_ids = Array();

                for (let key in rooms) {
                    if (rooms.hasOwnProperty(key)) {
                        room_ids.push(rooms[key].id);
                    }
                }

                res.status(200).send({success: true, rooms: room_ids});
            } catch (e) {
                res.status(401).send({success: false, reason: e});
            }
        });
};
