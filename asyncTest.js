'use strict';
let async = require('./my_async');

var funcs = [
    (cb) => {
        setTimeout(() => {
            cb(null, 'one');
        }, 5000)
    },
    (cb) => {
        setTimeout(() => {
            cb(null, 'two');
        }, 3000)
    },
    (cb) => {
        setTimeout(() => {
            cb(null, 'three');
        }, 1000)
    },
    (cb) => {
        setTimeout(() => {
            cb(null, 'four');
        }, 2000)
    }
];

let arr = [1, 2, 3, 4, 5];
/*console.log("Testing parallel execution!!!");
async.parallel(funcs, function(err, res) {
    if(err) throw err;
    console.log(res);
    console.log("Testing series execution!!!");
    async.series(funcs, function(err, res) {
        if(err) throw err;
        console.log(res);
        console.log("Testing parallel limit execution!!!");
        async.parallelLimit(funcs, 2, function(err, resp) {
            if(err) throw err;
            console.log(resp);
        });
    });
});*/

async.each(arr, (i, callback) => {
    setTimeout(() => {
        console.log("Value of i " + i);
        //if(i == 2) return callback(true);
        return callback();
    }, 1000);
}, (err) => {
    if(err) {
        throw err;
    }
    console.log("Done!!!");
});