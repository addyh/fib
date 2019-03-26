// The scale size of the first square
let w = 10;
let h = w;

// Position of the starting middle square
let x;
let y;
let num = 0;
let nfib = 0;

// Directions, (i values)
const FIRST = 0;
const LEFT = 1;
const DOWN = 2;
const RIGHT = 3;
const UP = 4;

function draw() {
  // Re-draw the canvas incase the screen has been resized
  createCanvas(windowWidth, windowHeight-5);
  background(180);
  strokeWeight(2);
  noFill();

  num = 0;
  nfib = 0;

  // Decide how many boxes/segments, (what size) the spiral should have,
  // based on the height and width of the screen
  while (fibWidth(num+1)+w < windowWidth && fibHeight(num+1) < windowHeight) {
    // While the theoretical total width & height of the spiral,
    // (num) boxes big, is less than the width & height of the screen,
    // make the spiral bigger
    num++;
  }

  // Find the starting x,y position to place the very first box
  // (its top-left corner)
  let pos = findPos(num);
  x = pos.x + w;
  y = pos.y + h;

  // Finally, draw the fibonacci spiral, (num) boxes/arc-lengths big
  push();
  drawSpiral(num);
  pop();
}

// Fibonacci number generator
function fib(n) {
  return (n==0? 0:
    n==1||n==2? 1:
      fib(n-1) + fib(n-2));
}

// If we were to draw a spiral with n boxes/segments,
// What would the total width be?
function fibWidth(n) {
  // Even n's make for a wide spiral,
  // And odd ones are tall
  return (n%2==0? fib(n+1)*w : fib(n+2)*w);
}

// What would the total height be?
function fibHeight(n) {
  return (n%2==0? fib(n+2)*h : fib(n+1)*h);
}

// Calculate that starting position, based on how many boxes we are drawing
// Don't even try to figure out how this works, just trust that it does...
function findPos(n) {
  let x_, y_, pos;
  for (let j = n; j >= 1; j--) {
    let i = j; while (i>4) {i-=4}
    if (j == n) {
      // This is the very first loop iteration of j
      eval('pos = ['+(i==4?'0, 0':
        i==3?'fibWidth(n), 0':
          i==2?'fibWidth(n), fibHeight(n)':
            i==1?'0, fibHeight(n)':']')+'];');
      x_ = pos[0];
      y_ = pos[1];
    }
    if (j == 1) {
      // This is the very last iteration
      y_ -= fib(j+1)*h;
    }
    else {
      // This is every single iteration but the last
      let s = (i==1?'+-':
        i==2?'--':
          i==3?'-+':
            i==4?'++':null);
      eval('x_'+s[0]+'=(fib(j+1)*w);'
               + 'y_'+s[1]+'=(fib(j+1)*h);');
    }
  }
  return {x:x_, y:y_};
}

// v5.0 (explanatory version)
function drawSpiral(num) {
  // num:  how many fibonacci boxes to draw
  // nfib: index of which fibonacci number we are on
  for (let j = 0; j <= num; j++) {

    // Create a modulo counter, i,
    // to decide if we draw the box to the left, right, up...?
    let i = j;
    while (i > 4) {
      // We are basically doing i=j%4 here, but not exactly
      i -= 4;
    }
    // Set n, which is the value of fib()
    // and needed for the formula in drawBox()
    let n = fib(++nfib);

    // Draw the next spiral segment and box
    drawBox(i, n);
  }
}

// drawBox()
// Draws the next box and fibonacci arc, either
// above, below, left, or right of the last ones
function drawBox(direction, n) {

  // An eval to 'switch' the parameters of the p5 functions,
  // To decide which direction the next box/arc are to be drawn
  eval('translate(' +
           // Translate the x,y position to the top-left corner of the new box
           (direction==FIRST? 'x+w,              y':
             direction==LEFT?  '-n*w,             0':
               direction==DOWN?  '0,                fib(nfib-1)*h':
                 direction==RIGHT? 'fib(nfib-1)*w,    -1*fib(nfib-2)*h':
                   direction==UP?    '-1*fib(nfib-2)*w, -n*h':'')

        // Draw the next rectangle box to surround the arc
        + ');rect(0, 0, n*w, n*h);'

        // Draw the spiral's next arc segment
        + 'arc(' +
           (direction==FIRST? '0,   n*h, 2*n*w, 2*n*h, 3*PI/2, TWO_PI)':
             direction==LEFT?  'n*w, n*h, 2*n*w, 2*n*h, PI,     3*PI/2)':
               direction==DOWN?  'n*w, 0,   2*n*w, 2*n*h, PI/2,   PI)':
                 direction==RIGHT? '0,   0,   2*n*w, 2*n*h, 0,      PI/2)':
                   direction==UP?    '0,   n*h, 2*n*w, 2*n*h, 3*PI/2, TWO_PI)':')')
  );
}

