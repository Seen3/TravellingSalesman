//Brute force approach

let cities = [];
let totalCities = 10;

let popSize = 400;
let population = [];
let fitness = [];

let orderP=[];

let recordDist = Infinity;
let recordDistP;
let bestEver;
let bestEverP;
let currentBest;

function setup() {
    createCanvas(1600, 600);
    let order = [];
    for (let i = 0; i < totalCities; i++) {
        let v = createVector(random(width/2), random(height));
        cities[i] = v;
        order[i] = i;
        orderP[i]=i;
    }
    for (let i = 0; i < popSize; i++) {
        population[i] = shuffle(order);
    }
    let d=calcDist(cities,orderP);
    recordDistP=d;
    bestEverP=orderP.slice();

}

function calcFitness() {
    let currentRecord = Infinity;
    for (let i = 0; i < population.length; i++) {
        let d = calcDist(cities, population[i]);
        if (d < recordDist) {
            recordDist = d;
            bestEver = population[i];
        }
        if (d < currentRecord) {
            currentRecord = d;
            currentBest = population[i];
        }
        fitness[i] = 1 / d + 1;
    }
}
function normFitness() {
    let s = 0;
    for (let i = 0; i < fitness.length; i++) {
        s += fitness[i]
    }
    for (let i = 0; i < fitness.length; i++) {
        fitness[i] = fitness[i] / s;
    }
}
function crossover(A,B){
    let start=floor(random(A.length));
    let end=floor(random(start+1,A.length));
    let newOrd=A.slice(start,end);
    for (let i=0;i<B.length;i++){
        let city=B[i];
        if(!newOrd.includes(city)){
            newOrd.push(city);
        }
    }
    return newOrd;
}
function nextGeneration() {
    let newPop = [];
    for (let i = 0; i < population.length; i++) {
        let orderA = pickOne(population, fitness);
        let orderB = pickOne(population, fitness);
        let order=crossover(orderA,orderB);

        mutate(order,0.1);
        newPop[i] = order;
    }
    population = newPop;
}

function mutate(order, rate) {
    for (let i = 0; i < cities.length; i++) {
        if (random(1) < rate) {
            let a = floor(random(order.length));
            let b = (a+1)%totalCities;
            swap(order, a, b);
        }
    }
}

function pickOne(l, p) {
    let i = 0;
    let r = random(1);
    while (r > 0) {
        r = r - p[i];
        i++;
    }
    i--;
    return l[i].slice();
}


function draw() {
    background(0);
    calcFitness();
    normFitness();
    nextGeneration();
    fill(255);
    for (let i = 0; i < cities.length; i++) {
        ellipse(cities[i].x, cities[i].y, 8, 8);
    }
    stroke(0, 255, 0);
    strokeWeight(4);
    noFill();
    beginShape();
    for (let i = 0; i < bestEver.length; i++) {
        let n = bestEver[i];
        vertex(cities[n].x, cities[n].y);
    }
    endShape();

    stroke(255);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let i = 0; i < currentBest.length; i++) {
        let n = currentBest[i];
        vertex(cities[n].x, cities[n].y);
    }
    endShape();

    //bruteforce

    fill(255);
    for(let i=0;i<cities.length;i++)
    {
        ellipse(cities[i].x+(width/2),cities[i].y,8,8);
    }

    stroke(255);
    strokeWeight(1);
    noFill();
    beginShape();
    for(let i=0;i<orderP.length;i++)
    {
        let n=orderP[i];
        vertex(cities[n].x+(width/2),cities[n].y);
    }
    endShape();
    
    stroke(255,0,0);
    strokeWeight(4);
    noFill();
    beginShape();
    for(let i=0;i<orderP.length;i++)
    {
        let n=bestEverP[i];
        vertex(cities[n].x+(width/2),cities[n].y);
    }
    endShape();
    stroke(255);

    let d=calcDist(cities,orderP);
    if (d<recordDistP)
    {
        recordDistP=d;
        bestEverP=orderP.slice();
    }    
    nextOrder();

}

function calcDist(points, order) {
    let sum = 0;
    for (let i = 0; i < order.length - 1; i++) {
        let A = points[order[i]];
        let B = points[order[i + 1]]
        let d = dist(A.x, A.y, B.x, B.y);
        sum += d;
    }
    return sum;
}




function swap(a, i, j) {
    let t = a[i];
    a[i] = a[j];
    a[j] = t;
}

function nextOrder(){
    let largestI=-1;
    for(let i=0;i<orderP.length-1;i++)
    {
        if(orderP[i]<orderP[i+1]){
            largestI=i;
        }
    }
    if(largestI<0){
        console.log("Finished");
    }
    let largestJ=-1;
    for(let j=0;j<orderP.length;j++)
    {
        if(orderP[largestI]<orderP[j]){
            largestJ=j;
        }
    }
    swap(orderP,largestI,largestJ);
    let endArray=orderP.splice(largestI+1);
    endArray.reverse();
    orderP.push(...endArray);

}
