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

        if (this.props.attrs) {
            for (let [key, value] of Object.entries(this.props.attrs)) {
                if (key.startsWith('on')) {
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
            }
        });
    }

    mount(parent) {
        parent.appendChild(this.element);
    }
}

class PageManager {
    static init() {
        const head = document.head;

        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = '/assets/images/favicon.ico'
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

        const scripts = [
            '/src/js/theme.js', '/src/js/constants.js',
            '/src/js/countries.js', '/src/js/exchange.js', '/src/js/currencies.js'
        ];

        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            this.head.appendChild(script);
        })

        document.title = "Kantor Sknerusa McKwacza";
    }
}

class Header extends UIComponent{
    constructor() {
        super('header', {}, [
            new UIComponent('a', { className: 'img-container', attrs: { href: '/' } }, [
                new UIComponent('img', { attrs: { src: '/assets/images/sknerus.png', alt: 'logotyp' } })
            ]),
            new UIComponent('nac', { className: 'nav-desktop f-comic f-big' }, [
                this.createNavLink('/', 'Strona główna'),
                this.createNavLink('/kalkulator', 'Kalkulator podróży'),
                this.createNavLink('/lista-krajow', 'Listy Krajów')
            ]),
            new UIComponent('div', { className: 'space' }),
            new UIComponent('a', {
                className: 'img-container',
                attrs: { href: 'javascript:void(0)', onclick: () => window.switchTheme?.() }
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

    static createNavLink(href,text) {
        return new UIComponent('a', { className: 'nav-link-container', atrrs: { href: href } }, [
            new UIComponent('span', { text: text })
        ]);
    }
}

class App extends UIComponent {
    constructor() {
        super('div', { className: 'main-wrapper' });
        this.initLayout();
    }

    initLayout() {
        const header
    }
}