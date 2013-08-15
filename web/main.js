
var ObjectID = require('mongodb').ObjectID;


module.exports = function (persist) {

    return {

        /**
         * Display default task page.
         */
        index: function (req, res) {
            console.log("/main/index");
            res.render('main.ejs', { locals : { title: 'working' } });            
        }
    }
};

