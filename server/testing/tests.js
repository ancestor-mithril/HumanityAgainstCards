const http = require('http');
const assert = require('assert').strict;

var options = {
    hostname: 'localhost',
    port: 8081,
    headers:{
        session: "dnk2dm5rOGMxNTg5NTQ5ODQzNDIwZmdlNG56ZWs="
    }
}
var nr_white_cards=10;
var roomId_for_testing=1002;
async function testAIGetCard(unitTester, test){
    http.get('http://localhost:8000/ai?room_id=1&request=getAiAnswer&param={'+
        '"black_card": [{ "_id": "1", "text": "I got 99 problems but ain\'t one.", "pick": "1" }],'+
        '"white_cards": [[{ "_id": "1", "text":  "Man meat."}], [{ "_id": "2", "text": "Autocannibalism."}],'+
        '[{ "_id": "4", "text":  "Man meat."}], [{ "_id": "3", "text": "Autocannibalism."}]] }', (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            try{
                assert(JSON.parse(data).answer==='Success','Failed');
            }
            catch (e) {
                unitTester.notify(test, {status: 'failed', message: e.message});
                return;
            }
            unitTester.notify(test, {status: 'success'});
        });
    }).on("error", (err) => {
        unitTester.notify(test, {status: 'fatal', message: err});
    });
}

   async function testAIGetCard1(unitTester, test){ 
    http.get('http://localhost:8000/ai?room_id=1&request=getAiAnswer&param={'+
'"black_card": [{ "_id": "1", "text": "I got 99 problems but  ain\'t one.", "pick": "1" }],'+
'"white_cards": [[{ "_id": "1", "text":  "Man meat."}, { "_id": "2", "text": "Autocannibalism."}],'+
' [{ "_id": "3", "text": "Autocannibalism."}, { "_id": "4", "text":  "Man meat."}]] }', (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            try{
                 assert.deepEqual(JSON.parse(data).answer,'Success');
            }
            catch (e) {
                unitTester.notify(test, {status: 'failed', message: e.message});
                return;
            }
            unitTester.notify(test, {status: 'success'});
        });
    }).on("error", (err) => {
        unitTester.notify(test, {status: 'fatal', message: err});
    });
    
   }
   
   
async function testAITrain(unitTester, test){   
        http.get('http://localhost:8000/ai?room_id=1&request=setProbability&param={"p": "30"}', (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            try{
                 assert.deepEqual(JSON.parse(data).answer,'Success');
            }
            catch (e) {
                unitTester.notify(test, {status: 'failed', message: e.message});
                return;
            }
            unitTester.notify(test, {status: 'success'});
        });
    }).on("error", (err) => {
        unitTester.notify(test, {status: 'fatal', message: err});
    });
    
}

async function testAIGetProbability(unitTester, test){  
    http.get('http://localhost:8000/ai?room_id=1&request=getProbability&param={}', (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            try{
                     assert.deepEqual(JSON.parse(data).answer,'Success');
                     assert.deepEqual(JSON.parse(data).result,30);
            }
            catch (e) {
                unitTester.notify(test, {status: 'failed', message: e.message});
                return;
            }
            unitTester.notify(test, {status: 'success'});
        });
    }).on("error", (err) => {
        unitTester.notify(test, {status: 'fatal', message: err});
    });
    
}

async function testAISetProbability(unitTester, test){   
    http.get('http://localhost:8000/ai?room_id=1&request=setProbability&param={"p": "-1"}', (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            try{
                      assert.deepEqual(JSON.parse(data).answer,'Error');
            }
            catch (e) {
                unitTester.notify(test, {status: 'failed', message: e.message});
                return;
            }
            unitTester.notify(test, {status: 'success'});
        });
    }).on("error", (err) => {
        unitTester.notify(test, {status: 'fatal', message: err});
    });
}

async function testGameStarted(unitTester, test){

    call(unitTester, test,"/game_started/"+roomId_for_testing);
}

async function GetRooms(unitTester, test){

    call(unitTester, test,'/get_rooms');
}

async function GetPlayersFromRoom(unitTester, test){

    call(unitTester, test,'/players_from_room/'+roomId_for_testing);

}

