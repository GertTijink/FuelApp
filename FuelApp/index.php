<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>FuelApp</title>

    <!-- Bootstrap Core CSS -->
    <link rel="stylesheet" href="css/bootstrap.min.css" type="text/css">

    <!-- Custom Fonts -->
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Merriweather:400,300,300italic,400italic,700,700italic,900,900italic' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="font-awesome/css/font-awesome.min.css" type="text/css">

    <!-- Plugin CSS -->
    <link rel="stylesheet" href="css/animate.min.css" type="text/css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/creative.css" type="text/css">
    <link rel="stylesheet" href="ol/ol.css" />
    <link rel="stylesheet" href="css/mapviewer.css" type="text/css">

</head>

<body id="page-top">
    <div class="container-fluid">
        <nav class="navbar navbar-fixed-top navbar-default" role="navigation">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                <a class="navbar-brand page-scroll" href="#page-top"><img src="img/FuelAppb.png" class="img-responsive" alt="AUTTEC"></a>
            </div>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav">
                    <li class="active"><a href="index.php">Refresh</a></li>
                </ul>
            </div>
        </nav>
    </div>



    <header id="PulldownForMap">
        <div class="header-content">
            <div class="header-content-inner">
                <img src="img/FuelAppw.png" class="img-responsive center-block" alt="AUTTEC">
                <hr class="">
                <p class="bg-dark">
                    Snel brandstof nodig? <br> Fuel up met FuelApp! <br> Bereken uw route naar het dichtsbijzijnde tankstation door op één van de knoppen te drukken.
                </p>
                <div class="collapse" id="viewdetails">
                    <p class="bg-dark">
                        FuelApp is een applicatie om snel het dichtstbijzijnde tankstation te vinden. Door op een knop te drukken wordt een route berekend naar een tankstation aan de hand van de locatie van de gebruiker. Er kan gekozen worden om uitsluitend te zoeken naar tankstation die aan een A-weg ligt, of om te zoeken naar een tankstation die niet aan de snelweg ligt.
                    </p>
                    <p class="bg-dark">
                        FuelApp is gemaakt met <a class="hyperlink" href="http://openlayers.org/">OpenLayers</a> en <a class="hyperlink" href="http://project-osrm.org/">Project OSRM</a>. De benodigde data voor het berekenen van het dichtstbijzijnde tankstation wordt met <a href="http://geoserver.org/">GeoServer</a> gedaan. Ten slotte is het geheel vormgegeven met <a class="hyperlink" href="https://getbootstrap.com/">Bootstrap</a>.</p>
                </div>
                <div>
                    <a href="#Kaart" class="btn btn-primary btn-x2 page-scroll A-wegKnop" name="snelweg">Zoek op A-weg</a>
                    <a class="btn btn-primary btn-x2" data-toggle="collapse" data-target="#viewdetails">Over FuelApp</a>
                    <a href="#Kaart" class="btn btn-primary btn-x2 page-scroll B-wegKnop">Zoek op andere wegen</a>
                </div>
            </div>
        </div>
    </header>

    <section class="bg-secondary" id="Kaart">

        <div id="map"></div>
        <div id="msg">Uw route zal hier verschijnen.</div>

        <div id="mapMainSections" class="row main-row">


            <div class="col-sm-4 col-md-3 sidebar sidebar-left pull-left">
                <div class="panel-group sidebar-body" id="accordion-left">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h4 class="panel-title">
                                <i class="fa fa-list-alt"></i> Layers
                                <span class="pull-right slide-submenu">
                                    <i class="fa fa-chevron-left"></i>
                                </span>
                            </h4>
                        </div>
                        <div id="layers">
                            <div class="panel-body">
                                <form action="/action_page.php">
                                    <p class="black"><input class="basemaps" type="radio" name="basemap" value="osm" checked> Open Streetmap <i class="fa fa-map"></i></p><br>
                                    <p class="black"><input class="basemaps" type="radio" name="basemap" value="bing"> Bing Satelliet <i class="fa fa-globe"></i></p><br>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-4 col-md-6 mid">
            </div>
            <div class="col-sm-4 col-md-3 sidebar sidebar-right pull-right">
                <div class="panel-group sidebar-body" id="accordion-right">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h4 class="panel-title">
                                <i class="fa fa-road"></i> Routebeschrijving
                                <span class="pull-right slide-submenu">
                    <i class="fa fa-chevron-right"></i>
                  </span>
                            </h4>
                        </div>
                        <div id="task-panel" class="panel-collapse collapse in">
                            <div id="instr" class="panel-body">
                                <h5>Uw routebeschrijving:</h5><br>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mini-submenu mini-submenu-left pull-left">
            <i class="fa fa-list-alt"></i>
        </div>
        <div class="mini-submenu mini-submenu-right pull-right">
            <i class="fa fa-road"></i>
        </div>
    </section>

    <!-- Scripts voor OSRM Text Instructions -->
    <script src="osrm-text-instructions/languages/translations/nl.json"></script>
    <script src="osrm-text-instructions/languages.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.15/proj4.js"></script>
    <script src="https://epsg.io/28992.js"></script>
    <script src="osrm-text-instructions/index.js"></script>

    <!-- jQuery -->
    <script src="js/jquery.js"></script>
    <script src="jquery/jquery-3.2.1.min.js"></script>
    <!-- Bootstrap Core JavaScript -->
    <script src="js/bootstrap.min.js"></script>

    <!-- Plugin JavaScript -->
    <script src="js/jquery.easing.min.js"></script>
    <script src="js/jquery.fittext.js"></script>
    <script src="js/wow.min.js"></script>

    <!-- Custom Theme JavaScript -->
    <script src="js/creative.js"></script>

    <!--  OpenLayers -->
    <script src="ol/ol-debug.js"></script>

    <!-- Kaart viewer en functionaliteit -->
    <script src="js/mapviewer.js"></script>
    <script src="js/mapDataViewer.js"></script>



</body>

</html>
