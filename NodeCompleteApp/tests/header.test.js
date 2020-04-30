const PUPPETEER = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');
let BROWSER, PAGE;

beforeEach(async () => {
    BROWSER = await PUPPETEER.launch({
        headless: false
    });
    PAGE = await BROWSER.newPage();
    await PAGE.goto('localhost:3000');

});

afterEach(async () => {
    await BROWSER.close();
});

test('Check if header has correct text', async() => {
    const text = await PAGE.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
});

test('Check if we call google api', async() => {
    await PAGE.click('.right a');
    const URL = await PAGE.url();
    expect(URL).toMatch(/accounts\.google\.com/);
});


test('When signed in show logout button', async () => {
    const user = await userFactory();
    const {session, sig} = await sessionFactory(user);

    await PAGE.setCookie({name: 'session', value: session});
    await PAGE.setCookie({name: 'session.sig', value: sig});
    await PAGE.goto('localhost:3000');
    await PAGE.waitFor('a[href="/auth/logout"]');

    const text = await PAGE.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    expect(text).toEqual('Logout');
});