async function EndGame(unitTester, test){
    const data = JSON.stringify({ roomID : roomId_for_testing });

    let optionsPost = {
        hostname: 'localhost',
        port: 8081,
        method: 'POST',
        headers:{
            session: "dnk2dm5rOGMxNTg5NTQ5ODQzNDIwZmdlNG56ZWs=",
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }
      optionsPost.path="/end_game";
      let raspuns="";
      const req = http.request(optionsPost, (res) => {
      res.on('data', (chunk) => {
            raspuns+=chunk;
      })
      res.on('end',()=>{
          try{
              assert(JSON.parse(raspuns).success===true,'Failed');
          }
          catch (e) {
              unitTester.notify(test, {status: 'failed', message: e.message});
              return;
          }
          unitTester.notify(test, {status: 'success'});
      })
      });

    req.on('error', (error) => {
        unitTester.notify(test, {status: 'fatal', message: error});
    });

    req.write(data);
    req.end();
}

async function GameHandler(unitTester, test){

    let optionsPost = {
        hostname: 'localhost',
        port: 8081,
        method: 'POST',
        headers:{
            session: "dnk2dm5rOGMxNTg5NTQ5ODQzNDIwZmdlNG56ZWs=",
            'Content-Type': 'application/json',
            'Content-Length': 0
        }
    }
    optionsPost.path="/game_manager/"+nr_white_cards;
    let raspuns="";
    const req = http.request(optionsPost, (res) => {
        res.on('data', (chunk) => {
            raspuns+=chunk;
        })
        res.on('end',()=>{
            try{
                assert(JSON.parse(raspuns).success===false,'Failed');
            }
            catch (e) {
                unitTester.notify(test, {status: 'failed', message: e.message});
                return;
            }
            unitTester.notify(test, {status: 'success'});
        })
    });

    req.on('error', (error) => {
        unitTester.notify(test, {status: 'fatal', message: error});
    });

    req.write();
    req.end();
}

async function GetBlackCard(unitTester, test){

   await call(unitTester, test,"/get_black_card");

}

async function GetWhiteCards(unitTester, test){

    await call(unitTester, test,"/get_white_cards/"+nr_white_cards);

}

async function call(unitTester, test, path){
    options.path = path;
    http.get(options,( res ) => {
        let raspuns = '';
        res.on('data', (chunk) => {
            raspuns += chunk

        });
        res.on('end', () => {
            try{
                assert(JSON.parse(raspuns).success===true,'Failed');
            }
            catch (e) {
                unitTester.notify(test, {status: 'failed', message: e.message});
                return;
            }
            unitTester.notify(test, {status: 'success'});
        });
    }).on("error", (err) => {
        unitTester.notify(test, {status: 'fatal', message: err});
    });

}

async function testGetHostedRooms(unitTester, test){
    const options = {
        hostname: 'localhost',
        port: 8081,
        path: '/get_hosted_rooms',
        headers: {
            session: 'dnk2dm5rOGMxNTg5NTQ5ODQzNDIwZmdlNG56ZWs='
        }
    };

    http.get(options, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            try{
                assert(JSON.parse(data).success === true, false);
            }
            catch (e) {
                unitTester.notify(test, {status: 'failed', message: e.message});
                return;
            }
            unitTester.notify(test, {status: 'success'});
        });
    }).on("error", (err) => {
        unitTester.notify(test, {status: 'fatal', message: err});
    });
}

async function testCreateRoom(unitTester, test){
    const data = JSON.stringify({ type: "create_room",
                                    room_name: "Stefans room",
                                    score_limit: "5",
                                    max_players: "5",
                                    password: "" });
    const options = {
        hostname: 'localhost',
        port: 8081,
        path: '/rooms',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'session': 'Mm40Y2V3ZXRlc3QwMTU4OTIzNDM5NDk1NmRobWF1Mms='
        },
        body: {
            type: "create_room",
            room_name: "Stefans room",
            score_limit: "5",
            max_players: "5",
            password: ""
        }
    };

    const req = http.request(options, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            try{
                assert(JSON.parse(data).success === true, false);
            }
            catch (e) {
                unitTester.notify(test, {status: 'failed', message: e.message});
                return;
            }
            unitTester.notify(test, {status: 'success'});
        });
    }).on("error", (err) => {
        unitTester.notify(test, {status: 'fatal', message: err});
    });

    req.write(data);
    req.end();
}

module.exports.EndGame=EndGame;
module.exports.GetPlayersFromRoom=GetPlayersFromRoom;
module.exports.GetRooms=GetRooms;
module.exports.testGameStarted=testGameStarted;
module.exports.testAIGetCard = testAIGetCard;
module.exports.GetBlackCard=GetBlackCard;
module.exports.GetWhiteCards=GetWhiteCards;
module.exports.GameHandler=GameHandler;
module.exports.testGetHostedRooms = testGetHostedRooms;
module.exports.testCreateRoom = testCreateRoom;
module.exports.testAIGetCard1 = testAIGetCard1;
module.exports.testAITrain = testAITrain;
module.exports.testAIGetProbability = testAIGetProbability;
module.exports.testAISetProbability = testAISetProbability;