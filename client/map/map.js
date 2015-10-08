var map = angular.module('greenfeels.map', ['ngAnimate']);

map.controller('MapController', ['$scope', '$state', '$animate', 'Prompts', 'Entries', 'Twemoji',
  function($scope, $state, $animate, Prompts, Entries, Twemoji) {
    // Expose our Twemoji service within the scope.
    // This is used to conveniently generate the `src`
    // attributes of the <img> tags within the buttons.
    $scope.getTwemojiSrc = Twemoji.getTwemojiSrc;

    $state.transitionTo('map.initial');

    $scope.selectHandler = function($event) {
      $state.transitionTo('map.selected');
      clearSelectedStates();
      var emotion = $event.currentTarget.attributes['data-emotion-id'].value;
      $event.currentTarget.classList.add('selected-emoji');
      makeMap(emotion);
    };

    var makeMap = function (emotion) {

      var fill = d3.scale.linear()
        .domain([-1, 1])
        .range("red", "blue");

      var draw = function (words) {
        d3.select(".map").append("svg")
            .attr("width", 300)
            .attr("height", 300)
          .append("g")
            .attr("transform", "translate(150,150)") //figure out what this is later
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", function(d) { return d.frequency + "px"; })// change this to be dependent on data.frequency
            .style("font-family", "Raleway")
            .style("fill", function(d) { return fill(d.averageSentiment); }) //change this to be data.averageSentiment
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.word; });
      };

      // Entries.getWords(emotion)
      //   .then(function(data) {
      //     d3.layout.cloud().size([650, 650])
      //       .words(data)
      //       .rotate(function() { return ~~(Math.random() * 2) * 90; })
      //       .font("Raleway")
      //       .fontSize(function(d) { return d.frequency; })
      //       .on("end", draw)
      //       .start();
      //   });

      var myWords = Entries.getWords(emotion);

      d3.layout.cloud().size([600, 600])
        .words(myWords)
        // .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Raleway")
        .fontSize(function(d) { return d.frequency; })
        .text(function(d) { return d.word; })
        .on("end", draw)
        .start();

    };

    function clearSelectedStates() {
      var selected = document.getElementsByClassName('selected-emoji');
      for (var i = 0; i < selected.length; i++) {
        selected[i].classList.remove('selected-emoji');
      }
    }

  }]);
