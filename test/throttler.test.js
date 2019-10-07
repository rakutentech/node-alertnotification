const throttler = require('../lib/throttler');
const dotenv = require('dotenv');
dotenv.config()
const err = new EvalError('Test Throttling');

test('should throttle the error and clear', async() => {

    await throttler.clearAllThrottling();
    await throttler.throttleError(err);
    ent = await throttler.getThrottledEntry(err);
    expect(ent.value).toBeDefined();
    await throttler.clearAllThrottling();
})
test('should check throttling both true and false case ', async() => {
    await throttler.clearAllThrottling();
    await throttler.throttleError(err);
    expect(await throttler.isThrottled(err)).toBeTruthy();
    await throttler.clearAllThrottling();
    expect(await throttler.isThrottled(err)).toBeFalsy();
})

test('should clear only the specify throttling', async() => {
    await throttler.clearAllThrottling();
    extrErr1 = new Error('extra erro1')
    extrErr2 = new Error('extra error2')
    await throttler.throttleError(err);
    await throttler.throttleError(extrErr1);
    await throttler.throttleError(extrErr2);
    expect(await throttler.isThrottled(err)).toBeTruthy();
    expect(await throttler.isThrottled(extrErr1)).toBeTruthy();
    expect(await throttler.isThrottled(extrErr2)).toBeTruthy();
    await throttler.clearThrottling(extrErr1)

    expect(await throttler.isThrottled(err)).toBeTruthy();
    expect(await throttler.isThrottled(err)).toBeTruthy();
    expect(await throttler.isThrottled(extrErr1)).toBeFalsy();

    await throttler.clearAllThrottling();
    expect(await throttler.isThrottled(err)).toBeFalsy();
    expect(await throttler.isThrottled(extrErr2)).toBeFalsy();
})