function initChart(canvas, width, height) {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(chart);
  
    var option = {
      title: {
        text: '',
        left: 'center'
      },
      color: ["red", "blue"],
      legend: {
        data: ['最高温', '最低温'],
        top: 50,
        left: 'center',
        backgroundColor: 'white',
        z: 100
      },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['一', '二', '三', '四'],
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
        // show: false
      },
      series: [{
        name: '最高温',
        type: 'line',
        smooth: true,
        data: [-5, 22, 30, 30]
      }, {
        name: '最低温',
        type: 'line',
        smooth: true,
        data: [12, -20, 41, 35]
      }]
    };
  
    chart.setOption(option);
    return chart;
  }