class UIComponent {
    constructor(tag, props = {}, children = []) {
        this.element = document.createElement(tag);
        this.props = props;
        this.children = children;
        this.init();
    }

    init() {
        if (this.props.text) this.element.textContent = this.props.text;
        if (this.props.className) this.element.className = this.props.className;

        if (this.props.id) this.element.id = this.props.id;

        if (this.props.attrs) {
            for (let [key, value] of Object.entries(this.props.attrs)) {
                if (key.startsWith('on') && typeof value === 'function') {
                    this.element.addEventListener(key.substring(2).toLowerCase(), value);
                } else {
                    this.element.setAttribute(key, value);
                }
            }
        }

        this.children.forEach(child => {
            if (child instanceof UIComponent) {
                this.element.appendChild(child.element);
            } else if (child instanceof HTMLElement) {
                this.element.appendChild(child);
            } else if (typeof child === 'string') {
                this.element.appendChild(document.createTextNode(child));
            }
        });
    }

    mount(parent) {
        parent.appendChild(this.element);
    }
}

class PageManager {
    static initHead() {
        const head = document.head;
        document.title = "Kantor Sknerusa McKwacza";

        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = '/assets/images/favicon.ico';
        head.appendChild(favicon);

        const styles = [
            '/src/css/style.css',
            '/src/css/calculator.css',
            '/src/css/exchange.css',
            '/src/css/screen.css',
            'https://use.fontawesome.com/releases/v5.15.1/css/all.css',
            'https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap',
            'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=swap_horiz'
        ];

        styles.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            head.appendChild(link);
        });
    }

    static loadScripts() {
        const scripts = [
            '/src/js/theme.js', '/src/js/constants.js',
            '/src/js/countries.js', '/src/js/exchange.js', '/src/js/currencies.js'
        ];

        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            script.async = false;
            document.body.appendChild(script);
        });
    }
}

class Header extends UIComponent {
    constructor() {
        super('header', {}, [
            new UIComponent('a', { className: 'img-container', attrs: { href: '/' } }, [
                new UIComponent('img', { attrs: { src: '/assets/images/sknerus.png', alt: 'logotyp' } })
            ]),
            new UIComponent('nav', { className: 'nav-desktop f-comic f-big' }, [
                Header.createNavLink('/', 'Strona główna'),
                Header.createNavLink('/kalkulator', 'Kalkulator podróży'),
                Header.createNavLink('/lista-krajow', 'Listy Krajów')
            ]),
            new UIComponent('div', { className: 'space' }),
            new UIComponent('a', {
                className: 'img-container',
                attrs: { href: 'javascript:void(0)', onclick: 'switchTheme()' }
            }, [
                new UIComponent('img', { id: 'theme-icon', attrs: { src: '/assets/images/theme-light.webp', alt: 'motyw strony' } })
            ]),
            new UIComponent('input', { id: 'nav-check', attrs: { type: 'checkbox' } }),
            new UIComponent('label', { className: 'nav-button', attrs: { for: 'nav-check' } }, [
                new UIComponent('i', { className: 'fas fa-bars' })
            ]),
            new UIComponent('nav', { className: "nav-mobile f-comic f-big" }, [
                new UIComponent('a', { text: 'Strona główna', attrs: { href: '/' } }),
                new UIComponent('a', { text: 'Kalkulator podróży', attrs: { href: '/kalkulator' } }),
                new UIComponent('a', { text: 'Listy Krajów', attrs: { href: '/lista-krajow' } })
            ])
        ]);
    }

    static createNavLink(href, text) {
        return new UIComponent('a', { className: 'nav-link-container', attrs: { href: href } }, [
            new UIComponent('span', { text: text })
        ]);
    }
}

class MainContent extends UIComponent {
    constructor() {
        super('main', {}, [
            new UIComponent('p', { className: 'description', text: 'Nawet Sknerus McKwacz dba o to, żebyś wiedział ile płacisz. Przelicz walutę przed wizytą — zero ukrytych kosztów.' }),
            new UIComponent('section', { className: 'table' }, [
                new UIComponent('form', { id: 'calc-form', className: 'main-form' }, [
                    new UIComponent('h1', { className: 'form-h1', text: 'Przelicznik walut' }),

                    new UIComponent('div', { className: 'input-group' }, [
                        new UIComponent('label', { attrs: { for: 'amount', style: 'display:none;' }, text: 'Kwota' }),
                        new UIComponent('input', { id: 'amount', className: 'top-input', attrs: { type: 'number', name: 'amount', placeholder: 'Wpisz kwotę', required: true } }),
                        new UIComponent('select', { id: 'origin', className: 'input-group-select', attrs: { name: 'origin', required: true } }, [
                            new UIComponent('option', { text: 'Wybierz Kraj', attrs: { value: '' } })
                        ])
                    ]),

                    new UIComponent('button', {
                        className: 'change',
                        attrs: { type: 'submit', onclick: 'switchOriginTarget()' }
                    }, [
                        new UIComponent('span', { className: 'material-symbols-outlined', text: 'swap_horiz' })
                    ]),

                    new UIComponent('div', { className: 'input-group' }, [
                        new UIComponent('output', { id: 'result', className: 'bottom-input', text: '0.00', attrs: { for: 'amount', name: 'result' } }),
                        new UIComponent('select', { id: 'target', className: 'input-group-select', attrs: { name: 'target', required: true } }, [
                            new UIComponent('option', { text: 'Wybierz Kraj', attrs: { value: '' } })
                        ])
                    ])
                ])
            ])
        ]);
    }
}

class Footer extends UIComponent {
    constructor() {
        super('footer');
    }
}

class App extends UIComponent {
    constructor() {
        super('div', { className: 'main-wrapper' });
        this.initLayout();
    }

    initLayout() {
        const header = new Header();
        const main = new MainContent();
        const footer = new Footer();

        this.children = [header, main, footer];

        this.element.appendChild(header.element);
        this.element.appendChild(main.element);
        this.element.appendChild(footer.element);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    PageManager.initHead();

    const app = new App();
    app.mount(document.body);
    PageManager.loadScripts();
});