
var glowSize = 0
var menuItems = []
var menuDesc = []

var categoryLocs = []
var palettes = []

selected = -1;

initialSelect = 0; // This is mainly for testing

mobileMenu = true;

window.onload = e => {

    baseURL = location.href

    setup()
    changeGlow()
    clickedItem(initialSelect)

    window.addEventListener("scroll", e => {    
        // Move the connectors
        let eInfo = menuItems[selected].getBoundingClientRect()
    
        let targetY = (eInfo.y + (eInfo.height/2)) - (connector1.style.height /2)
        backgroundPattern.style.backgroundPosition = `0 ${-window.scrollY/4}px`;
        backgroundGradient.style.backgroundPosition = `0 ${-window.scrollY/10}px`;
        connector1.style.top = `${targetY}px`
    
        let c2height = (targetY) - (window.innerHeight/ 2)
        if (c2height > 0) {
            connector2.style.height = `${targetY - (window.innerHeight/ 2)}px`
            connector2.style.top = `${(window.innerHeight/ 2) + 4}px`
        }
        else {
            connector2.style.top = `${targetY}px`
            connector2.style.height = `${((targetY) - (window.innerHeight/ 2)) * -1}px`
        }
        

        // Check which category we are in
        changeBackgroundColor()
    });
}

window.addEventListener("resize", e => {
    showDesc(selected, false)
    changeGlow()
    updateCategoryLocs()

    if (window.innerWidth >= 768) {
        mobileMenu = false;
        toggleDisplay()
    }
});

window.addEventListener("mousemove", e => {
    glow.animate({

        left: `${e.clientX - glowSize/2}px`,
        top: `${e.clientY - glowSize/2}px`
    }, {duration: 3000, fill: "forwards"})
});

var holes

function setup() {

    // This is for the cursor
    holes = document.querySelectorAll(".glowHole")

    setInterval(function() {
        holes.forEach(hole => {
            let w = Math.random() * 50  + 30
            let h = Math.random() * 50 + 10
            hole.animate({
            
                width: `${w}%`,
                height: `${h}%`,
                left: `${Math.random() * glowSize - (w)}px`,
                top: `${Math.random() * glowSize - (h)}px`
            }, {duration: 3000, fill: "forwards"})        
        });
    }, 3000)

    changeGlow()

    // Make everything inside show up in the showcase box
    let items = document.querySelectorAll(".menuItem")
    let i = 0
    items.forEach(item => {
        let n = i
        menuItems[i] = item;

        menuDesc[i] = document.createElement("div");

        let desc = item.querySelector(".menuDesc");
        menuDesc[i].innerHTML = `<div class="title">${item.querySelector("h2").innerHTML}</div>`
        menuDesc[i].innerHTML += desc.innerHTML;
        desc.remove();
    
        item.onclick = () => clickedItem(n);
        i++;
    })

    // Add the mouse enter and exit events to the menu collections
    document.querySelectorAll(".menuCollection").forEach(collection => {
        
        collection.onmouseenter = function() {
            changeZoom(1);
        };
        collection.onmouseleave = function() {
            changeZoom(2);
        };
    })

    initializePalettes()
    updateCategoryLocs()
    changeBackgroundColor()
}

function clickedItem(ind) {    
    if (selected != ind) {
        showDesc(ind, true)
        if (selected >= 0) {
            showcase.scrollIntoView()
            menuItems[selected].querySelector("h2").classList.remove("selected")
        }
    }

    selected = ind;
    let text = menuItems[ind].querySelector("h2")
    text.classList.add("selected")

    if (!text.classList.contains("pulse")) {
        text.classList.add("pulse")

        setTimeout(() => {
            text.classList.remove("pulse")     
        }, 400);
    }
}