// v4.0 (compacted version)
function drawSpiral_v4(num) {
  for (let j = 0; j <= num; j++) {
    let i = j; while (i>4) {i-=4}
    let n = fib(++nfib);
    let r = ');rect(0, 0, n*w, n*h);arc(';
    eval('translate('+(
      i==0?'x+w, y'+r+'0, n*h, 2*n*w, 2*n*h, 3*PI/2, TWO_PI)':
        i==1?'-n*w,0'+r+'n*w,n*h,2*n*w,2*n*h,PI,3*PI/2)':
          i==2?'0,fib(nfib-1)*h'+r+'n*w,0,2*n*w,2*n*h,PI/2,PI)':
            i==3?'fib(nfib-1)*w,-1*fib(nfib-2)*h'+r+'0,0,2*n*w,2*n*h,0,PI/2)':
              i==4?'-1*fib(nfib-2)*w,-n*h'+r+'0,n*h,2*n*w,2*n*h,3*PI/2,TWO_PI)':
                ')'));
  }
}

// v3.0
function drawSpiral_v3(num) {
  for (let j = 0; j <= num; j++) {
    let i = j; while (i>4) {i-=4}
    let n = fib(++nfib);
    eval('translate(' +
                (i==0?'x+w,             y)':
                  i==1?'-n*w,             0)':
                    i==2?'0,                fib(nfib-1)*h)':
                      i==3?'fib(nfib-1)*w,    -1*fib(nfib-2)*h)':
                        i==4?'-1*fib(nfib-2)*w, -n*h)':')')
            + ';rect(0, 0, n*w, n*h);'
            + 'arc(' +
                (i==0?'0,  n*h, 2*n*w, 2*n*h, 3*PI/2, TWO_PI)':
                  i==1?'n*w, n*h, 2*n*w, 2*n*h, PI,     3*PI/2)':
                    i==2?'n*w, 0,   2*n*w, 2*n*h, PI/2,   PI)':
                      i==3?'0,   0,   2*n*w, 2*n*h, 0,      PI/2)':
                        i==4?'0,   n*h, 2*n*w, 2*n*h, 3*PI/2, TWO_PI)':')')
    );
  }
}

// v2.0
function drawSpiral_v2(num) {

  let n = fib(++nfib);
  translate(x+w, y);
  rect(0, 0, n*w, n*h);
  arc(0, n*h, 2*n*w, 2*n*h, 3*PI/2, TWO_PI);

  for (let i = 0; i < num; i++) {

    n = fib(++nfib);
    translate(-n*w, 0);
    rect(0, 0, n*w, n*h);
    arc(n*w, n*h, 2*n*w, 2*n*h, PI, 3*PI/2);

    translate(0, n*h);
    n = fib(++nfib);
    rect(0, 0, n*w, n*h);
    arc(n*w, 0, 2*n*w, 2*n*h, PI/2, PI);

    translate(n*w, -1*fib(nfib-1)*h);
    n = fib(++nfib);
    rect(0, 0, n*w, n*h);
    arc(0, 0, 2*n*w, 2*n*h, 0, PI/2);

    n = fib(++nfib);
    translate(-1*fib(nfib-2)*w, -n*h);
    rect(0, 0, n*w, n*h);
    arc(0, n*h, 2*n*w, 2*n*h, 3*PI/2, TWO_PI);
  }
}

// v1.0
function drawSpiral_v1() {

  let n = fib(1);
  translate(x+w, y);
  rect(0, 0, n*w, n*h);
  arc(0, n*h, 2*n*w, 2*n*h, 3*PI/2, TWO_PI);

  n = fib(2);
  translate(-n*w, 0);
  rect(0, 0, n*w, n*h);
  arc(n*w, n*h, 2*n*w, 2*n*h, PI, 3*PI/2);

  translate(0, n*h);
  n = fib(3);
  rect(0, 0, n*w, n*h);
  arc(n*w, 0, 2*n*w, 2*n*h, PI/2, PI);

  translate(n*w, -1*fib(2)*h);
  n = fib(4);
  rect(0, 0, n*w, n*h);
  arc(0, 0, 2*n*w, 2*n*h, 0, PI/2);

  n = fib(5);
  translate(-1*fib(3)*w, -n*h);
  rect(0, 0, n*w, n*h);
  arc(0, n*h, 2*n*w, 2*n*h, 3*PI/2, TWO_PI);

  n = fib(6);
  translate(-n*w, 0);
  rect(0 ,0, n*w, n*h);
  arc(n*w, n*h, 2*n*w, 2*n*h, PI, 3*PI/2);

  translate(0, n*h);
  n = fib(7);
  rect(0, 0, n*w, n*h);
  arc(n*w, 0, 2*n*w, 2*n*h, PI/2, PI);

  translate(n*w, -1*fib(6)*h);
  n = fib(8);
  rect(0, 0, n*w, n*h);
  arc(0, 0, 2*n*w, 2*n*h, 0, PI/2);

  n = fib(9);
  translate(-1*fib(7)*w, -n*h);
  rect(0, 0, n*w, n*h);
  arc(0, n*h, 2*n*w, 2*n*h, 3*PI/2, TWO_PI);

  n = fib(10);
  translate(-n*w, 0);
  rect(0 ,0, n*w, n*h);
  arc(n*w, n*h, 2*n*w, 2*n*h, PI, 3*PI/2);
}
