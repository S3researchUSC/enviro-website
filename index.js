import Heat from "./ui/Heat.js";
import Tree from "./ui/Tree.js";
import { pick, removeChildren, sum, scroll, scrollTop } from "./ui/Utilities.js";


const ELEMENTS = { // Here are the constant elements for the site
    nav: document.body.querySelector("nav"),
    navLinks: Array.from(document.body.querySelectorAll("header > nav > a")),
    sections: new Map(Array.from(document.body.querySelectorAll("section")).map(section => ["#" + section.id, section])),

    tree: document.body.querySelector("#Types .tree"),

    heats: Array.from(document.body.querySelectorAll("#Comparison .heat")),
};

for (let link of ELEMENTS.navLinks) { // Going to the top of each section using the hyperlinks in the menu
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

d3.queue()
    .defer(d3.csv, "data/heatmap_2014.csv")
    .await((error, csv2014) => {
        let formattedHeat = {};
        let states = new Set;
        function parseCSV(csv, year) {
            formattedHeat[year] = Object.values(csv.reduce((accumulator, item) => {
                let state = item["State.ID"];
                states.add(state);
                if (!(state in accumulator))
                    accumulator[state] = {};

                let key = item["Latitude"] + item["Longitude"];
                if (!(key in accumulator[state])) {
                    let x = parseFloat(item["Latitude"]);
                    let y = parseFloat(item["Longitude"]);
                    accumulator[state][key] = {
                        x,
                        y,
                        data: new Heat.Point(x, y),
                    };
                }
                accumulator[state][key].data.add(item["Consolidated.Description"]);
                return accumulator;
            }, {}));
            for (let key in formattedHeat[year])
                formattedHeat[year][key] = Object.values(formattedHeat[year][key]);
        }
        parseCSV(csv2014, 2014);

        function createHeat(container, {state, year}) {
            let heat = new Heat(formattedHeat, {
                container,
                zoom: 7,
                defaultState: state,
                defaultYear: year,
            });
            heat.element.style.setProperty("height", heat.element.offsetWidth + "px");
        }

        let state = pick(Array.from(states));
        createHeat(ELEMENTS.heats[0], {
            state,
            year: "2014",
        });
    });

d3.json("data/tasks.json", json => {
        new Tree(json, {
                container: ELEMENTS.tree,
                width: 800,
                height: 1165,
                margin: {
                        top: 15,
                        right: 90,
                        bottom: 15,
                        left: 135,
                },
        })
});