function showDesc(ind, transition) {

    showcaseinner.innerHTML = menuDesc[ind].innerHTML;
    let eInfo = menuItems[ind].getBoundingClientRect()
    // let connector3Vert = connector3.getBoundingClientRect().y
    let connector3Vert = window.innerHeight/ 2

    let targetY = (eInfo.y + (eInfo.height/2)) - (connector1.style.height /2);

    connector1.style.top = `${targetY}px`
    if (connector3Vert - targetY < 0) {
        connector2.style.top = `${connector3Vert + 4}px`
        connector2.style.height = `${targetY - connector3Vert}px`

    } else {
        connector2.style.top = connector1.style.top
        connector2.style.height = `${connector3Vert - targetY}px`
    }

    if (transition) {

        showcaseinner.innerHTML = ""
        showcaseinner.animate({
            height: "0",
            top: "50%",
            background: "white"
        }, {duration: 300, fill: "forwards", easing: "cubic-bezier(0,1,.48,1)"})

        setTimeout(() => {
            showcaseinner.innerHTML = menuDesc[ind].innerHTML;
            showcaseinner.animate({
                height: "100%",
                top: "0",
                background: "radial-gradient(#00000046, #00000068)"
            }, {duration: 300, fill: "forwards", easing: "cubic-bezier(0,1,.48,1)"})     
        }, 400);

    }
}

function changeZoom(option) {
    switch (option) {
        case 1:
            if (window.innerWidth > 768) {
                backgroundDim.style.opacity = ".6";
                backgroundPattern.style.backgroundSize = "10vmin 10vmin"
                backgroundGradient.style.backgroundSize = "300vmin 150vmin"
            }
            break;

        case 2:
            backgroundDim.style.opacity = ".3";
            backgroundPattern.style.backgroundSize = "8vmin 8vmin"
            backgroundGradient.style.backgroundSize = "200vmin 100vmin"
            break;
    }
}

function toggleDisplay() {

    mobileMenu = !mobileMenu

    if (mobileMenu) {
        document.querySelector(".menuCollection").style.height = "auto";
        hamburger1.classList.add("alt");
        hamburger2.classList.add("alt");
        hamburger3.classList.add("alt");
    } 
    else {
        document.querySelector(".menuCollection").style.height = "0";

        hamburger1.classList.remove("alt");
        hamburger2.classList.remove("alt");
        hamburger3.classList.remove("alt");
    }
}

function changeGlow() {
    glowSize = Math.min(window.innerHeight, window.innerWidth) * 0.25
    glowCircle.style.width = glowSize + "px"
    glowCircle.style.height = glowSize + "px"

    glow.style.width = glowSize + "px"
    glow.style.height = glowSize + "px"
    glow.style.filter = `blur(${glowSize/3}px)`
}

function updateCategoryLocs() {
    let collections = document.querySelectorAll(".menuCollection")

    for (let i = 0; i < collections.length; i++) {
        categoryLocs[i] = collections[i].getBoundingClientRect().y + window.scrollY

    }
}


