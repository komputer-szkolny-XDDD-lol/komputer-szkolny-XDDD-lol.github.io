console.log("hi")
let score = 0;
let target = null;
let playfield = null;
let scoredisplay = null;
let ghost = null;
console.log(playfield)
let targetNewY = 0;
let targetNewX = 0;
let hover = false;
let line = null;
let ghostNewX = 0;
let ghostNewY = 0;
let ghost2 = null;
let ghost2NewY = 0;
let combo = 0;
let speedmult = 1;
let ghost2NewX = 0;
let combodisplay = null;
let hits = 0;
let hitdisplay = null;

let ghostY_DownOffset = 0;
let ghostX_LeftOffset = 0;
let ghostY_UpOffset = 0;
let ghostX_RightOffset = 0;

function lineAngle(x1, x2, y1, y2) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;

    const radians = Math.atan2(deltaY, deltaX)

    let degrees = radians * (180 / Math.PI)

    return degrees;

}

function spawnLine() {
    const x1 = ghostNewX + 7.5
    const x2 = targetNewX + 7.5
    const y1 = ghostNewY + 7.5
    const y2 = targetNewY + 7.5
    if (line == null) {
        line = document.createElement("div")
    } else {
        line.remove()
        line = document.createElement("div")
    }
    line.id = "line"
    line.class = "line"
    line.style.backgroundColor = "#00000044"
    line.style.height = "8px"
    const distance = Math.hypot(x2 - x1, y2 - y1)
    line.style.width = distance.toString().concat("%")
    line.style.position = "absolute";
    const centerX = (x1 + x2) / 2
    const centerY = (y1 + y2) / 2
    const angle = lineAngle(x1, x2, y1, y2)
    line.style.top = y1.toString().concat("%")
    line.style.left = x1.toString().concat("%")

    line.style.display = "block"
    line.style.transformOrigin = "left center"
    line.style.transform = `translateY(-50%) rotate(${angle}deg)`

    playfield.appendChild(line)
}


function spawnTarget() {
    scoredisplay = document.querySelector(".scoredisplay")
    combodisplay = document.querySelector(".combodisplay")
    hitdisplay = document.querySelector(".hitdisplay")
    playfield = document.querySelector(".playfield")
    console.log(playfield)
    target = document.createElement("hit")
    target.addEventListener("click", hitTarget)
    target.addEventListener("mouseleave", function() {hover = false})
    target.addEventListener("mouseenter", function() {hover=true})
    target.class = "target"
    target.id = "target"
    target.style.position = "absolute";
    target.style.display = "block"
    // random X % value between 10% to 90%, same with Y
    target.style.aspectRatio = "1"
    target.style.backgroundColor = "#000000"
    target.style.zIndex = "10"
    target.style.width = "15%"
    target.style.borderRadius = "100%"
    target.style.height = "auto"
    if (ghost == null) {
        targetNewX = 5 + (Math.floor((Math.random() * 80) * 100) / 100)
        targetNewY = 5 + (Math.floor((Math.random() * 80) * 100) / 100)
    }
    target.style.left = targetNewX.toString().concat("%")
    target.style.top = targetNewY.toString().concat("%")

    if (ghost != null) {
        target.style.left = ghost.style.left
        target.style.top = ghost.style.top
        targetNewY = ghostNewY
        targetNewX = ghostNewX
    }

    console.log(targetNewX.toString())
    console.log(targetNewY.toString())
    playfield.appendChild(target)

    if (ghost != null) {
        ghost.remove()
    }
    spawnGhost()
}

function spawnGhost() {
    scoredisplay = document.querySelector(".scoredisplay")
    playfield = document.querySelector(".playfield")
    ghost = target.cloneNode(false)
    let Ymult = 40;
    let Xmult = 40;
    let Ysub = 20;
    let Xsub = 20;

    if (ghostY_UpOffset >= 1) {
        ghostY_UpOffset -= 1;
        Ysub = 40;
        Ymult = 28;
    }
    if (ghostY_DownOffset >= 1) {
        ghostY_DownOffset -= 1;
        Ysub = 0;
        Ymult = 28;
    }
    if (ghostX_LeftOffset >= 1) {
        ghostX_LeftOffset -= 1;
        Xsub = 40;
        Xmult = 28;
    }
    if (ghostX_RightOffset >= 1) {
        ghostX_RightOffset -= 1;
        Xsub = 0;
        Xmult = 28;
    }




    ghost.class = "ghost"
    ghost.id = "ghost"
    console.log(ghost)

        ghostNewX = Math.max(Math.min(targetNewX - Xsub + (Math.floor((Math.random() * Xmult) * 100) / 100), 85), 5)
        ghostNewY = Math.max(Math.min(targetNewY - Ysub + (Math.floor((Math.random() * Ymult) * 100) / 100), 85 ), 5)
    
    if (ghostNewY > 80) {
        ghostY_UpOffset = 3
    }
    if (ghostNewX > 80) {
        ghostX_LeftOffset = 3
    }
    if (ghostNewY < 15) {
        ghostY_DownOffset = 3
    }
    if (ghostNewX < 15) {
        ghostX_RightOffset = 3
    }

    ghost.style.left = ghostNewX.toString().concat("%")
    ghost.style.top = ghostNewY.toString().concat("%")
    ghost.style.transform = "translate(0%, 0%)"
    ghost.style.zIndex = "8"
    ghost.style.backgroundColor = "#888888"
    playfield.appendChild(ghost)

    spawnLine()
}


function hitTarget() {
    target.remove()
    score += Math.floor((70 * (speedmult)) * (1 + (combo / 100)))
    spawnTarget()
    hover = false;
    combo += 1
    hits += 1
    speedmult = 2
    let hitstring = "hits: "
    scoredisplay.innerHTML = score.toString()
    combodisplay.innerHTML = combo.toString().concat("x")
    hitdisplay.innerHTML = hitstring.concat(hits.toString())
}

function KeyPress(e) {
    if (!((e.code == "KeyZ") || (e.code == "KeyX"))) {
        return;
    }
    if (hover) {
        hitTarget()
    } else {
        score -= 45
        scoredisplay.innerHTML = score.toString()
        combodisplay.innerHTML = combo.toString().concat("x")
        combo = 0
    }
}

document.addEventListener('DOMContentLoaded', spawnTarget, false)
document.addEventListener('keydown', KeyPress, false)

setInterval(function() {
    if (speedmult > 1) {
        speedmult = Math.max(1, speedmult - 0.10)
    }
}, 50)