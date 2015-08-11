var fs = require('fs');
var configFilename = '../../appconfig.json';

module.exports = function() {
    var ret = {};
    this.init = function() {

        loadConfigData();

        process.on('config:get', function(pin){
            process.emit('config:get.response', { component: pin, data: ret[pin] })
        });

        process.on('config:push', function(pin){
            var component = Object.keys(pin)[0];
            var entry = pin[component];
            var key = Object.keys(entry)[0];
            var value = entry[key];
            ret[component] = ret[component] || {};// ensure the `component` key exixts
            ret[component][key] = ret[component][key] || [];//config:push always adds to exiting values
            ret[component][key].push(value);
            fs.writeFile('appconfig.json', JSON.stringify(ret, null, 4), function (err) {
                if (err) process.emit('config.error', err);
                else {
                    console.log(component, 'config updated:', ret[component])
                    process.emit('config.'+component+'.change', ret[component]);
                }
            });
        });

        process.on('config:reload', function(pin){
            console.log('reloading config data');
            if(pin) pin.delay = pin.delay || 1;
            loadConfigData();
        });

        function loadConfigData(delay) {
            var delay = delay || 1;
            console.log('loading config data after', delay, 'ms');
            setTimeout(function(){
                var oldConfig = require(configFilename);
                for(key in oldConfig) {
                    ret[key] = oldConfig[key];
                }
                for(key in oldConfig) {
                    // console.log('config.'+key+'.new -> ', oldConfig[key])
                    process.emit('config.'+key+'.new', oldConfig[key])
                }
                fs.watchFile(configFilename, function (curr, prev) {
                    oldConfig = require(configFilename);
                    delete require.cache[require.resolve(configFilename)]
                    var newConfig = require(configFilename);
                    for(key in oldConfig) {
                        if(!newConfig[key] && oldConfig[key]) {
                            process.emit('config.'+key+'.remove')
                        }
                    }
                    for(key in newConfig) {
                        if(newConfig[key] && !oldConfig[key]) {
                            process.emit('config.'+key+'.new', newConfig[key])
                        } else {
                            if(JSON.stringify(newConfig[key]) != JSON.stringify(oldConfig[key])) {
                                process.emit('config.'+key+'.change', newConfig[key])
                                process.emit('config.'+key+'.delta', {before:oldConfig[key], after:newConfig[key]})
                            }
                        }
                    }
                });
                return ret;
            }, delay);
        }
    }
}
