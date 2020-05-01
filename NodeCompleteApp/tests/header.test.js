const Page = require('./helpers/page');

let PAGE;

beforeEach(async () => {
   PAGE = await Page.build();
    await PAGE.goto('http://localhost:3000');

});

afterEach(async () => {
    await PAGE.close();
});

test('Check if header has correct text', async() => {
    const text = await PAGE.getContentOf('a.brand-logo');
    expect(text).toEqual('Blogster');
});

test('Check if we call google api', async() => {
    await PAGE.click('.right a');
    const URL = await PAGE.url();
    expect(URL).toMatch(/accounts\.google\.com/);
});


test('When signed in show logout button', async () => {
    await PAGE.login();
    const text = await PAGE.getContentOf('a[href="/auth/logout"]');
    expect(text).toEqual('Logout');
});
