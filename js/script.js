/**
 * This file is the starting point for the program.
 * It loads the data and initializes the visualizations.
 */

console.log('Starting script');

let dataSet = data_sets[0];
let reorderer = ways_to_reorder[0];
let distance_func = distance_functions[0];

// TODO define an array of data possibilities that has a similar
// structure to these settings but can be switched at runtime
let settings = {
  NUM_FILES: 2, // change this to vary how many files of events/commands will be used
  reorderData: false, // change this to false to turn off z-ordering
  dataset: 'momentumTradingData', // change this to use a different data set
    // data4 - grid data
    // data6 - random data
    // data7 - random data
    // 
  hilbert: false, // false = use z order, true = use hilbert order
}
let eventTypeVis = new EventTypeVis(settings.NUM_FILES);
let paramVis = new ParamsVis();
let scatter = new Scatter();
let allData = {};


// let each vis know about the other event vis
scatter.setParamVis(paramVis);
scatter.setEventVis(eventTypeVis);
paramVis.setScatter(scatter);
paramVis.setEventVis(eventTypeVis);
eventTypeVis.setParamVis(paramVis);
eventTypeVis.setScatterVis(scatter);

// setup the radio buttons for the settings
addDataInput();
addReorderSelector();
// addDistanceSelector();

// kick off the vis by loading the data
loadDataAndVis(dataSet);


function loadDataAndVis(selectedDataSet) {
  // get how many digits are required to represent the number
  let slice_format = selectedDataSet.sim_count.toString().length; 
  let zeros = '0'.repeat(slice_format);
  // create promises so all data can load asynchronous
  // promise the param data
  let paramDataPromises = [];
  if (selectedDataSet.param_folder != null) {
    for (let i = 0; i < selectedDataSet.sim_count; i++) {
      let path = `data/${selectedDataSet.param_folder}/commands${(zeros + i).slice(-1 * slice_format)}.csv`;
      // console.log('Path: ', path);
      paramDataPromises.push(d3.csv(path));
    }
  }

  // promise the event data
  let dataPromises = [];
  for (let i = 0; i < selectedDataSet.sim_count; i++) {
    let path = `data/${selectedDataSet.events_folder}/events${(zeros + i).slice(-1 * slice_format)}.csv`
    // console.log('Path: ', path);
    dataPromises.push(d3.csv(path));
  }

  // load the param data
  Promise.all([...paramDataPromises]).then((paramData) => {
    console.log('Param data loaded');
    // load the event data
    Promise.all([...dataPromises]).then(function (eventData) {
      console.log('All data loaded');

      paramData = standardizeParamData(paramData);

      let data = selectedDataSet.parse(eventData, paramData);
      console.log('Parsed data: ', data);
      // allData = JSON.parse(JSON.stringify(data));
      allData = data;

      loadVis(data, reorderer);

    }).catch(function (err) {
      console.log('Error in main script: ', err);
      console.trace(err);
    })
  });
}

function loadVis(data, reorderer) {
  let orderedData = reorderer.reorder(data, distance_func);

  // initialize the param and the scatter vis
  paramVis.init(orderedData);
  scatter.init(orderedData);

  // TODO this should be more dynamic - switched to an array of 
  // distance calculation functions
  // let distances = calcDistances(orderedParamData);

  eventTypeVis.setNumSimulations(orderedData.simulations.length);
  eventTypeVis.setEventCols(orderedData.eventTypes);
  addEventTypeSelector(orderedData);
}

function addDataInput() {
  // add the event type selection boxes
  d3.select('#settings')
    .append('h4')
    .text('Data Set:')
    ;

  d3.select('#settings')
    .append('form')
    .selectAll('input')
    .data(data_sets)
    .enter()
    .append('g')
    .attr('class', 'data-options')
    ;

  // create buttons so the user can select which event type to display
  d3.selectAll('.data-options')
    .append('input')
    .attr('type', 'radio')
    .attr('name', 'event')
    .attr('value', (d) => { return d; })
    .text(d => { return `${d.name}`; })
    .on('click', (d) => {
      console.log('type', d);
      loadDataAndVis(d);
    })
    ;

  d3.selectAll('.data-options')
    .append('label')
    .text(d => { return `${d.name}`; })
    ;

  d3.selectAll('.data-options')
    .append('br')
    ;

}

