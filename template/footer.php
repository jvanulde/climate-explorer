<!-- START:JS_LOADER -->

<script type="text/javascript" src="./resources/js/chart/chart.core.js"></script>
<script type="text/javascript" src="./resources/js/chart/chart.line.js"></script>

<script type="text/javascript" src="./resources/js/formstone/core.js"></script>
<script type="text/javascript" src="./resources/js/formstone/mediaquery.js"></script>
<script type="text/javascript" src="./resources/js/formstone/touch.js"></script>
<script type="text/javascript" src="./resources/js/formstone/scrollbar.js"></script>
<script type="text/javascript" src="./resources/js/formstone/dropdown.js"></script>
<script type="text/javascript" src="./resources/js/formstone/equalize.js"></script>
<script type="text/javascript" src="./resources/js/formstone/swap.js"></script>
<script type="text/javascript" src="./resources/js/formstone/tabs.js"></script>

<script type="text/javascript" src="./resources/js/lc_switch.min.js"></script>
<script type="text/javascript" src="./resources/js/jquery.cycle2.min.js"></script>
<script type="text/javascript" src="./resources/js/jquery.waypoints.min.js"></script>
<script type="text/javascript" src="./resources/js/jquery.waypoints.sticky.min.js"></script>
<script type="text/javascript" src="./resources/js/split-pane.min.js"></script>
<script type="text/javascript" src="./resources/js/download.js"></script>
<script type="text/javascript" src="./resources/js/jquery.hoverintent.min.js"></script>

<script type="text/javascript" src="./resources/js/variables.js"></script>
<script type="text/javascript" src="./resources/js/climate-widget-graph.js"></script>

<script type="text/javascript" src="./resources/js/ol.js"></script>
<script type="text/javascript" src="./resources/js/ol3-popup.js"></script>

<!-- if CASE -->
<?php if (isset($case) && $case != null) { ?>
  <script type="text/javascript" src="./resources/js/multigraph-nojq.min.js"></script>
  <script type="text/javascript" src="./resources/js/main.js"></script>
  <script type="text/javascript" src="./resources/js/chart.js"></script>
  <script>
    $(document).ready(function() {
      app = new App(<?php echo "'" . $case . "'"; ?>);
    });
  </script>

<?php } ?>

<script type="text/javascript" src="./resources/js/global_functions.js"></script>

<script>
  $(document).ready(function() {
    variables = new Variables();
  });
</script>

<!-- END:JS_LOADER -->
