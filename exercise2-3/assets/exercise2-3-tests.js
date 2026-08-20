import { TestResults, checkBackgroundIsCalledInDraw, checkCanvasSize, getShapes, advanceToFrame, coloursMatch, checkBackground, canvasStatus, simulateMousePosition } from "https://cdn.jsdelivr.net/gh/Supportive-IDE/p5js-testing-demo@latest/p5jsTestingLibrary.js";

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
    checkBackground(color(0), "black");
    let lastShapes = getShapes();
    for (const e of canvasStatus.errors) {
        TestResults.addFail(`In frame ${frameCount}, ${e}`);
    }
    if (lastShapes.length !== 1) {
        TestResults.addFail(`Expected 1 shape when the sketch first loads. Found ${lastShapes.length}.`);
    } else {
        if (coloursMatch(lastShapes[0].fillColour, color(255))) {
            TestResults.addPass(`The ${lastShapes[0].type} is white before it is dragged.`);
        } else {
            TestResults.addFail(`Expected the ${lastShapes[0].type} to be white before it is dragged.`);
        }
        const hasMousePressed = window.hasOwnProperty("mousePressed");
        const hasMouseDragged = window.hasOwnProperty("mouseDragged");
        const hasMouseReleased = window.hasOwnProperty("mouseReleased");
        if (!hasMouseDragged) {
            TestResults.addFail("Although the output may look correct, the requirements call for use of the mouse event functions (rather than the <code>mouseIsPressed</code> system variable). You will need to implement at least <code>mouseDragged()</code> to complete this exercise.");
        } else {
            // The mouse is pressed on the shape
            const coords = [lastShapes[0].x + 1, lastShapes[0].y + 1]; //lastShapes[0].getLocationInMode("CENTER");
            const beforeX1 = coords[0];//lastShapes[0].x + lastShapes[0].w / 2;
            const beforeY1 = coords[0];//lastShapes[0].y + lastShapes[0].h / 2;
            // mouseX = beforeX1;
            // mouseY = beforeY1;
            // mouseIsPressed = true;
            simulateMousePosition(beforeX1, beforeY1);
            window.mock_mouseIsPressed = true;
            if (hasMousePressed) {
                mousePressed();
            }
            await advanceToFrame(frameCount + 1);
            for (const e of canvasStatus.errors) {
                TestResults.addFail(`In frame ${frameCount}, ${e}`);
            }
            // drag
            // mouseX += 5;
            // mouseY += 5;
            simulateMousePosition(window.mock_mouseX + 5, window.mock_mouseY + 5);
            mouseDragged();
            await advanceToFrame(frameCount + 1);
            const shapesAfterDrag = getShapes();
            // drag
            // mouseX += 5;
            // mouseY += 5;
            simulateMousePosition(window.mock_mouseX + 5, window.mock_mouseY + 5);
            mouseDragged();
            await advanceToFrame(frameCount + 1);
            for (const e of canvasStatus.errors) {
                TestResults.addFail(`In frame ${frameCount}, ${e}`);
            }
            const shapesAfterSecondDrag = getShapes();
            if (shapesAfterSecondDrag.length !== 1) {
                TestResults.addFail(`Expected one shape after dragging the mouse. Found ${shapesAfterSecondDrag.length}.`);
            } else {
                // The shape has moved
                if (shapesAfterSecondDrag[0].x - shapesAfterDrag[0].x === 5 && shapesAfterSecondDrag[0].y - shapesAfterDrag[0].y === 5) {
                    TestResults.addPass("The shape moved by the expected amount when the mouse dragged by 5, 5.")
                } else {
                    TestResults.addFail(`Expected the shape to move 5, 5 when the mouse dragged 5, 5. Your shape moved ${shapesAfterSecondDrag[0].x - shapesAfterDrag[0].x}, ${shapesAfterSecondDrag[0].y - shapesAfterDrag[0].y}.`);
                }
                // The shape has changed colour
                if (coloursMatch(shapesAfterDrag[0].fillColour, lastShapes[0].fillColour)) {
                    TestResults.addFail("Expected the shape to change colour while it is dragged.")
                } else {
                    TestResults.addPass("The shape changes colour when it is dragged.");
                }
            }
            // mouse released -> turns white
            window.mock_mouseIsPressed = false;
            if (hasMouseReleased) {
                mouseReleased();
            }
            // mouseX += 5;
            // mouseY += 5;
            simulateMousePosition(window.mock_mouseX + 5, window.mock_mouseY + 5);
            await advanceToFrame(frameCount + 1);
            for (const e of canvasStatus.errors) {
                TestResults.addFail(`In frame ${frameCount}, ${e}`);
            }
            const shapeRelease = getShapes();
            if (shapeRelease.length !== 1) {
                TestResults.addFail(`Expected one shape when the drag is finished. Found ${shapeRelease.length}.`);
            } else {
                // Stop moving
                if (shapesAfterSecondDrag[0].x === shapeRelease[0].x && shapesAfterSecondDrag[0].y === shapeRelease[0].y) {
                    TestResults.addPass("The shape stops moving when the mouse is released.");
                } else {
                    TestResults.addFail("The shape continued moving when the mouse was released.");
                }
                // Changes colour
                if (coloursMatch(lastShapes[0].fillColour, shapeRelease[0].fillColour)) {
                    TestResults.addPass("The shape returns to its original colour when the mouse is released.");
                } else {
                    TestResults.addFail("Expected the shape to return to its original colour when the mouse was released.")
                }
            }
            // Mouse dragged away from shape
            // mouseX = shapeRelease[0].x - 5;
            // mouseY = shapeRelease[0].y - 5;
            simulateMousePosition(shapeRelease[0].x - 5, shapeRelease[0].y - 5);
            window.mock_mouseIsPressed = true;
            if (hasMousePressed) {
                mousePressed();
            }
            await advanceToFrame(frameCount + 1);
            for (const e of canvasStatus.errors) {
                TestResults.addFail(`In frame ${frameCount}, ${e}`);
            }
            // mouseX += 10;
            // mouseY += 5;
            simulateMousePosition(window.mock_mouseX + 10, window.mock_mouseY + 5);
            mouseDragged();
            await advanceToFrame(frameCount + 1);
            for (const e of canvasStatus.errors) {
                TestResults.addFail(`In frame ${frameCount}, ${e}`);
            }
            const shapesAfterFalseDrag = getShapes();
            if (shapesAfterFalseDrag.length === 1) {
                if (shapeRelease[0].x === shapesAfterFalseDrag[0].x && shapeRelease[0].y === shapesAfterFalseDrag[0].y) {
                    TestResults.addPass("The shape does not move when the mouse is dragged away from the shape.");
                } else {
                    TestResults.addFail("The shape moved when the mouse drag begins away from the shape. It should only move if the drag starts over the shape. Try implementing <code>mousePressed()</code> if you haven't already.");
                }
                if (coloursMatch(lastShapes[0].fillColour, shapesAfterFalseDrag[0].fillColour)) {
                    TestResults.addPass("The shape does not change colour when the mouse is dragged away from the shape.");
                } else {
                    TestResults.addFail("The shape changed colour when the mouse drag begins away from the shape. It should only change colour if the drag starts over the shape. Try implementing <code>mousePressed()</code> if you haven't already.");
                }
            }
        }
    }
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
