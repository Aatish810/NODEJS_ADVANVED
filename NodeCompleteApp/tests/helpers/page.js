const PUPPETEER = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
    static async build() {
        const BROWSER = await PUPPETEER.launch({
            headless: true,
            args: ['--no-sandbos']
        });
        const PAGE = await BROWSER.newPage();
        const customPage = new CustomPage(PAGE);

        return new Proxy(customPage, {
            get: function (target, property) {
                return customPage[property] || BROWSER[property] || PAGE[property];
            }
        })
    }

    constructor(PAGE) {
        this.PAGE = PAGE;
    }

    async login() {
        const user = await userFactory();
        const { session, sig } = await sessionFactory(user);

        await this.PAGE.setCookie({ name: 'session', value: session });
        await this.PAGE.setCookie({ name: 'session.sig', value: sig });
        await this.PAGE.goto('http://localhost:3000/blogs');
        await this.PAGE.waitFor('a[href="/auth/logout"]');

    }

    async getContentOf(selector) {
        return this.PAGE.$eval(selector, el => el.innerHTML);
    }

    get(path) {
        return this.PAGE.evaluate((_path) => {
            return fetch(_path, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json());
        }, path)
    }

    post(path, data) {
        return this.PAGE.evaluate((_path, _data) => {
            return fetch(_path, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(_data)
            }).then(res => res.json());
        }, path, data);
    }

}

module.exports = CustomPage;
