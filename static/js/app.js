function buildMetadata(sample) {

  var url = `/metadata/${sample}`;

  // @TODO: Complete the following function that builds the metadata metaData
  // Use `d3.json` to fetch the metadata for a sample 
  d3.json(url).then(function(data){
    // Use d3 to select the metaData with id of `#sample-metadata`
    var metaData = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metaData.html("");
    // Use `Object.entries` to add each key and value pair to the metaData
    Object.entries(data).forEach(function ([key, value]) {
      metaData.append("h6").text(`${key}: ${value}`);
      // console.log(key,value);
    });

  });
  // Use `d3.json` to fetch the metadata for a sample
   



    // Use `Object.entries` to add each key and value pair to the metaData
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.


    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  var urlsample = `/samples/${sample}`

  d3.json(urlsample).then(function(data){

    var otu_ids = data.otu_ids;
    var otu_labels = data.otu_labels;
    var sample_values = data.sample_values;
    // console.log(otu_ids,otu_labels,sample_values);

    var bubbleChart = {
      margin:{t:0},
      hovermode:"closest",
      xaxis:{title: "OTU ID"}
    };

    var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'YIGnBu'}
      }];

    Plotly.plot("bubble",bubbleData,bubbleChart);
    // @TODO: Build a Pie Chart
    var pieData = [{
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
      values: sample_values.slice(0,10),
      labels:otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      hoverinfo: "hovertext",
      type: "pie"
    }];

    var pieChart = {
      margin: { t:0, l:0}
    };
    Plotly.plot("pie",pieData,pieChart);

  });



}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
