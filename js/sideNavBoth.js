/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function rightOpenNav() {
    document.getElementById("rightSideNav").style.width = "200px";
    document.getElementById("map").style.marginRight = "200px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function rightCloseNav() {
    document.getElementById("rightSideNav").style.width = "0";
    document.getElementById("map").style.marginRight = "0";
}

function leftOpenNav() {
    document.getElementById("leftSideNav").style.width = "200px";
    document.getElementById("map").style.marginLeft = "200px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function leftCloseNav() {
    document.getElementById("leftSideNav").style.width = "0";
    document.getElementById("map").style.marginLeft = "0";
}
