(function ($) {
  Chart.defaults.scale.ticks.autoSkipPadding = 80;

  if (typeof(widget) !== 'undefined') {
    throw new Error("jQuery Widget not found.");

  }

  else {
    $.widget("nemac.tidalstationwidget", {
      options: {
        responsive: true,
        station: '',
        data_url: ''
      },
      data: {},
      _create: function (options) {
        var defaults = {
          responsive: true,
          data_url: 'tidal_data.json'
        };

        this.options = Object.assign(defaults, options);

        var self = this;
        $.getJSON(this.options.data_url, function (json) {
          self.data = json;
        });
      },
      update: function (options) {
        this.options = Object.assign(this.options, options);

        // transform data from object to array
        var data_hist = [];
        for (var i = 1950; i <= 2016; i++) {
          try {
            data_hist.push(this.data.hist[this.options.station][i]);
          }
          catch (e) {
            if (e instanceof TypeError) {
              data_hist.push(0);
            }
          }
        }

        // turn projected data values into an array
        var labels = [];
        var data_rcp45 = [];
        var data_rcp85 = [];
        for (var i = 1950; i <= 2100; i++) {
          // build an array of labels
          labels.push(i.toString());

          // prepend 0s to historical range
          if (i <= 2000) {
            data_rcp45.push(0);
            data_rcp85.push(0);
          } else {
            data_rcp45.push(this.data.rcp45[this.options.station][i]);
            data_rcp85.push(this.data.rcp85[this.options.station][i]);
          }
        }

        // compose chart
        var ctx = this.element[0].getContext('2d');
        this.chart = new Chart(ctx, {
          type: 'bar',
          responsive: this.options.responsive,
          data: {
            labels: labels,
            datasets: [
              {
                data: data_hist,
                label: "Historic",
                backgroundColor: "#aaaaaa",
                borderColor: "#aaaaaa",
                fill: false
              },
              {
                data: data_rcp45,
                label: "RCP 4.5",
                backgroundColor: "#0058cf",
                borderColor: "#0058cf",
                fill: false
              }, {
                data: data_rcp85,
                label: "RCP 8.5",
                backgroundColor: "#f5442d",
                borderColor: "#f5442d",
                fill: false
              }
            ]
          },
          options: {
            responsive: this.options.responsive,
            events: [],
            tooltipTemplate: "<%=datasetLabel%> : <%= value %>",
            legend: {
              display: true,
              labels: {
                fontColor: 'black'
              }
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  max: 365,
                  stepSize: 100,
                  maxTicksLimit: 20
                }
              }]
            }
          }
        });

      }
    });
  }
})(jQuery);
