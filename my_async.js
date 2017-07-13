'use strict';
/**
    @module My simple and thin Async module that covers => 
    parallel, series, parallelLimit and each methods
    @author Ninad U. Vadujkar
*/

module.exports.parallel = parallelAsync;
module.exports.series = seriesAsync;
module.exports.parallelLimit = parallelLimit;
module.exports.each = each;

function each(arr, cb1, cb2) {
    let len = arr.length;
    arr.forEach((i) => {
        return cb1(i, (err, resp) => {
            if(err) {
                return cb2(err, null);
            }
            len--;
            if(!len) {
                return cb2(null, true);
            }
        });
    });
}

function parallelAsync(funcs, cb) {
    // Get the length of array
    let length = funcs.length;
    let results = [];
    // Fire all the async operations and wait for each of them to finish
    // Fill the array with results as each on of them gets over
    // Return the array
    for(let i = 0; i < funcs.length; i++) {
        funcs[i](function(err, resp){
            if(err) {
                return cb(err, null);
            }
            length--;
            console.log(resp);
            results[i] = resp;
            if (!length) {
                return cb(null, results);
            }        
        });      
    }
}

function seriesAsync(funcs, cb) {
    let results = [];
    processSeries(funcs, results, (err, resp) => {
        if(err) {
            return cb(err, null);
        }
        return cb(null, results);
    });
}

function processSeries(funcs, results, cb) {
    // Shift out each function
    let f = funcs.shift();
    // When we have shifted out all functions return the final result
    if(!f) {
        return cb(null, results);
    }
    // Execute each function and keep on calling processSeries recursively
    // until we are done with executing all functions in series.
    f((err, resp) => {
        if(err) {
            return cb(err, null);
        }
        console.log(resp);
        results.push(resp);
        return processSeries(funcs, results, cb);
    });
}

function parallelLimit(funcs, limit, cb) {
    // Get the length of array
    let length = funcs.length;
    let results = [];
    // Fire all the async operations and wait for each of them to finish
    // Fill the array with results as each on of them gets over
    // Return the array
    let curr = 1;
    console.log('limit ' + limit);
    processParallelLimit(curr, limit, funcs, results, (err, resp) => {
        if(err) {
            return cb(err, null);
        }
        return cb(null, resp);
    });    
}

function processParallelLimit(curr, limit, funcs, results, cb) {
    let indexes = [];
    if(funcs.length == 0) {
        return cb(null, results);
    }
    while(curr <= limit) {
        let f = funcs.shift();
        f((err, resp) => {
            if(err) {
                return cb(err, null);
            }
            curr--;
            results.push(resp);
            if(curr == 1) {
                return processParallelLimit(curr, limit, funcs, results, cb);
            }
        })
        curr++;
    }   
}
