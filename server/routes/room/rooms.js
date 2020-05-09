const engine   = require("../../../client/gamecore/library"),
      room     = require("../../database/room"),
      user     = require("../../database/user"),
      generate = require("../../utils/generate"),
      f_header = "[routes/room/rooms.js]";

module.exports = function (app, secured) {
    app.post("/rooms",
             secured,
             async (req, res) => {
                 try {
                     if ( !req.body.type ) throw "No type provided!";
                     let v_id;
                     if ( req.body.type === "create_room" ) {
                         if ( !req.body.room_name ) throw "No room_name provided!";

                         if ( !req.body.score_limit ) throw "No score limit provided!";

                         if ( !req.body.max_players ) throw "No max_players provided!";

                         if ( req.body.password === undefined ) throw "No max_players provided!";

                         v_id = await room.get_next_id().catch((e) => {
                             console.error(e.message);
                         });

                         let username = await user.get_user_id(req.headers.session);
                         v_id = v_id + 1;

                         let room_obj = {
                             id: v_id,
                             host: username[0].username,
                             room_name: req.body.room_name,
                             score_limit: req.body.score_limit,
                             max_players: req.body.max_players,
                             players_in_game: 0,
                             password: req.body.password,
                             game_started: 0
                         };

                         let status = await room.insert_room(room_obj).catch((e) => {
                             console.error(e.message);
                         });

                         if ( status !== true ) throw "Error at inserting in db.";

                         await room.add_player(v_id,
                                               username[0].username);

                     } else if ( req.body.type === "delete_room" ) {

                         if ( !req.body.roomID ) throw " No roomID provided!";

                         if ( !( await room.room_exist(req.body.roomID) ) )
                             throw " Room with this id dose not exist.";

                         else if ( !( await room.delete_room(req.body.roomID) ) )
                             throw "Internal problem.";

                         if ( !( await room.delete_current_user_rooms(req.body.roomID) ) )
                             throw "Internal problem.";

                     } else throw "Type of command not detected.";

                     if ( req.body.type !== "create_room" )
                         res.status(200)
                             .send(JSON.stringify({ success: true }));
                     else
                         res.status(200).send(
                             JSON.stringify({
                                                success: true,
                                                roomID: v_id
                                            })
                         );

                 } catch (e) {
                     res.status(417)
                         .send(
                             JSON.stringify({ success: false, err: e.message })
                         );
                 }
             });

    app.post("/join_room",
             secured,
             async (req, res) => {
                 try {
                     if ( !req.body.roomID ) throw "No roomID provided!";

                     if ( req.body.password === undefined ) throw "No password provided!";

                     //first check the db to see if there are any slots avaiable for our user
                     await room.check(req.body.roomID,
                                      req.body.password);

                     //scoate usernaem-ul dupa session
                     let u_id = await user.get_user_id(req.headers.session);

                     if ( u_id === false ) throw "internal error";

                     //verifica daca este deja in camera ca sa il integreze
                     let ok = await room.is_player_in_room(req.body.roomID,
                                                           u_id[0].username);
                     if ( ok === true ) {
                         await room.add_player(req.body.roomID,
                                               u_id[0].username);
                         await room.increase_counter(req.body.roomID);
                     }

                     // since the timestamp got updated the session parameter is not as required anymore
                     res.send(JSON.stringify({ success: true }));
                 } catch (e) {
                     console.log(e);
                     res.status(417).send(
                         JSON.stringify({
                                            success: false,
                                            reason: e
                                        })
                     );
                 }
             });
};
