// glowna klasa do tworzenia elementow html
class UIComponent {
    //konstruktor dziala kiedy uzywamy new
    constructor(tag, props = {}, children = []) {
        //tworzymy pusty element, zapisujemy wartosci,
        // zapisujemy co ma byc WEWNATRZ elementu, uruchomienie fukncji ktora to sklada
        this.element = document.createElement(tag);
        this.props = props;
        this.children = children;
        this.init();
    }

    //funkcja ktora buduje nasz element
    init() {
        //jesli tekst to wrzuc do srodka elementu
        if (this.props.text) this.element.textContent = this.props.text;
        //jesli klasa CSS to dodajemy
        if (this.props.className) this.element.className = this.props.className;
        //jesli id to dodajemy
        if (this.props.id) this.element.id = this.props.id;
        //jesli mamy atrybuty
        if (this.props.attrs) {
            //petla po wszystkich atrybutach
            for (let [key, value] of Object.entries(this.props.attrs)) {
                //sprawdzamy czy to funkcja np onclick
                if (key.startsWith('on') && typeof value === 'function') {
                    //usuwamy 'on' zeby listener dzialal
                    this.element.addEventListener(key.substring(2).toLowerCase(), value);
                } else {
                    //jesli nie funkcja to atrybut
                    this.element.setAttribute(key, value);
                }
            }
        }
        //ify na kazda sytuacje nasz komponent,element stworzony przez js,zwykly tekst
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
    //wrzuca element na strone
    mount(parent) {
        parent.appendChild(this.element);
    }
}
//wrzucenie wszysktich linkow i skryptow naraz
class PageManager {
    //tworzymy <head>
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
        //petla ktora wrzuca kazdy plik css do naszego head
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
        //petla do ladowania skryptow !! LADUJEMY PO ZBUDOWANIU STRONY !! inaczej nie dzialalo
        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            script.async = false; // to pozwala na zachowanie kolejnosci skryptow
            document.body.appendChild(script);
        });
    }
}

class Header extends UIComponent {
    constructor() {
        //super czyli wywolujemy konstruktor klasy bazowej czyli tworzymy nowy element
        super('header', {}, [
            //logo
            new UIComponent('a', { className: 'img-container', attrs: { href: '/' } }, [
                new UIComponent('img', { attrs: { src: '/assets/images/sknerus.png', alt: 'logotyp' } })
            ]),
            //nav na kompy
            new UIComponent('nav', { className: 'nav-desktop f-comic f-big' }, [
                Header.createNavLink('/kalkulator', 'Kalkulator podróży'),
                Header.createNavLink('/lista-krajow', 'Listy Krajów')
            ]),
            //zrobilem tego diva zeby byl odstep na stronie
            new UIComponent('div', { className: 'space' }),

            //ligt-dark mode przycisk
            new UIComponent('a', {
                className: 'img-container',
                attrs: { href: 'javascript:void(0)', onclick: 'switchTheme()' }
            }, [
                new UIComponent('img', { id: 'theme-icon', attrs: { src: '/assets/images/theme-light.webp', alt: 'motyw strony' } })
            ]),
            
            //hamburger dla menu na telefonie
            new UIComponent('input', { id: 'nav-check', attrs: { type: 'checkbox' } }),
            new UIComponent('label', { className: 'nav-button', attrs: { for: 'nav-check' } }, [
                new UIComponent('i', { className: 'fas fa-bars' })
            ]),

            //nav dla telefonow
            new UIComponent('nav', { className: "nav-mobile f-comic f-big" }, [
                new UIComponent('a', { text: 'Strona główna', attrs: { href: '/' } }),
                new UIComponent('a', { text: 'Kalkulator podróży', attrs: { href: '/kalkulator' } }),
                new UIComponent('a', { text: 'Listy Krajów', attrs: { href: '/lista-krajow' } })
            ])
        ]);
    }
    //funckja pomocniczna wczesniej musialem pisac to samo kilkanascie razy jak linkowalem nava
    static createNavLink(href, text) {
        return new UIComponent('a', { className: 'nav-link-container', attrs: { href: href } }, [
            new UIComponent('span', { text: text })
        ]);
    }
}
//mozna powiedziec ze body glowny formularz i opis
class MainContent extends UIComponent {
    constructor() {
        super('main', {}, [
            new UIComponent('p', { className: 'description', text: 'Nawet Sknerus McKwacz dba o to, żebyś wiedział ile płacisz. Przelicz walutę przed wizytą — zero ukrytych kosztów.' }),

            //glowny formularz
            new UIComponent('section', { className: 'table' }, [
                new UIComponent('form', { id: 'calc-form', className: 'main-form' }, [
                    new UIComponent('h1', { className: 'form-h1', text: 'Przelicznik walut' }),

                    //gorny input do wpisywania kwot
                    new UIComponent('div', { className: 'input-group' }, [
                        new UIComponent('label', { attrs: { for: 'amount', style: 'display:none;' }, text: 'Kwota' }),
                        new UIComponent('input', { id: 'amount', className: 'top-input', attrs: { type: 'text', name: 'amount', maxlength: '16', inputmode: 'decimal', placeholder: 'Wpisz kwotę', required: true } }),
                        new UIComponent('select', { id: 'origin', className: 'input-group-select', attrs: { name: 'origin', required: true } }, [
                            new UIComponent('option', { text: 'Wybierz Kraj', attrs: { value: '' } })
                        ])
                    ]),

                    //przycisk zamiany
                    new UIComponent('button', {
                        className: 'change',
                        attrs: { type: 'submit', onclick: 'switchOriginTarget()' }
                    }, [
                        new UIComponent('span', { className: 'material-symbols-outlined', text: 'swap_horiz' })
                    ]),

                    //dolny input
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

class App extends UIComponent {
    constructor() {
        //tworzymy glowny pojemnik na wszystkie elementy i wywolujemy uklad strony
        super('div', { className: 'main-wrapper' });
        this.initLayout();
    }

    initLayout() {
        //wywolanie naszyego szkieletu
        const header = new Header();
        const main = new MainContent();
        //przypisanie go jako dzieci glownego pojemnika
        this.children = [header, main];
        //dodajemy wygenerowane elementy do pojemnika
        this.element.appendChild(header.element);
        this.element.appendChild(main.element);
    }
}
//DOMContentLoaded - czeka az cala strona sie zaladuje (pusta)
document.addEventListener('DOMContentLoaded', () => {
    //ladujemy header i css
    PageManager.initHead();
    //generujemy nasze glowne elementy
    const app = new App();
    //pakujemy to wszystko do body
    app.mount(document.body);
    //na samym koncu ladujemy js bo inaczej nie dziala
    PageManager.loadScripts();
});