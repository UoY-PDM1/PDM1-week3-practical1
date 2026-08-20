import { BACKGROUND, getShapes, advanceToFrame, TestResults, testSettingIsCalled, TestCircle, checkShapes, testShapesMatchInOrder, canvasStatus } from "https://cdn.jsdelivr.net/gh/Supportive-IDE/p5js-testing-demo@latest/p5jsTestingLibrary.js";

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
    if (testSettingIsCalled(BACKGROUND.re, false, true)) {
        TestResults.addFail("<code>background()</code> should not be called in <code>draw()</code> for this exercise");
    }
    for (const e of canvasStatus.errors) {
        TestResults.addFail(`In frame ${frameCount}, ${e}`);
    }
    // 15 circles per row
    await advanceToFrame(16);
    for (const e of canvasStatus.errors) {
        TestResults.addFail(`In frame ${frameCount}, ${e}`);
    }
    let actualShapes = getShapes();
    if (actualShapes.length !== 16) {
        TestResults.addFail(`At frame 16, there should be 16 circles. Your sketch has ${actualShapes.length}.`);
    } else {
        const circle15 = new TestCircle(20, 60, 40);
        if (actualShapes[15].isEqualTo(circle15, true)) {
            TestResults.addPass("At frame 16, a new row is started when the circles reach the right edge.");
        }
        else {
            if (actualShapes[15].x > circle15.x) {
                TestResults.addFail(`At frame 16, the 16th circle should be at ${circle15.x}, ${circle15.y}. In your sketch, it is at ${actualShapes[15].x}, ${actualShapes[15].y}.${actualShapes[15].y === 60 ? " The y coordinate of the 16th circle is correct. This suggests the problem is with the calculation of <code>circleX</code>.": ""}`);
            }
            else {
                TestResults.addFail(`At frame 16, the 16th circle should be at ${circle15.x}, ${circle15.y}. In your sketch, it is at ${actualShapes[15].x}, ${actualShapes[15].y}.`);
            }
        }
    }
    // 150 circles total, screen filled.
    await advanceToFrame(150);
    for (const e of canvasStatus.errors) {
        TestResults.addFail(`In frame ${frameCount}, ${e}`);
    }
    actualShapes = getShapes();
    const expectedShapes = [];
    for (let yi = 20; yi < height; yi += 40) {
        for (let xi = 20; xi < width; xi += 40) {
            expectedShapes.push(new TestCircle(xi, yi, 40));
        }
    }
    if (actualShapes.length !== 150) {
        TestResults.addFail(`At frame 150, there should be 150 circles filling the screen. Your sketch has ${actualShapes.length}.`);
    } else {
        if (testShapesMatchInOrder(expectedShapes, actualShapes, false)) {
            TestResults.addPass("At frame 150, the screen is filled with circles.")
        } else {
            TestResults.addFail("At frame 150, your shapes did not match the expected output. The screen should be filled with circles.");
        }
    }
    // 151st circle should be in the same place as the first
    await advanceToFrame(151);
    for (const e of canvasStatus.errors) {
        TestResults.addFail(`In frame ${frameCount}, ${e}`);
    }
    actualShapes = getShapes();
    if (actualShapes.length !== 151) {
        TestResults.addFail(`At frame 151, there should be 151 circles drawn in total with the the last circle drawn over the first. Your sketch has ${actualShapes.length}.`);
    } else {
        const lastCircle = new TestCircle(20, 20, 40);
        if (actualShapes[0].isEqualTo(actualShapes[150], true) && actualShapes[0].isEqualTo(lastCircle, true)) {
            TestResults.addPass("At frame 151, the sketch has started to redraw circles from the top left.");
        } else {
            TestResults.addFail(`At frame 151, the last circle drawn should be in the same place as the first at 20, 20. Your first circle is drawn at ${actualShapes[0].x}, ${actualShapes[0].y} and your last circle is drawn at ${actualShapes[150].x}, ${actualShapes[150].y}.${actualShapes[150].y === 420 ? " The y coordinate of your last circle is off the screen at 420. This suggests the calculation of <code>circleY</code> may be missing brackets in the right place.": ""}`);
        }
    }
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
