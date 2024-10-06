// Create SVG container
const margin = { top: 20, right: 30, bottom: 40, left: 50 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the CSV data
d3.csv("data.csv").then(function (data) {
    // Convert the year to a number and value to numeric format
    data.forEach(d => {
        d.year = +d.year;
        d.value = +d.value;
    });

    // Set up scales
    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    const y = d3.scaleLinear()
        .range([height, 0]);

    // Set up the initial chart based on the first year in the dataset
    const initialYear = d3.min(data, d => d.year);
    updateChart(initialYear);

    // Slider interaction
    const slider = d3.select("#year-slider");
    slider.on("input", function () {
        const selectedYear = +this.value;
        d3.select("#year-label").text(selectedYear);
        updateChart(selectedYear);
    });

    // Throttling function to limit the frequency of scroll events
    function throttle(func, delay) {
        let lastCall = 0;
        return function (...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return func(...args);
        };
    }

    // Add scroll interaction to update the slider with throttling
    d3.select("body").on("wheel", throttle(function(event) {
        event.preventDefault();

        // Get the current value of the slider
        let currentYear = parseInt(slider.property("value"));

        // Check scroll direction and adjust the slider value accordingly
        if (event.deltaY < 0) {
            // Scrolling up, decrease the slider value (if not at minimum)
            if (currentYear > slider.property("min")) {
                slider.property("value", currentYear - 1);
            }
        } else {
            // Scrolling down, increase the slider value (if not at maximum)
            if (currentYear < slider.property("max")) {
                slider.property("value", currentYear + 1);
            }
        }

        // Update the visualization based on the new slider value
        const newYear = +slider.property("value");
        d3.select("#year-label").text(newYear);
        updateChart(newYear);
    }, 50));  // 300 ms delay between scroll events

    // Function to update the chart based on the year
    function updateChart(year) {
        // Filter data for the selected year
        const yearData = data.filter(d => d.year === year);

        // Update the scales
        x.domain(yearData.map(d => d.category));
        y.domain([0, d3.max(yearData, d => d.value)]);

        // Bind data to rectangles (bars)
        const bars = svg.selectAll(".bar")
            .data(yearData, d => d.category);

        // Enter new bars
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.category))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", "steelblue");

        // Update existing bars
        bars.transition()
            .duration(700)
            .attr("x", d => x(d.category))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.value));

        // Remove old bars
        bars.exit().remove();
    }
});
