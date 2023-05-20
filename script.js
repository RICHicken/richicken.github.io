
var glowSize = 0
var menuItems = []
var menuDesc = []

selected = -1;

initialSelect = 0;

window.onload = e => {

    baseURL = location.href

    setup()
    changeGlow()
    clickedItem(initialSelect)
}

window.addEventListener("resize", e => {
    showDesc(selected, false)
    changeGlow()
});

window.addEventListener("mousemove", e => {
    glow.animate({

        left: `${e.clientX - glowSize/2}px`,
        top: `${e.clientY - glowSize/2}px`
    }, {duration: 3000, fill: "forwards"})
});

window.addEventListener("scroll", e => {    
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

    // Add the onclick event to all menu items and collapse them
    let items = document.querySelectorAll(".menuItem")
    let i = 0
    items.forEach(item => {
        let n = i
        menuItems[i] = item;

        menuDesc[i] = document.createElement("div");

        let desc = item.querySelector(".menuDesc");
        menuDesc[i].innerHTML = desc.innerHTML;
        desc.remove();
    
        item.onclick = () => clickedItem(n);
        i++;
    })
}

function clickedItem(ind) {    

    showcase.scrollIntoView()

    if (selected != ind) {
        showDesc(ind, true)
        if (selected >= 0) {
            menuItems[selected].querySelector("h1").classList.remove("selected")
        }
    }

    selected = ind;
    let text = menuItems[ind].querySelector("h1")
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
        }, {duration: 300, fill: "forwards", easing: "cubic-bezier(0,1,.48,1)"})

        setTimeout(() => {
            showcaseinner.innerHTML = menuDesc[ind].innerHTML;
            showcaseinner.animate({
                height: "100%",
                top: "0",
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

function changeGlow() {
    glowSize = Math.min(window.innerHeight, window.innerWidth) * 0.25
    glowCircle.style.width = glowSize + "px"
    glowCircle.style.height = glowSize + "px"

    glow.style.width = glowSize + "px"
    glow.style.height = glowSize + "px"
    glow.style.filter = `blur(${glowSize/3}px)`
}