function addReorderSelector() {
  // add the event type selection boxes
  d3.select('#settings')
    .append('h4')
    .text('Order:')
    ;

  d3.select('#settings')
    .append('form')
    .selectAll('input')
    .data(ways_to_reorder)
    .enter()
    .append('g')
    .attr('class', 'order-options')
    ;

  // create buttons so the user can select which event type to display
  d3.selectAll('.order-options')
    .append('input')
    .attr('type', 'radio')
    .attr('name', 'event')
    .attr('value', (d) => { return d; })
    .text(d => { return `${d.name}`; })
    .on('click', (selectedOrder) => {
      console.log('order', selectedOrder);
      for (let i = 0; i < ways_to_reorder.length; i++) {
        let oneWayToReorder = ways_to_reorder[i];
        if (oneWayToReorder.name == selectedOrder.name) {
          if(selectedOrder.name.toLowerCase().includes('distance')) {
            addDistanceSelector();
          } else {
            removeDistanceSelector();
          }
          loadVis(allData, oneWayToReorder);
        }
      }
    })
    ;

  d3.selectAll('.order-options')
    .append('label')
    .text(d => { return `${d.name}`; })
    ;

  d3.selectAll('.order-options')
    .append('br')
    ;

  d3.select('#settings')
    .append('br')
    ;
}

const distClassTag = 'distance-function';
const distHeadingTag = 'distance-select-heading';
function removeDistanceSelector() {
  d3.selectAll(distClassTag)
    .remove();

  d3.selectAll(`.${distHeadingTag}`)
    .remove();
}

function addDistanceSelector() {
  // add the event type selection boxes
  d3.select('#settings')
    .append('h4')
    .text('Distance Function:')
    ;

  d3.select('#settings')
    .append('form')
    .selectAll('input')
    .data(distance_functions)
    .enter()
    .append('g')
    .attr('class', distClassTag)
    ;

  // create buttons so the user can select which event type to display
  d3.selectAll(`.${distClassTag}`)
    .append('input')
    .attr('type', 'radio')
    .attr('name', 'event')
    .attr('value', (d) => { return d; })
    .text(d => { return `${d.name}`; })
    .on('click', (selectedDistance) => {
      console.log('Selected Distance', selectedDistance);
      distance_func = selectedDistance;
      loadVis(allData, reorderer);
    })
    ;

  d3.selectAll(`.${distClassTag}`)
    .append('label')
    .text(d => { return `${d.name}`; })
    ;

  d3.selectAll(`.${distClassTag}`)
    .append('br')
    ;

  d3.select('#settings')
    .append('br')
    ;
}


function addEventTypeSelector(data) {
  console.log('Adding event type selector', data);

  d3.selectAll('.checkboxes')
    .remove()
    ;

  // add the event type selection boxes
  d3.select('#event-groups')
    .append('form')
    .selectAll('input')
    .data(data.eventTypes)
    .enter()
    .append('g')
    .attr('class', 'checkboxes')
    ;

  // create buttons so the user can select which event type to display
  d3.selectAll('.checkboxes')
    .append('input')
    .attr('type', 'radio')
    .attr('name', 'event-type')
    .attr('value', (d) => { return d; })
    .text(d => { return `${d}`; })
    .on('click', (type) => {
      data.simulations = allData.simulations.map(simulation => {
        simulation.events = simulation.events.filter(event => {
          return event['event_type'] == type;
        })
        return simulation;
      })
      console.log("filtered data: ", data);
      eventTypeVis.removeEventsMatch()
      eventTypeVis.update(data);
    })
    ;

  d3.selectAll('.checkboxes')
    .append('label')
    .text(d => { return `${d}`; })
    ;

  d3.selectAll('.checkboxes')
    .append('br')
    ;
}

