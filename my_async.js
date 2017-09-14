'use strict';
/**
    @file my_async.js
    @author Ninad U. Vadujkar
*/
const _ = require('lodash');
module.exports.parallel = parallelAsync;
module.exports.series = seriesAsync;
module.exports.each = each;
module.exports.waterfall = waterfall;
module.exports.parallelLimit = parallelLimit;

/**
 * Async Parallel
 * @description This function gets an array of functions and executes them in parallel
 * @param {Object[]} funcs - Array of functions
 * @param {callback} cb - Callback returning either error or array of results
 * @return {Object[]} results 
 */
function parallelAsync(funcs, cb) {
    // Get the length of array
    let length = funcs.length;
    let results = [];
    // Fire all the async operations and wait for each of them to finish
    // Fill the array with results as each on of them gets over
    // Return the array
    // Note: Using 'let' here allows us to retain value of `i` in each iteration
    for(let i = 0; i < funcs.length; i++) {
        funcs[i]((err, resp) => {
            if(err) {
                return cb(err, null);
            }
            length--;
            //console.log(resp);
            results[i] = resp;
            if (!length) {
                return cb(null, results);
            }        
        });     
    }
}

/**
 * Async Series
 * @description This function gets an array of functions and executes them in series
 * @param {Object[]} funcs - Array of functions
 * @param {callback} cb - Callback returning either error or array of results
 * @return {Object[]} results 
 */
function seriesAsync(funcs, cb) {
    let results = [];
    // Deep clone the funcs array as we don't want to modify the input funcs array
    var clonedFuncsArr = _.cloneDeep(funcs);
    processSeries(clonedFuncsArr, results, (err, resp) => {
        if(err) {
            return cb(err, null);
        }
        return cb(null, resp);
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

/**
 * Async Each
 * @description This function gets an array and calls a callback for each item of the array. Returns final error or success via callback when done
 * @param {Object[]} arr - Array containing data
 * @param {callback} cb1 - Callback getting called for each item
 * @param {callback} cb2 - Final callback
 */
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

/**
 * Async Waterfall
 * @description This function gets an array of functions and executes them in series. Each function returns data via callback that becomes the args for next function
 * @param {Object[]} funcs - Array of functions
 * @param {callback} cb - Callback returning either error or result returned by last function in array
 */
function waterfall(funcs, cb) {
    // Deep clone the funcs array as we don't want to modify the input funcs array
    var clonedFuncsArr = _.cloneDeep(funcs);
    processWaterfall(clonedFuncsArr, [], (err, resp) => {
        if(err) {
            return cb(err, null);
        }
        return cb(null, resp);
    });
}

function processWaterfall(funcs, nextData, callback) {
    // Shift out each function
    let f = funcs.shift();
    // When we have shifted out all functions return the final result
    if(!f) {
        return callback(null, nextData[0]);
    }
    // Execute each function and keep on calling processWaterfall recursively
    // until we are done with executing all functions in waterfall.
    nextData.push((...args) => {
        if(args[0]) {
            return callback(args[0], null);
        }
        var nextData = [];
        for(var i = 1; i < args.length; i++) {
            nextData.push(args[i]);
        }
        return processWaterfall(funcs, nextData, callback);
    });
    f.apply(null, nextData);
}

/**
 * Async Parallel Limit
 * @description This function gets an array of functions and executes them in parallel (max number of parallel executions defined by limit)
 * @param {Object[]} funcs - Array of functions
 * @param {Number} limit - Limit specifying max no. of parallel operations at a time
 * @param {callback} cb - Callback returning either error or array of results
 * @return {Object[]} results 
 */
function parallelLimit(funcs, limit, cb) {
    let results = [];
    // Fire all the async operations and wait for each of them to finish
    // Fill the array with results as each on of them gets over
    // Return the array
    let curr = 1;
    console.log('limit ' + limit);
    // Deep clone the funcs array as we don't want to modify the input funcs array
    var clonedFuncsArr = _.cloneDeep(funcs);
    processParallelLimit(curr, limit, clonedFuncsArr, results, (err, resp) => {
        if(err) {
            return cb(err, null);
        }
        return cb(null, resp);
    });    
}

function processParallelLimit(curr, limit, funcs, results, cb) {
    if(funcs.length === 0) {
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
        });
        curr++;
    }   
}
