var nodeThinkGear = require('node-thinkgear');

var tgClient = nodeThinkGear.createClient({
    appName: 'My Great Application',
    appKey: '1234567890abcdef...'
});

tgClient.on('data',function(data){

    if(data.eSense)
    console.log(data.eSense);


    if(data.eSense.attention > 50 && data.eSense.meditation > 50 && data.eegPower.delta < 15000)
        console.log(data);
    
});

tgClient.connect();


