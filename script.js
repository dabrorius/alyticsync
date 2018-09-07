function generateName(data, cfg) {
    var colDim = cfg.primary_category.name,
        valDim = cfg.primary_value.name;
    return valDim + ' by ' + colDim;
}

function renderSlide(ingore, cfg, done) {

    if (!cfg.primary_category || !cfg.primary_value) {
        return;
    }

    var svg = d3.select(target),
        chart,
        css = alytic.css.card,
        series,
        toolTipGap = 45,
        x,
        y,
        i,
        // This and further bars until 50 will be coloured as Other. Note that this 50 value was defined in the queries
        threshold = 20,
        maxMargin = 150,
        margins,
        colDim = cfg.primary_category,
        colDimOrder = cfg.primary_category_order,
        valDim = cfg.primary_value,
        query = {
            fields: [{
                name: '${primary_category}',
                null_value: '[Blank]'
            }, {
                name: '${primary_value}'
            }],
            simple: false
        };
    if (colDim.type !== 'time') {
        query.fields[0].top = 50;
        query.fields[0].top_field = '${primary_value}';
    }
    getData(query)
        .then(function(data) {
            var colDimName = colDim.name + (colDim.type === 'time' ? ' ' : ''),
                seriesDim = colDim.type === 'time' ? null : colDim.name;

            // Create a additional column for formatted values of Time dimension
            if (colDim.type === 'time') {
                alytic.addExtraField(data, colDim, colDim.name + ' ');
            }

            chart = new dimple.chart(svg, data[0].data);

            // Sort Data in descending order by Value dimension (we need it to distinguish bars - see the further code)
            data[0].data = data[0].data.sort(function(a, b) {
                var aVal = a[valDim.name],
                    bVal = b[valDim.name];
                if (aVal === bVal)
                    return 0;
                else if (aVal > bVal)
                    return -1;
                return 1;
            });

            // Colour Bars from 20 to 50 as Other. Also process the Other column.
            for (i = 0; i < data[0].data.length; i++) {
                if (i >= threshold)
                    chart.assignClass(data[0].data[i][colDim.name], css.series.other);
                // Also set the colour of Other
                if (data[0].meta.fields && data[0].meta.fields[colDim.name].other_label && (data[0].data[i][colDim.name] === data[0].meta.fields[colDim.name].other_label))
                    chart.assignClass(data[0].data[i][colDim.name], css.series.other);
            }

            x = alytic.dimple.addOrderedCategoryAxis(data, chart, 'x', colDimName, colDim, null, colDimOrder, null, valDim);

            alytic.cssDimple(chart, 'card');
            y = chart.addMeasureAxis('y', valDim.name);
            alytic.dimple.formatAxis(y, valDim);
            series = alytic.dimple.addOrderedSeries(data, chart, seriesDim, dimple.plot.bar, colDim, colDimOrder, valDim);
            margins = alytic.dimple.drawToFit(chart, {
                left: 0,
                top: toolTipGap,
                right: 0,
                bottom: 0
            }, {
                bottom: maxMargin
            });
            series.shapes.each(function(d) {
                var shape = d3.select(this);
                shape.attr("data-role", alytic.role.shape)
                    .attr("data-dimension", cfg.primary_category.name)
                    .attr("data-point", d.aggField[d.aggField.length - 1])
                    .attr('x', parseFloat(shape.attr('x')) + (parseFloat(shape.attr('width')) > 3 ? 3 : 0))
                    .attr('width', (parseFloat(shape.attr('width')) > 3 ? parseFloat(shape.attr('width')) - 3 : parseFloat(shape.attr('width'))))
                    .attr('height', (parseFloat(shape.attr('height')) > 3 ? parseFloat(shape.attr('height')) - 3 : parseFloat(shape.attr('height'))));
                if (!alytic.labelRectangle(this, alytic.format(d.yValue, valDim), null, css, cfg.primary_category, d.x)) {
                    alytic.labelAboveRectangle(this, alytic.format(d.yValue, valDim), css);
                }

                // Add drill through
                if ((cfg.drill_hierarchy && cfg.drill_hierarchy.length) || (cfg.drill_measures && cfg.drill_measures.length)) {
                    shape.style("cursor", "pointer");
                    shape.on("click", function(e) {
                        drillThrough({
                            hierarchy: cfg.drill_hierarchy,
                            measures: cfg.drill_measures,
                            filter: {
                                op: "and",
                                conditions: [
                                    alytic.getCondition(colDim, e.x, data[0].data)
                                ]
                            },
                            title: e.x
                        });
                    });
                }
            });
            alytic.addBarTooltips(series.shapes, css, chart._assignedClasses, function(d) {
                return [d.xField, alytic.formatValue(d.yValue, valDim)];
            }, cfg.primary_category);

            if (cfg.primary_category.type === "time") {
                alytic.cleanAxis(x, 20);
            }

            done();

        });
}

return {
    generateName: generateName,
    renderSlide: renderSlide
};