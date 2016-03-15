<!doctype html>
<html>
<head>
    <title>Climate Explorer</title>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" media="screen" href="resources/css/screen.css">


    <script type="text/javascript" src="./resources/js/jquery.min.js"></script>
    <script type="text/javascript" src="./resources/js/jquery-ui.min.js"></script>

</head>

<body id="page-location-seattle" class="page-type-location">

<?php include_once('template/header.php'); ?>

<div id="viewport">
    <div id="main-content-wrap">

        <?php include_once('template/share.php'); ?>
        
        <div id="location-search">
          <input type="text" class="autocomplete" placeholder="Search another location">
        </div>

        <section id="location-splash" class="page-splash">
            <div class="splash-text">
                <h1>Seattle, WA</h1>
                <h3>King County</h3>
                <p>The following provides a summary of the data for the location you have chosen. Explore the summaries or click on the graph or map for more details.</p>
            </div>

            <div id="page-nav">
                <h4>Jump to:</h4>

                <ul>
                    <li><a href="#location-temperature">Temperature</a></li>
                    <li><a href="#location-precipitation">Precipitation</a></li>
                    <li><a href="#location-derived">Derived</a></li>
                    <li><a href="#location-impacts">Relevant Impacts</a></li>
                </ul>
            </div>
        </section>

        <section id="location-temperature" class="location-data-section-wrap">
            <div class="location-data-section">
                <header>
                    <h3 class="accent-color"><span class="icon icon-temperature"></span>Temperature</h3>

                    <div class="data-vars">
                        <select id="data-type" class="dropdown">
                            <option value="projected">Projected</option>
                            <option value="historical">Historical</option>
                        </select>

                        <select id="data-season" class="dropdown">
                            <option value="spring">Spring</option>
                            <option value="summer">Summer</option>
                            <option value="autumn">Autumn</option>
                            <option value="winter">Winter</option>
                        </select>
                    </div>
                </header>

                <div id="temperature-data" class="data-list">
                    <ul class="data-options">
                      <li class="active accent-border"><a href="#" class="text accent-color">Average Mean</a><a href="#detail-temperature" class="icon icon-help nav-detail-link"></a></li>
                      <li class="accent-border"><a href="#" class="text accent-color">Average Low</a><a href="#" class="icon icon-help nav-detail-link"></a></li>
                      <li class="accent-border"><a href="#" class="text accent-color">Average High</a><a href="#" class="icon icon-help nav-detail-link"></a></li>
                      <li class="accent-border"><a href="#" class="text accent-color">Hottest</a><a href="#" class="icon icon-help nav-detail-link"></a></li>
                      <li class="accent-border"><a href="#" class="text accent-color">Coldest</a><a href="#" class="icon icon-help nav-detail-link"></a></li>
                      <li class="accent-border"><a href="#" class="text accent-color">Days over 90º</a><a href="#" class="icon icon-help nav-detail-link"></a></li>
                    </ul>
                    
                    <form onsubmit="return false;">
                        <div class="row">
                            <label for="county">County</label>
                            <select id="county" class="u-full-width">
                                <option value="37021" selected="selected">Buncombe County, NC</option>
                                <option value="41003">Benton County, OR</option>
                                <option value="04027">Yuma County, AZ</option>
                                <option value="53009">Clallam County, WA</option>
                                <option value="27077">Lake of the Woods County, MN</option>
                                <option value="30009">Lewis and Clark County, MT</option>
                            </select>
                        </div>
                        <div class="row">
                            <label for="frequency">Frequency</label>
                            <select id="frequency" class="u-full-width">
                                <option value="annual" selected="selected">Annual</option>
                                <option value="monthly">Monthly</option>
                                <option value="seasonal">Seasonal</option>
                            </select>
                        </div>
                        <div class="row">
                            <label for="timeperiod">Time Period</label>
                            <select id="timeperiod" class="u-full-width">
                                <option value="2025" selected="selected">30 Years Centered on 2025</option>
                                <option value="2050">30 Years Centered on 2050</option>
                                <option value="2075">30 Years Centered on 2075</option>
                            </select>
                        </div>
                        <div class="row">
                            <label for="variable">Variable</label>
                            <select id="variable" class="u-full-width">
                            </select>
                        </div>
                        <div class="row">
                            <div class="six columns">
                                <label for="scenario">Scenario</label>
                                <select id="scenario" class="u-full-width">
                                    <option value="both">RCP 8.5 and 4.5</option>
                                    <option value="rcp85" selected="selected">RCP 8.5</option>
                                    <option value="rcp45">RCP 4.5</option>
                                </select>
                            </div>
                            <div class="six columns">
                                <label for="presentation">Presentation</label>
                                <select id="presentation" class="u-full-width">
                                    <option value="absolute">Absolute</option>
                                    <option value="anomaly">Anomaly</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="six columns">
                                <label for="range">Range Band</label>
                                <select id="range" class="u-full-width">
                                    <option value="minmax" selected="selected">Min-Max</option>
                                    <option value="p1090">10th-90th</option>
                                    <!--<option value="both">Both</option>-->
                                </select>
                            </div>
                            <div class="six columns">
                                <label for="median">Show Medians</label>
                                <select id="median" class="u-full-width">
                                    <option value="false" selected="selected">Hide</option>
                                    <option value="true">Show</option>
                                </select>
                            </div>
                        </div>
                        <div class="center">
                            <button id="download-button">Download Data</button>
                        </div>
                        <div class="center">
                            <button><a id="download-image-link">Download Image</a></button>
                        </div>
                    </form>

                </div>


                <div id="temperature-tabs" class="data-accordion-wrap">
                    <div class="data-accordion">

                        <div id="temperature-chart" class="data-accordion-tab data-chart accent-background">
                            <header>
                                <h4>
                                    <span class="icon icon-emission-scenario"></span>
                      <span class="text">
                        Chart<span class="full-title">: Chart Title</span>
                        <span class="source">Source: <a href="#" target="_blank">NOAA, 2014</a></span>
                      </span>
                                </h4>

                                <div class="data-accordion-actions">
                                  <a href="#" class="download-image"><span class="icon icon-download-image"></span>Image</a>
                                  <a href="#" class="download-data"><span class="icon icon-download-chart"></span>Data</a>
                                </div>
                            </header>

                            <div class="data-accordion-content chart">
                                <div class="chart-wrap">
                                    <div class="chart-legend"></div>
                                    <div id="chart-123" class="chart-canvas" data-chart-ID="123"></div>
                                    <!--<canvas id="" class="chart-canvas" data-chart-ID="123" height="100" width="50"></canvas> -->


                                </div>


                                <div class="range">

                                    <div id="slider-range"></div>
                                    <div class="ui-slider-label range-label min">2010</div>
                                    <div class="ui-slider-label range-label max">2100</div>
                                </div>
                            </div>
                        </div>

                        <div id="temperature-map" class="data-accordion-tab data-map accent-background">
                            <header>
                                <h4 class="accent-color">
                                    <span class="icon icon-district"></span>
                      <span class="text">
                        Map<span class="full-title">: Map Title</span>
                        <span class="source">Source: <a href="#" target="_blank">NOAA, 2014</a></span>
                      </span>
                                </h4>
                                
                                <div class="data-accordion-actions">
                                  <a href="#" class="download-image"><span class="icon icon-download-image"></span>Image</a>
                                  <a href="#" class="download-data"><span class="icon icon-download-chart"></span>Data</a>
                                </div>
                            </header>

                            <div id="map-123" class="data-accordion-content map"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="location-precipitation" class="location-data-section-wrap">
            <div class="location-data-section">
                <header>
                    <h3 class="accent-color"><span class="icon icon-precipitation"></span>Precipitation</h3>

                    <div class="data-vars">
                        <select id="data-type" class="dropdown">
                            <option value="projected">Projected</option>
                            <option value="historical">Historical</option>
                        </select>

                        <select id="data-season" class="dropdown">
                            <option value="spring">Spring</option>
                            <option value="summer">Summer</option>
                            <option value="autumn">Autumn</option>
                            <option value="winter">Winter</option>
                        </select>
                    </div>
                </header>

                <div id="precipitation-data" class="data-list">
                  <ul class="data-options">
                    <li class="active accent-border"><a href="#" class="text accent-color">Average Mean</a><a href="#" class="icon icon-help nav-detail-link"></a></li>
                    <li class="accent-border"><a href="#" class="text accent-color">Total Rainfall</a><a href="#" class="icon icon-help nav-detail-link"></a></li>
                    <li class="accent-border"><a href="#" class="text accent-color">Precipitation Anomaly</a><a href="#" class="icon icon-help nav-detail-link"></a></li>
                    <li class="accent-border"><a href="#" class="text accent-color">Number of Wet Days</a><a href="#" class="icon icon-help nav-detail-link"></a></li>
                    <li class="accent-border"><a href="#" class="text accent-color">Number of Extreme Wet Days</a><a href="#" class="icon icon-help nav-detail-link"></a></li>
                  </ul>
                </div>

                <div id="precipitation-tabs" class="data-accordion-wrap">
                    <div class="data-accordion">

                        <div id="precipitation-chart" class="data-accordion-tab data-chart accent-background">
                            <header>
                                <h4>
                                    <span class="icon icon-emission-scenario"></span>
                      <span class="text">
                        Chart<span class="full-title">: Chart Title</span>
                        <span class="source">Source: <a href="#" target="_blank">NOAA, 2014</a></span>
                      </span>
                                </h4>

                                <div class="data-accordion-actions">
                                    <a href="#" class="download-image"><span class="icon icon-download-image"></span>Image</a>
                                    <a href="#" class="download-data"><span class="icon icon-download-chart"></span>Data</a>
                                </div>
                            </header>

                            <div class="data-accordion-content chart">
                                <div class="chart-wrap">
                                    <div class="chart-legend"></div>
                                    <canvas id="chart-234" class="chart-canvas" data-chart-ID="234" height="100" width="50"></canvas>
                                </div>

                                <div class="range">
                                    <div class="chart-range" data-start="2010" data-end="2100"></div>
                                    <div class="ui-slider-label range-label min">2010</div>
                                    <div class="ui-slider-label range-label max">2100</div>
                                </div>
                            </div>
                        </div>

                        <div id="precipitation-map" class="data-accordion-tab data-map accent-background">
                            <header>
                                <h4 class="accent-color">
                                    <span class="icon icon-district"></span>
                      <span class="text">
                        Map<span class="full-title">: Map Title</span>
                        <span class="source">Source: <a href="#" target="_blank">NOAA, 2014</a></span>
                      </span>
                                </h4>
                                
                                <div class="data-accordion-actions">
                                  <a href="#" class="download-image"><span class="icon icon-download-image"></span>Image</a>
                                  <a href="#" class="download-data"><span class="icon icon-download-chart"></span>Data</a>
                                </div>
                            </header>

                            <div id="map-234" class="data-accordion-content map"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="location-derived" class="location-data-section-wrap">
            <div class="location-data-section">
                <header>
                    <h3 class="accent-color"><span class="icon icon-drought"></span>Derived</h3>

                    <div class="data-vars">
                        <select id="data-type" class="dropdown">
                            <option value="projected">Projected</option>
                            <option value="historical">Historical</option>
                        </select>

                        <select id="data-season" class="dropdown">
                            <option value="spring">Spring</option>
                            <option value="summer">Summer</option>
                            <option value="autumn">Autumn</option>
                            <option value="winter">Winter</option>
                        </select>
                    </div>
                </header>

                <div id="derived-data" class="data-list">
                  <ul class="data-options">
                    <li class="active accent-border"><a href="#" class="text accent-color">Total Rainfall</a><a href="#" class="icon icon-help nav-detail-link"></a></li>
                    <li class="accent-border"><a href="#" class="text accent-color">Agricultural Impacts</a><a href="#" class="icon icon-help nav-detail-link"></a></li>
                    <li class="accent-border"><a href="#" class="text accent-color">Number of Dry Days</a><a href="#" class="icon icon-help nav-detail-link"></a></li>
                    <li class="accent-border"><a href="#" class="text accent-color">Number of Extreme Dry</a><a href="#" class="icon icon-help nav-detail-link"></a></li>
                  </ul>
                </div>

                <div id="derived-tabs" class="data-accordion-wrap">
                    <div class="data-accordion">

                        <div id="derived-chart" class="data-accordion-tab data-chart accent-background">
                            <header>
                                <h4>
                                    <span class="icon icon-emission-scenario"></span>
                      <span class="text">
                        Chart<span class="full-title">: Chart Title</span>
                        <span class="source">Source: <a href="#" target="_blank">NOAA, 2014</a></span>
                      </span>
                                </h4>
                                
                                <div class="data-accordion-actions">
                                  <a href="#" class="download-image"><span class="icon icon-download-image"></span>Image</a>
                                  <a href="#" class="download-data"><span class="icon icon-download-chart"></span>Data</a>
                                </div>
                            </header>

                            <div class="data-accordion-content chart">
                                <div class="chart-wrap">
                                    <div class="chart-legend"></div>
                                    <canvas id="chart-345" class="chart-canvas" data-chart-ID="345" height="400" width="300"></canvas>
                                </div>

                                <div class="range">
                                    <div class="chart-range" data-start="2010" data-end="2100"></div>
                                    <div class="ui-slider-label range-label min">2010</div>
                                    <div class="ui-slider-label range-label max">2100</div>
                                </div>
                            </div>
                        </div>

                        <div id="derived-map" class="data-accordion-tab data-map accent-background">
                            <header>
                                <h4 class="accent-color">
                                    <span class="icon icon-district"></span>
                      <span class="text">
                        Map<span class="full-title">: Map Title</span>
                        <span class="source">Source: <a href="#" target="_blank">NOAA, 2014</a></span>
                      </span>
                                </h4>
                                
                                <div class="data-accordion-actions">
                                  <a href="#" class="download-image"><span class="icon icon-download-image"></span>Image</a>
                                  <a href="#" class="download-data"><span class="icon icon-download-chart"></span>Data</a>
                                </div>
                            </header>

                            <div id="map-345" class="data-accordion-content map"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="location-impacts" class="impacts-list">
            <h2>Relevant Impacts</h2>

            <article id="impact-ecosystem-vulnerability" class="impact-banner" style="background-image: url(./resources/img/bg_topic-ecosystem.jpg);">
                <div class="impact-banner-text">
                    <h4>Impacts</h4>
                    <h3><a href="./impact_ecosystem-vulnerability.html">Ecosystem Vulnerability</a></h3>
                    <p>From large-scale agriculture, to massive dams and reservoirs, to managed fire regimes dating back thousands of years, humans have transformed the planet by engineering Earth’s physical and biological systems to better serve our needs and desires.</p>
                </div>

                <a href="./impact_ecosystem-vulnerability.html" class="button bg-trans border-white hover-bg-white">View details</a>
            </article>

            <article id="impact-coastal-flood-risk" class="impact-banner" style="background-image: url(./resources/img/bg_topic-coastalflood.jpg);">
                <div class="impact-banner-text">
                    <h4>Impacts</h4>
                    <h3><a href="#">Coastal Flood Risk</a></h3>
                    <p>Every year, at multiple locations along the coast of the United States, events such as storm surges, high tides, strong waves, heavy precipitation, increased river flow, and tsunamis cause damaging coastal floods.</p>
                </div>

                <a href="#" class="button bg-trans border-white hover-bg-white">View details</a>
            </article>
        </section>
    </div>
</div>


<?php include_once('template/footer.php'); ?>

<script src="./resources/js/cwg/climate-widget-graph.js"></script>
<script src="./resources/js/cwg/cwg.js"></script>




</body>
</html>