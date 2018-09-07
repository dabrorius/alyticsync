function generateName(data, cfg) {
    var colDim = cfg.primary_category.name,
        valDim = cfg.primary_value.name;
    return valDim + ' by ' + colDim;
}

function renderSlide(data, cfg, done) {
  var myChart = new dimple.chart(svg, data);
  myChart.noFormats = true;
  myChart.setBounds(50, 50, alytic.cardSize.width - 100, alytic.cardSize.height - 100);
  myChart.addCategoryAxis("x", cfg.primary_category.name);
  myChart.addMeasureAxis("y", cfg.primary_value.name);
  myChart.addSeries(null, dimple.plot.bar);
  myChart.draw();

    svg.selectAll("rect").attr("class", "alytic-shape alytic-color14");
    svg.append("text").attr("class", "alytic-label alytic-color14").attr("x", 80).attr("y", 120).text("TEST");

    done();
}

return {
    generateName: generateName,
    renderSlide: renderSlide
};