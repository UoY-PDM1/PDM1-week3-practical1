import { TestResults, checkBackgroundIsCalledInDraw, checkCanvasSize, getShapes, advanceToFrame, coloursMatch, canvasStatus } from "https://cdn.jsdelivr.net/gh/Supportive-IDE/p5js-testing-demo@latest/p5jsTestingLibrary.js";

/**
 * A hacky solution to wait for p5js to load the canvas. Include in all exercise test files.
 */
function waitForP5() {
    const canvases = document.getElementsByTagName("canvas");
    if (canvases.length > 0) {
        clearInterval(loadTimer);
        runTests(canvases[0]);
    }
}

async function runTests(canvas) {
    canvas.style.pointerEvents = "none";
    const resultsDiv = document.getElementById("results");
    checkCanvasSize(600, 600);
    checkBackgroundIsCalledInDraw();
    let lastShapes = getShapes();
    for (const e of canvasStatus.errors) {
        TestResults.addFail(`In frame ${frameCount}, ${e}`);
    }
    if (lastShapes.length !== 1) {
        TestResults.addFail(`Expected 1 shape when the sketch first loads. Found ${lastShapes.length}.`);
    } else {
        // Can tell which event function is implemented?
        const beforeColour = lastShapes[0].fillColour;
        let eventFunc;
        let funcName;
        if (window.hasOwnProperty("mousePressed")) { 
            eventFunc = mousePressed;
            funcName = "mousePressed()";
        } else if (window.hasOwnProperty("mouseReleased")) {
            eventFunc = mouseReleased;
            funcName = "mouseReleased()";
        } else if (window.hasOwnProperty("mouseClicked")) {
            eventFunc = mouseClicked;
            funcName = "mouseClicked()";
        } else if (window.hasOwnProperty("doubleClicked")) {
            eventFunc = doubleClicked;
            funcName = "doubleClicked()";
        }
        if (eventFunc === undefined) {
            TestResults.addFail("No mouse event function has been implemented so unable to test colour change.");
        } else {
            eventFunc();
            await advanceToFrame(frameCount+1);
            for (const e of canvasStatus.errors) {
                TestResults.addFail(`In frame ${frameCount}, ${e}`);
            }
            const afterShapes = getShapes();
            if (afterShapes.length !== 1) {
                TestResults.addFail(`Expected one shape after a mouse event. Found ${afterShapes.length}.`);
            } else {
                const afterColour = afterShapes[0].fillColour;
                if (!coloursMatch(beforeColour, afterColour)) {
                    TestResults.addPass("A mouse interaction changes the colour as expected.");
                } else {
                    TestResults.addFail("A mouse interaction does not change the colour. Check that <code>fill()</code> is called after changing the colour.");
                }
            }
        }
    }
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
