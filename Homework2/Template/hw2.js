// graph 1: bar graph total pokemon with all types vs total stats
// graph 2: dot plot pokemon with all types vs hp and attack
// graph 3: star plot with the type that has the highest total
let abFilter = 25
const width = window.innerWidth;
const height = window.innerHeight;

let scatterLeft = 0, scatterTop = 0;
let scatterMargin = {top: 10, right: 30, bottom: 30, left: 60},
    scatterWidth = 400 - scatterMargin.left - scatterMargin.right,
    scatterHeight = 350 - scatterMargin.top - scatterMargin.bottom;

let distrLeft = 400, distrTop = 0;
let distrMargin = {top: 10, right: 30, bottom: 30, left: 60},
    distrWidth = 400 - distrMargin.left - distrMargin.right,
    distrHeight = 350 - distrMargin.top - distrMargin.bottom;

let typeLeft = 0, typeTop = 400;
let typeMargin = {top: 10, right: 30, bottom: 30, left: 60},
    typeWidth = width - typeMargin.left - typeMargin.right,
    typeHeight = height-450 - typeMargin.top - typeMargin.bottom;

d3.csv("pokemon_alopez247.csv").then(rawData =>{
    console.log("rawData", rawData);
    
    rawData.forEach(function(d){
        d.HP = Number(d.HP);
        d.Attack = Number(d.Attack);
        d.Defense = Number(d.Defense);
        d.Total = Number(d.Total);
        //d.Type_1 = Number(d.Type_1);
        //d.Type_2 = Number(d.Type_2);
        
    });


    rawData = rawData.map(d=>{
                          return {
                              "Type_1":d.Type_1,
                              //"Type 2":d.Type2,
                              "HP":d.HP,
                              "Attack":d.Attack,
                              "Total":d.Total,
                          };
    });
    console.log(rawData);
    
//plot 1
    const svg = d3.select("svg")

    const g1 = svg.append("g")
                .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
                .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
                .attr("transform", `translate(${scatterMargin.left}, ${scatterMargin.top})`)

    // X label
    g1.append("text")
    .attr("x", scatterWidth / 2)
    .attr("y", scatterHeight + 50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Attack")
    

    // Y label
    g1.append("text")
    .attr("x", -(scatterHeight / 2))
    .attr("y", -40)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("HP")

    // X ticks
    const x1 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.Attack)])
    .range([0, scatterWidth])

    const xAxisCall = d3.axisBottom(x1)
                        .ticks(7)
    g1.append("g")
    .attr("transform", `translate(0, ${scatterHeight})`)
    .call(xAxisCall)
    .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)")

    // Y ticks
    const y1 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.HP)])
    .range([scatterHeight, 0])

    const yAxisCall = d3.axisLeft(y1)
                        .ticks(13)
    g1.append("g").call(yAxisCall)

    const rects = g1.selectAll("circle").data(rawData)

    rects.enter().append("circle")
         .attr("cx", function(d){
             return x1(d.Attack);
         })
         .attr("cy", function(d){
             return y1(d.HP);
         })
         .attr("r", 3)
         .attr("fill", "#69b3a2")

//space
    const g2 = svg.append("g")
                .attr("width", distrWidth + distrMargin.left + distrMargin.right)
                .attr("height", distrHeight + distrMargin.top + distrMargin.bottom)
                .attr("transform", `translate(${distrLeft}, ${distrTop})`)

//plot 2
    
    const q = rawData.reduce((s, { Type_1 }) => (s[Type_1] = (s[Type_1] || 0) + 1, s), {});
    const r = Object.keys(q).map((key) => ({ Type_1: key, count: q[key] }));

    // finds the total stats per type x
    const totalsByType = rawData.reduce((totals, { Type_1, Total }) => {
        if (!totals[Type_1]) {
            // index total stats for type x
            totals[Type_1] = 0;
        }
            // add stats to total of total stats
        totals[Type_1] += Total;
        return totals;
    }, {});

    console.log(r);
           
    const g3 = svg.append("g")
                .attr("width", typeWidth + typeMargin.left + typeMargin.right)
                .attr("height", typeHeight + typeMargin.top + typeMargin.bottom)
                .attr("transform", `translate(${typeMargin.left}, ${typeTop})`)

    // X label
    g3.append("text")
    .attr("x", typeWidth / 2)
    .attr("y", typeHeight + 50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Type")
    

    // Y label
    g3.append("text")
    .attr("x", -(typeHeight / 2))
    .attr("y", -40)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Total Battle Stats")

    // X ticks
    const x2 = d3.scaleBand()
    .domain(r.map(d => d.Type_1))
    .range([0, typeWidth])
    .paddingInner(0.3)
    .paddingOuter(0.2)

    const xAxisCall2 = d3.axisBottom(x2)
    g3.append("g")
    .attr("transform", `translate(0, ${typeHeight})`)
    .call(xAxisCall2)
    .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)")

    // Y ticks
    const y2 = d3.scaleLinear()
        .domain([0, d3.max(Object.values(totalsByType))])
        .range([typeHeight, 0]);

    const yAxisCall2 = d3.axisLeft(y2)
        .ticks(6);
    g3.append("g").call(yAxisCall2);

    const rects2 = g3.selectAll("rect").data(r);

    // hex colors from https://www.epidemicjohto.com/t882-type-colors-hex-colors
    const typeColor = [
        "#7ac74c", // grass
        "#ee8130", // fire
        "#6390f0", // water
        "#a6b91a", // bug
        "#a8a77a", // normal
        "#a33ea1", // poison
        "#f7d02c", // electric
        "#e2bf65", // ground
        "#d685ad", // fairy
        "#c22e28", // fighting
        "#f95587", // psychic
        "#b6a136", // rock
        "#735797", // ghost
        "#96d9d6", // ice
        "#6f35fc", // dragon
        "#705746", // dark
        "#b7b7ce", // steel
        "#a98ff3"  // flying
    ];

    const colorScale = d3.scaleOrdinal()
        .domain(r.map(d => d.Type_1))
        .range(typeColor); 

    rects2.enter().append("rect")
        .attr("y", d => y2(totalsByType[d.Type_1])) 
        .attr("x", d => x2(d.Type_1))
        .attr("width", x2.bandwidth())
        .attr("height", d => typeHeight - y2(totalsByType[d.Type_1])) 
        .attr("fill", d => colorScale(d.Type_1));

//plot 3
    
const x = rawData.reduce((s, { Type_1 }) => (s[Type_1] = (s[Type_1] || 0) + 1, s), {});
const y = Object.keys(q).map((key) => ({ Type_1: key, count: q[key] }));

















S









}).catch(function(error){
    console.log(error);
});

