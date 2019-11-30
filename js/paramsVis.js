class ParamsVis {
  constructor() {
    this.circleSize = 5;
    this.config = {
      width: 400,
      height: 400,
      padding: {
        left: 30,
        top: 50,
        bottom: 30,
        right: 15
      }
    };
    // sample url: http://edwardsjohnmartin.github.io/MagPhyx/?initparams=1,0,0,0.721905,-0.0589265,0.0455992
    this.baseUrl = 'http://edwardsjohnmartin.github.io/MagPhyx/?initparams=';

  }

  getUrlFromCsv(row) {
    let split = row.split(' ');
    let result = `${this.baseUrl}${split[6]},${split[7]},${split[8]},${split[9]},${split[10]},${split[11]}`;
    return result;
  }

  /**
   * Init function - initialize the vis, linking the simulations in order
   * @param simOrder - an array containing the order of points
   */
  init(data, simOrder) {
    let myConfig = this.config;
    console.log('Param data', data);
    // split each of the command arguments
    let parent = -1;
    let index = 0;
    let derived = data.map((d) => {
      let command = d['columns'][0];
      let split = command.split(' ');
      let value = {
        theta: +split[9],
        beta: +split[10],
        id: parent + 1,
        parent: parent,
        order: simOrder[index],
        command: command,
        url: this.getUrlFromCsv(command)
      }
      parent++;
      index++;
      return value;
    })
    console.log('derived', derived);

    // set up the x axis
    let xscale = d3.scaleLinear()
      .domain([
        d3.min(derived, (d) => {
          return d.theta;
        }),
        d3.max(derived, (d) => {
          return d.theta;
        })
      ])
      .range([this.config.padding.left, this.config.width - this.config.padding.right])
      ;

    // set up the y axis
    let yscale = d3.scaleLinear()
      .domain([
        d3.min(derived, (d) => {
          return d.beta;
        }),
        d3.max(derived, (d) => {
          return d.beta;
        })
      ])
      .range([this.config.padding.left, this.config.width - this.config.padding.right])
      ;

    // add a svg for the vis
    let displaySvg = d3.select('#param-vis')
      .append('svg')
      .attr('width', myConfig.width)
      .attr('height', myConfig.height)

    // add a line from each point to its parent
    let links = displaySvg.selectAll('path')
      .data(derived)
      .enter()
      .append('path')
      .attr('d', function (d) {
        let p = derived[d.parent];
        if (undefined == p) {
          return `M ${xscale(d.theta)} ${yscale(d.beta)} L ${xscale(d.theta)} ${yscale(d.beta)}`;
        }
        return `M ${xscale(d.theta)} ${yscale(d.beta)} L ${xscale(p.theta)} ${yscale(p.beta)}`;
      })
      .style('fill', 'red')
      .style('stroke', 'orange')
      .style('stroke-width', '2')
      .attr('id', d => { return d.id; })
      .attr('parent', d => { return d.parent; })
      ;

    let paramsVis = this;

    // add circles for every param combo
    let params = displaySvg.selectAll('circle')
      .data(derived)
      .enter()
      .append('circle')
      .attr('cx', d => {
        return xscale(d.theta);
      })
      .attr('cy', d => {
        return yscale(d.beta);
      })
      .attr('r', () => {
        return paramsVis.circleSize;
      })
      .style('fill', 'blue')
      .attr('id', d => { return d.id; })
      .attr('parent', d => { return d.parent; })
      .on('mouseover', function (d) {
        d3.select(this)
          .attr('r', () => {
            return paramsVis.circleSize * 1.3;
          })
          ;
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .attr('r', () => {
            return paramsVis.circleSize;
          })
          ;
      })
      .on('click', d => {
        window.open(d.url);
      })
      ;
  }
}
