const assert = require('assert');
const path = require('path');
const {Application} = require('spectron');
const baseDir = path.join(__dirname, '..');
const electronPath = path.join(baseDir, 'node_modules', '.bin', 'electron');

describe('Application launch', function () {
    this.timeout(10000);

    const app = new Application({
        path: electronPath,
        args: [baseDir]
    });

    beforeEach(() => app.start());

    afterEach(() => app.stop());

    it('Shows an initial window', async () => {
        const count = await app.client.getWindowCount();
        assert.equal(count, 1)
    })
});
