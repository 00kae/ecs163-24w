// graph 1: bar graph total pokemon with all types vs total stats
// graph 2: dot plot pokemon with all types vs hp and attack
// graph 3: star plot with the type that has the highest total
//
// hw 3
// graph 1: zoom on points
//
// graph 3: will integrate animation and selection, where you can 
// see the states for each individual pokemon if you click its name

const width = window.innerWidth;
const height = window.innerHeight;

let scatterLeft = 0, scatterTop = 0;
let scatterMargin = {top: 10, right: 30, bottom: 30, left: 60},
    scatterWidth = 400 - scatterMargin.left - scatterMargin.right,
    scatterHeight = 350 - scatterMargin.top - scatterMargin.bottom;

let distrLeft = 1400, distrTop = 200;
let distrMargin = {top: 10, right: 30, bottom: 50, left: 60},
    distrWidth = 100 - distrMargin.left - distrMargin.right,
    distrHeight = 260 - distrMargin.top - distrMargin.bottom;

let typeLeft = 0, typeTop = 400;
let typeMargin = {top: 10, right: 30, bottom: 30, left: 60},
    typeWidth = width - typeMargin.left - typeMargin.right,
    typeHeight = height-450 - typeMargin.top - typeMargin.bottom;

d3.csv("pokemon_alopez247.csv").then(rawData =>{
    console.log("rawData", rawData);
    
    // d being total dataset
    rawData.forEach(function(d){
        d.HP = Number(d.HP);
        d.Attack = Number(d.Attack);
        d.Total = Number(d.Total);
        d.Defense = Number(d.Defense);
        d.Sp_Atk = Number(d.Sp_Atk);
        d.Sp_Def = Number(d.Sp_Def);
        d.Speed = Number(d.Speed);
        
    });


    rawData = rawData.map(d=>{
                          return {
                              "Type_1":d.Type_1,
                              "Name":d.Name,
                              "HP":d.HP,
                              "Attack":d.Attack,
                              "Total":d.Total,
                              "Defense":d.Defense,
                              "Sp_Atk":d.Sp_Atk,
                              "Sp_Def":d.Sp_Def,
                              "Speed":d.Speed,
                          };
    });
    console.log(rawData);
    
//plot 1
    const svg = d3.select("svg")

    const g1 = svg.append("g")
                .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
                .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
                .attr("transform", `translate(${scatterMargin.left}, ${scatterMargin.top})`)

    const g1points = svg.append("g")
            .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
            .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
            .attr("transform", `translate(${scatterMargin.left}, ${scatterMargin.top})`)

    // Chart title
    g1.append("text")
    .attr("x", scatterWidth / 2)
    .attr("y", 0)
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("font-family", "Roboto")
    .text("Total HP to Total Attack of all Pokemon Types")

    // X label
    g1.append("text")
    .attr("x", scatterWidth / 2)
    .attr("y", scatterHeight + 50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("font-family", "Roboto")
    .text("Attack totals")
    

    // Y label
    g1.append("text")
    .attr("x", -(scatterHeight / 2))
    .attr("y", -40)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("font-family", "Roboto")
    .text("HP totals")

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

    const rects = g1points.selectAll("circle").data(rawData)

    rects.enter().append("circle")
         .attr("cx", function(d){
             return x1(d.Attack);
         })
         .attr("cy", function(d){
             return y1(d.HP);
         })
         .attr("r", 3)
         .attr("fill", "#7a6bae")
    
    var zoom = d3.zoom()
         .scaleExtent([1, 10])
         .on("zoom", zoomed);
    svg.call(zoom);

        function zoomed() {
                var t = d3.event.transform;
                g1points.attr("transform", t);
                xScale = t.rescaleX(xScaleOri);
                yScale = t.rescaleY(yScaleOri);
                axisXG.call(xAxis.scale(xScale))
                axisYG.call(yAxis.scale(yScale))
        }


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

   // Chart title
   g3.append("text")
   .attr("x", typeWidth / 2)
   .attr("y", -10)
   .attr("font-size", "20px")
   .attr("text-anchor", "middle")
   .text("Total Battle Statistics of Each Pokemon Type")

    // X label
    g3.append("text")
    .attr("x", typeWidth / 2)
    .attr("y", typeHeight + 50)
    .attr("font-size", "15px")
    .attr("text-anchor", "middle")
    .text("Type")
    

    // Y label
    g3.append("text")
    .attr("x", -(typeHeight / 2))
    .attr("y", -40)
    .attr("font-size", "15px")
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

    const g4 = svg.append("g")
            .attr("width", distrWidth + distrMargin.left + distrMargin.right)
            .attr("height", distrHeight + distrMargin.top + distrMargin.bottom)
            .attr("transform", `translate(${distrLeft}, ${distrTop})`)

    // plot 3
    // focus on water types, with HP,Attack,Defense,Sp_Atk,Sp_Def,Speed
    // star plot
    // references:
    // https://d3js.org/d3-shape/radial-line#lineRadial
    // https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event
    // 

    const waterPkmn = rawData.filter(pokemon => pokemon.Type_1 === "Water");

    const waterStats = waterPkmn.map(pokemon =>{
                                return {
                                    "HP":pokemon.HP,
                                    "Attack":pokemon.Attack,
                                    "Defense":pokemon.Defense,
                                    "Sp_Atk":pokemon.Sp_Atk,
                                    "Sp_Def":pokemon.Sp_Def,
                                    "Speed":pokemon.Speed
                                                            
                                };
    });
    const waterName  = waterPkmn.map(pokemon => {
                                return {
                                    "Name":pokemon.Name,
                                };
    });

    console.log(waterStats);

    const avgStats = {};
    Object.keys(waterStats[0]).forEach(stat => {
        avgStats[stat] = waterStats.reduce((acc, curr) => acc + curr[stat], 0) / waterStats.length;
    });

    const angles = Object.keys(avgStats);
    console.log(avgStats);

    // circle / length
    const angleSlice = Math.PI * 2 / angles.length;
    
    const line = d3.line()
        .x(d => d.x)
        .y(d => d.y);

    const svgWidth = 700;
    const svgHeight = 600;

    const radius = Math.min(svgWidth, svgHeight) / 2 - 20;

    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;
    
    const categoryLabels = ["HP", "Attack", "Defense", "Sp_Atk", "Sp_Def", "Speed"];

        // creating angles for each attribute in the radar
        for (let i = 0; i < angles.length; i++) {
            const angle = angleSlice * i;

            const lineData = [
                { x: centerX, y: centerY },
                { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) }
            ];
            console.log(lineData);

            g4.append("path")
                .datum(lineData)
                .attr("d", line)
                .attr("class", "axis-line");

            // proper alignment offsetting
            const xOffset = Math.cos(angle - Math.PI / 2) * 85; 
            const yOffset = Math.sin(angle - Math.PI / 2) * 85; 

            // alignment of labels
            const x = centerX + (radius - 140) * Math.cos(angle) + xOffset;
            const y = centerY + (radius - 140) * Math.sin(angle) + yOffset;

            g4.append("text")
                .attr("x", x -340)
                .attr("y", y -300)
                .attr("font-size", "15px")
                .text(categoryLabels[i])
                .attr("text-anchor", "middle")
        }

    const dataVal = Object.keys(avgStats).map(key => avgStats[key]);
    console.log(dataVal);
    
    const radarLine = d3.lineRadial()
        .radius(d => (d / 200) * radius)
        .angle((d, i) => i * angleSlice);
    console.log(radarLine);
    
        // radar
        g4.append("path")
            .datum(dataVal)
            .attr("d", radarLine)
            .attr("class", "radar-chart-area")
            .attr("fill", "rgba(0, 50, 500, 0.5)")
    
        // title
        g4.append("text")
            .attr("x", distrWidth / 2)
            .attr("y", distrHeight)
            .attr("font-size", "18px")
            .attr("text-anchor", "middle")
            .text("Total Stats of Water Type Pokemon")

        
        function updateRadarChart(stats) {
            const dataVal = Object.keys(avgStats).map(key => stats[key]);
            g4.select(".radar-chart-area")
                .datum(dataVal)
                .transition()
                    .duration(1000)
                .attr("d", radarLine);
        }

        // list of water type pokemon to check individual stats
        const pokemonBalls = svg.append("g")
            .attr("transform", `translate(${svgWidth + 890}, ${-20})`);


        const pokemonList = pokemonBalls.append("g");
        
        waterPkmn.forEach((pokemon, index) => {
            const pokemonItem = pokemonList.append("text")
              .attr("x", 0)
              .attr("y", index * 10)
              .text(pokemon.Name)
              .attr("font-size", "10px")
              .style("cursor", "pointer")
              .on("click", function() {
                // https://d3js.org/d3-transition/selecting
                // this needs work
                d3.select(this);
                        updateRadarChart({
                                    "HP": pokemon.HP,
                                    "Attack": pokemon.Attack,
                                    "Defense": pokemon.Defense,
                                    "Sp_Atk": pokemon.Sp_Atk,
                                    "Sp_Def": pokemon.Sp_Def,
                                    "Speed": pokemon.Speed
                        });
              });
          });

}).catch(function(error){
    console.log(error);
});

