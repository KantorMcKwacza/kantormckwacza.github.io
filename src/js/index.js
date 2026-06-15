// klasa bazowa
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

// pliki
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
            'https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap'
        ];
        
        styles.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            head.appendChild(link);
        });
    }

    static loadScripts() {
        // skrypty
        const scripts = [
            '/src/js/theme.js', 
            '/src/js/constants.js',
            '/src/js/countries.js', 
            '/src/js/currencies.js',
            '/src/js/expenses.js',
            '/src/js/exchange.js',
            '/src/js/calculator.js'
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

// naglowek
class Header extends UIComponent {
    constructor() {
        super('header', {}, [
            new UIComponent('a', { className: 'img-container', attrs: { href: '/' } }, [
                new UIComponent('img', { attrs: { src: '/assets/images/sknerus.png', alt: 'logotyp' } })
            ]),
            new UIComponent('nav', { className: 'nav-desktop f-comic f-big' }, [
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

// kalkulator
class MainContent extends UIComponent {
    constructor() {
        super('main', {}, [
            new UIComponent('section', {}, [
                

                new UIComponent('table', { id: 'expenses-table', className: 'exp-table' }, [
                new UIComponent('h1', { className: 'f-comic f-big', text: 'Kalkulator podróży' }),


                    new UIComponent('thead', { className: 'f-note f-big' }, [
                        new UIComponent('tr', {}, [
                            new UIComponent('th', { text: 'Nr' }),
                            new UIComponent('th', { text: 'Kraj' }),
                            new UIComponent('th', { text: 'Nazwa Wydatku' }),
                            new UIComponent('th', { text: 'Koszt' }),
                            new UIComponent('th', { text: 'Waluta' })
                        ])
                    ]),
                    new UIComponent('tbody', { id: 'expenses-table-body', className: 'f-note f-small' }),
                    new UIComponent('tfoot', { className: 'f-note' }, [
                        new UIComponent('tr', {}, [
                            new UIComponent('th', {}, [
                                new UIComponent('button', { className: 'btn-add-main', attrs: { onclick: 'expenses.showExpenseForm()' } }, [
                                    new UIComponent('span', { text: '+' })
                                ])
                            ]),
                            new UIComponent('th', { className: 'f-normal', text: 'Suma wydatków:' }),
                            new UIComponent('th', { id: 'sum-value', className: 'f-normal', text: '0' }),
                            new UIComponent('th', { className: 'f-normal' }, [
                             new UIComponent('button', { 
                            className: 'btn-clear-table f-note', text: 'Wyczyść wszystko',attrs: { onclick: 'expenses.clearAllExpenses()' } 
    })
]),
                            new UIComponent('th', { className: 'f-note f-small' }, [
                                new UIComponent('select', { id: 'currency', attrs: { name: 'currency', required: 'true' } }, [
                                    new UIComponent('option', { text: 'polski złoty', attrs: { value: 'PLN' } })
                                ])
                            ])
                        ])
                    ])
                ]),

                new UIComponent('div', { id: 'new-expense', attrs: { hidden: 'true' } }, [
                    new UIComponent('div', { className: 'foreground-container f-note' }, [
                        new UIComponent('form', { id: 'expense-form', className: 'new-entry-form', attrs: { method: 'post' } }, [
                            new UIComponent('button', { 
                                className: 'exit-button f-note', 
                                attrs: { type: 'button', onclick: 'expenses.hideExpenseForm()' },
                                text: 'x'
                            }),
                            new UIComponent('h2', { text: 'Nowy Wydatek' }),
                            new UIComponent('div', { 
                                id: 'currency-warning', 
                                className: 'f-note', 
                                attrs: { style: 'color: #ff4d4d; font-size: 0.9rem; margin-bottom: 10px; text-align: center;', hidden: 'true' } 
                            }),
                            new UIComponent('select', { id: 'country', className: 'new-entry-form-select f-note', attrs: { name: 'country', required: 'true' } }, [
                                new UIComponent('option', { text: 'Wybierz Kraj', attrs: { value: '' } })
                            ]),
                            new UIComponent('input', { 
                                id: 'name', 
                                className: 'new-entry-form-input', 
                                attrs: { type: 'text', name: 'name', placeholder: 'Nazwa Wydatku (max 40)', maxlength: '40', required: 'true' } 
                            }),
                            new UIComponent('div', { className: 'new-entry-form-value-container' }, [
                                new UIComponent('input', { 
                                    id: 'value', 
                                    className: 'new-entry-form-input', 
                                    attrs: { 
                                        type: 'number', 
                                        name: 'value', 
                                        placeholder: 'Koszt Wydatku', 
                                        max: '999999999',
                                        oninput: 'if(this.value.length > 9) this.value = this.value.slice(0, 9);',
                                        required: 'true' 
                                    } 
                                }),
                                new UIComponent('input', { 
                                    id: 'currencyName', 
                                    className: 'new-entry-form-output', 
                                    attrs: { type: 'text', name: 'currencyName', value: '-', disabled: 'true' } 
                                })
                            ]),
                            new UIComponent('input', { id: 'currencySymbol', attrs: { type: 'text', name: 'currencySymbol', value: '', disabled: 'true', hidden: 'true' } }),
                            new UIComponent('input', { id: 'currencyCode', attrs: { type: 'text', name: 'currencyCode', value: '-', disabled: 'true', hidden: 'true' } }),
                            new UIComponent('button', { className: 'new-entry-form-submit', attrs: { type: 'submit' }, text: 'Dodaj' })
                        ])
                    ])
                ])
            ])
        ]);
    }
}

// footer
class Footer extends UIComponent {
    constructor() {
        super('footer', { className: 'f-note', text: '© 2026 Kantor Sknerusa McKwacza - Projekt na Politechnikę' });
    }
}

// app
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