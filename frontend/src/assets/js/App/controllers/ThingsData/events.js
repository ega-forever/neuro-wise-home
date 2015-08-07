angular.module('RrAppThingsEvents', [])
    .factory('thingsEvents', function () {


        var eventList = {
            'led': {
                'turned_on': function (_this, data) {
                   return _this.info.toggleState = true;
                },
                'turned_off': function(_this, data){
                  return  _this.info.toggleState = false;
                },
                'grid': function(_this, data){
                    if(data == null)
                    return;

                            _this.info = data;
                        _this.disabled = false;
                    return _this;
                }
            },


            'demo': {
                'ping': function (_this, data) {
                    console.log('ping');
                    _this.disabled = false;
                },
                'grid': function(_this, data){
                    if(data == null)
                    return;

                    _this.info = data;
                    _this.disabled = false;
                }
            }

        }


        return {
            events: eventList
        }
    });