function changeBackgroundColor() {
    // Find which section we are in
    let currentSec = 0
    for (let i = 0; i < categoryLocs.length; i++) {
        if (scrollY > categoryLocs[i]) {
            currentSec = i
        }
    }

    let percentage;
    if (currentSec < categoryLocs.length - 1) {
        percentage = (window.scrollY - categoryLocs[currentSec])/(categoryLocs[currentSec + 1] - categoryLocs[currentSec])
        if (percentage >= 0) {
            let newBGCol1 =  interpolateColor(palettes[currentSec].bgcol1, palettes[currentSec + 1].bgcol1, percentage);
            let newBGCol2 =  interpolateColor(palettes[currentSec].bgcol2, palettes[currentSec + 1].bgcol2, percentage);
            let newNeutralCol =  interpolateColor(palettes[currentSec].neutralcol, palettes[currentSec + 1].neutralcol, percentage);
            let newMainCol =  interpolateColor(palettes[currentSec].maincol, palettes[currentSec + 1].maincol, percentage);
            let newHighCol =  interpolateColor(palettes[currentSec].highlightcol, palettes[currentSec + 1].highlightcol, percentage);
            let newLinkCol =  interpolateColor(palettes[currentSec].linkcol, palettes[currentSec + 1].linkcol, percentage);
            let newAltCol =  interpolateColor(palettes[currentSec].altcol, palettes[currentSec + 1].altcol, percentage);
            document.documentElement.style.setProperty("--bgcol1", newBGCol1);
            document.documentElement.style.setProperty("--bgcol2", newBGCol2);

            document.documentElement.style.setProperty("--neutralcol", newNeutralCol);
        
            document.documentElement.style.setProperty("--maincol", newMainCol);
            document.documentElement.style.setProperty("--highlightcol", newHighCol);
            document.documentElement.style.setProperty("--linkcol", newLinkCol);
            document.documentElement.style.setProperty("--altcol", newAltCol );
        } else {
            document.documentElement.style.setProperty("--bgcol1", palettes[0].bgcol1);
            document.documentElement.style.setProperty("--bgcol2", palettes[0].bgcol2);

            document.documentElement.style.setProperty("--neutralcol", palettes[0].neutralcol);
        
            document.documentElement.style.setProperty("--maincol", palettes[0].maincol);
            document.documentElement.style.setProperty("--highlightcol", palettes[0].highlightcol);
            document.documentElement.style.setProperty("--linkcol", palettes[0].linkcol);
            document.documentElement.style.setProperty("--altcol", palettes[0].altcol );
        }
    } else {
        let last = categoryLocs.length - 1;
        document.documentElement.style.setProperty("--bgcol1", palettes[last].bgcol1);
        document.documentElement.style.setProperty("--bgcol2", palettes[last].bgcol2);

        document.documentElement.style.setProperty("--neutralcol", palettes[last].neutralcol);
    
        document.documentElement.style.setProperty("--maincol", palettes[last].maincol);
        document.documentElement.style.setProperty("--highlightcol", palettes[last].highlightcol);
        document.documentElement.style.setProperty("--linkcol", palettes[last].linkcol);
        document.documentElement.style.setProperty("--altcol", palettes[last].altcol );
    }
}

function interpolateColor(color1, color2, amount) {
    // Convert hexadecimal colors to RGB
    const r1 = parseInt(color1.substr(1, 2), 16);
    const g1 = parseInt(color1.substr(3, 2), 16);
    const b1 = parseInt(color1.substr(5, 2), 16);
    
    const r2 = parseInt(color2.substr(1, 2), 16);
    const g2 = parseInt(color2.substr(3, 2), 16);
    const b2 = parseInt(color2.substr(5, 2), 16);
  
    // Perform linear interpolation
    const r = Math.round(r1 + (r2 - r1) * amount).toString(16).padStart(2, '0');
    const g = Math.round(g1 + (g2 - g1) * amount).toString(16).padStart(2, '0');
    const b = Math.round(b1 + (b2 - b1) * amount).toString(16).padStart(2, '0');

    // Convert interpolated RGB back to hexadecimal
    const interpolatedColor = `#${r}${g}${b}`;
  
    return interpolatedColor;
}

function initializePalettes() {
    palettes[0] = new Palette(
        "#090a12",
        "#2e294e",
        "#7d8491",
        "#ce46ff",
        "#de8cfc",
        "#68b2da",
        "#d4b267"
      );

      palettes[1] =  new Palette(
      "#070303",
      "#2f1414",
      "#f7b955",
      "#ffaf46",
      "#fce28c",
      "#68b2da",
      "#f46767"
      );

      
    palettes[2] =  new Palette(
        "#000901",
        "#022605",
        "#dee20a",
        "#00d7f8",
        "#589cf4",
        "#68b2da",
        "#e5ff00"
      );

    
}

class Palette {
    constructor(bgcol1, bgcol2, neutralcol, maincol, highlightcol, linkcol, altcol) {
      this.bgcol1 = bgcol1;
      this.bgcol2 = bgcol2;
      this.neutralcol = neutralcol;
      this.maincol = maincol;
      this.highlightcol = highlightcol;
      this.linkcol = linkcol;
      this.altcol = altcol;
    }
  }