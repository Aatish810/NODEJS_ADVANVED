const Page = require('./helpers/page');

let PAGE;

beforeEach(async () => {
   PAGE = await Page.build();
    await PAGE.goto('localhost:3000');

});

afterEach(async () => {
    await PAGE.close();
});


describe('When Logged in', async () => {
    beforeEach(async() => {
        await PAGE.login();
        await PAGE.click('a.btn-floating');
    });

    test('After login checking if correct form opens to add blog', async ()=> {
        const label = await PAGE.getContentOf('form label');
        expect(label).toEqual('Blog Title');
    });

    describe('And using invalid inputs', async () => {
        beforeEach(async() => {
            await PAGE.click('form button');
        });

        test('the form shows error message', async () => {
            const titleError = await PAGE.getContentOf('.title .red-text');
            const contentError = await PAGE.getContentOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        });
    });

    describe('And using valid inputs', async () => {
        beforeEach(async() => {
            await PAGE.type('.title input', 'My Title');
            await PAGE.type('.content input', 'Some dummy content for test suite')
            await PAGE.click('form button');
        });

        test('submitting takes to review screen', async () => {
            const text = await PAGE.getContentOf('h5');
            expect(text).toEqual('Please confirm your entries');
        });

        test('submitting then saving add blog to index', async () => {
            await PAGE.click('button.green');
            await PAGE.waitFor('.card');
            const title = await PAGE.getContentOf('.card-title');
            const content = await PAGE.getContentOf('p');
            expect(title).toEqual('My Title');
            expect(content).toEqual('Some dummy content for test suite');
        });
    });
});

describe('When user is not logged in', async () => {
    test('User cannot create blog posts', async () => {
        const result = await PAGE.post('api/blogs', { title: 'My Other title', content: 'Trial version for test suite' })
        expect(result).toEqual({error: 'You must log in!'});
    });

    test('User cannot get blogs', async () => {
        const result = await PAGE.get('api/blogs',);
        expect(result).toEqual({error: 'You must log in!'});
    });
});
