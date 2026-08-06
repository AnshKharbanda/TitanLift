const svg = document.getElementById("roadmap-svg");

function point(el, side) {

    const roadmap = document.querySelector(".roadmap");

    const rr = roadmap.getBoundingClientRect();
    const r = el.getBoundingClientRect();

    switch (side) {

        case "right":
            return {
                x: r.right - rr.left,
                y: r.top - rr.top + r.height / 2
            };

        case "left":
            return {
                x: r.left - rr.left,
                y: r.top - rr.top + r.height / 2
            };

    }

}

function connector(startEl, endEl, reverse = false) {

    const start = point(startEl, reverse ? "left" : "right");
    const end = point(endEl, reverse ? "right" : "left");

    const midY = (start.y + end.y) / 2;

    const offset = reverse ? -120 : 120;

    const d = `
        M ${start.x} ${start.y}

        Q ${start.x + offset} ${start.y}
          ${start.x + offset} ${midY}

        Q ${start.x + offset} ${end.y}
          ${end.x} ${end.y}
    `;

    const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );

    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#FFDF54");
    path.setAttribute("stroke-width", "4");
    path.setAttribute("stroke-dasharray", "10 10");
    path.setAttribute("stroke-linecap", "round");

    svg.appendChild(path);

}

function drawRoadmap() {

    svg.innerHTML = "";

    const roadmap = document.querySelector(".roadmap");

    svg.setAttribute(
        "viewBox",
        `0 0 ${roadmap.offsetWidth} ${roadmap.offsetHeight}`
    );

    const why = document.querySelector(".why-box");

    const f1 = document.querySelector("#feature1 .feature-card");
    const f2 = document.querySelector("#feature2 .feature-card");
    const f3 = document.querySelector("#feature3 .feature-card");
    const f4 = document.querySelector("#feature4 .feature-card");

    connector(why, f1, false);
    connector(f1, f2, true);
    connector(f2, f3, false);
    connector(f3, f4, true);

}

window.addEventListener("load", drawRoadmap);
window.addEventListener("resize", drawRoadmap);