const ELEMENTS = { // Here is the constant elements for the site
    nav: document.body.querySelector("nav"),
    navLinks: Array.from(document.body.querySelectorAll("header > nav > a")),
    sections: new Map(Array.from(document.body.querySelectorAll("section")).map(section => ["#" + section.id, section])),
};

for (let link of ELEMENTS.navLinks) {
    link.addEventListener("click", event => {
        let section = ELEMENTS.sections.get(event.target.hash);
        if (!section)
            return;
        
        history.pushState({}, "", event.target.href);
        scroll(scrollTop(section), 400);
        event.preventDefault();
    });
}

let navScrollTop = scrollTop(ELEMENTS.nav);
function handleScroll(event) {
    ELEMENTS.nav.classList.toggle("scrolled", scrollTop() - 1 > navScrollTop);
}
window.addEventListener("scroll", handleScroll);
handleScroll();