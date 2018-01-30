$(document).ready(function () {
    applyInitialUIState();
    applyMargins();
    
    $('input[type=radio][name=basemap]').change(function () {
        console.log(this.value);
        switchBaseMap(this.value);
    });
    $('.sidebar-left .slide-submenu').on('click', function () {
        var thisEl = $(this);
        thisEl.closest('.sidebar-body').fadeOut('slide', function () {
            $('.mini-submenu-left').fadeIn();
            applyMargins();
        });
    });
    $('.mini-submenu-left').on('click', function () {
        var thisEl = $(this);
        $('.sidebar-left .sidebar-body').toggle('slide');
        thisEl.hide();
        applyMargins();
    });
    $('.sidebar-right .slide-submenu').on('click', function () {
        var thisEl = $(this);
        thisEl.closest('.sidebar-body').fadeOut('slide', function () {
            $('.mini-submenu-right').fadeIn();
            applyMargins();
        });
    });
    $('.mini-submenu-right').on('click', function () {
        var thisEl = $(this);
        $('.sidebar-right .sidebar-body').toggle('slide');
        thisEl.hide();
        applyMargins();
    });
    $(window).on("resize", applyMargins);

});


function applyInitialUIState() {
    // functie wordt als eerste uitgevoerd, lokale var voor gemak.
    var headerSize = $("#PulldownForMap"); // shortcut voor de eerste pagina, (totale width en height zijn belangrijk)
    var navHeight = $('#bs-example-navbar-collapse-1').height(); // var om de height van de navigatiebar te gebruiken
    $('#map').css("top", headerSize.height()); // zet de kaart op de tweede pagina
    $('#map').css("bottom", (-headerSize.height() + navHeight)); // zet de kaart op de tweede pagina

    $('#mapMainSections').css("top", -navHeight); // zet de menus van de kaart iets naar boven in verhouden met de navigatiebar

    if (isConstrained()) {
        $(".sidebar-left .sidebar-body").fadeOut('slide');
        $(".sidebar-right .sidebar-body").fadeOut('slide');
        $('.mini-submenu-left').fadeIn();
        $('.mini-submenu-right').fadeIn();
    }
}

function applyMargins() {
    var headerSize = $("#PulldownForMap"); // shortcut voor de eerste pagina, (totale width en height zijn belangrijk)
    var leftToggler = $(".mini-submenu-left"); // shortcut voor linker ingeklapte menu
    var rightToggler = $(".mini-submenu-right"); // shortcut voor rechter ingeklapte menu

    if (leftToggler.is(":visible")) {
        $("#map .ol-zoom")
            .css("margin-left", 0)
            .removeClass("zoom-top-opened-sidebar")
            .addClass("zoom-top-collapsed");

        //zorgt ervoor dat het linker ingeklapte menu op de juiste positie komt.
        // het pakt de hoogte van de viewport en gebruikt dit om het menu omlaag te drukken
        $(".mini-submenu-left").css("top", headerSize.height());

    } else {
        $("#map .ol-zoom")
            .css("margin-left", $(".sidebar-left").width())
            .removeClass("zoom-top-opened-sidebar")
            .removeClass("zoom-top-collapsed");
    }
    if (rightToggler.is(":visible")) {
        $("#map .ol-rotate")
            .css("margin-right", 0)
            .removeClass("zoom-top-opened-sidebar")
            .addClass("zoom-top-collapsed");

        //zorgt ervoor dat het rechter ingeklapte menu op de juiste positie komt.
        // het pakt de hoogte van de viewport en gebruikt dit om het menu omlaag te drukken
        $(".mini-submenu-right").css("top", headerSize.height());
    } else {
        $("#map .ol-rotate")
            .css("margin-right", $(".sidebar-right").width())
            .removeClass("zoom-top-opened-sidebar")
            .removeClass("zoom-top-collapsed");
    }
}

function isConstrained() {
    //zorgt ervoor dat de panels werken
    return $("div.mid").width() == $(window).width();
}