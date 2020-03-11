const Cache = require('async-disk-cache');
const debug = require('debug');

const cache = new Cache(process.env.THROTTLING_CACHE_KEY, { "location": "/tmp/cache" });


/**
 * Throttle the given error
 * @param {Error}  Error
 */
exports.throttleError = async(err) => {
    let todayDatetime = new Date();
    await cache.set(err.toString(), todayDatetime).then(function() {
        debug("Throttle : " + err.toString());
    });
}

/**
 * Get throttling duration from configuration. If it is not set the default vlaue (5) will be used.
 * 
 * @returns {number} : milli second
 */
getThrottlingDuration = () => {
    let throttlingDuration = 5; //default value(minutes)
    if (process.env.THROTTLING_DURATION) {
        throttlingDuration = parseInt(process.env.THROTTLING_DURATION);
    }
    throttlingDuration = throttlingDuration * 60 * 100;
    return throttlingDuration;
}

/**
 * Check if the given error has been throttled.
 * @returns {boolean} true: throttled,
 * @returns {boolean} false: has not throttled
 */
exports.isThrottled = async(err) => {
    // try to get cache entry with error as key
    cacheKey = err.toString();
    let cacheEntry = await cache.get(cacheKey);
    if (cacheEntry.isCached) {
        cachedTime = new Date(cacheEntry.value);
        currentTime = new Date();
        duration = currentTime - cachedTime

        if (duration > getThrottlingDuration()) {
            await this.clearThrottling(err).then(this.throttleError(err));
            return false;
        }
        return true;
    }
    await this.throttleError(err)
    return false;
}

/**
 * Get the throttled error from disk cache entry
 * @param  Error err
 */
exports.getThrottledEntry = async(err) => {

    let entry = await cache.get(err.toString());
    return entry;
}

/**
 * Clear all throttling error from disk cache
 */
exports.clearAllThrottling = async() => {
    await cache.clear();
    debug("All Throttling has been cleared.!");
}

/**
 * 
 * @param  Error  err
 */
exports.clearThrottling = async(err) => {
    await cache.remove(err.toString());
    debug("Clear throttling for : " + err.toString());
}