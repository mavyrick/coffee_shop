var app = angular.module('app', [])

// Filter for removing duplicate results when using ng-repeat.

app.filter('unique', function() {

 return function(collection, keyname) {

  var output = [], 
  keys = [];

  angular.forEach(collection, function(item) {

    var key = item[keyname];

    if(keys.indexOf(key) === -1) {

      keys.push(key); 

      output.push(item);
    }
  });

  return output;
};
});

// Main controller

app.controller('CoffeeController', function($scope, $http) {

  $scope.coffeeData = [];

  $scope.productSearch = function () {
    $scope.keyword = document.getElementById("product-search-input").value;

    $http({
      method: "GET",
      url: "http://uk.gomerchants.net/inc/demo.php?keyword=" + $scope.keyword,
    }).then(function mySuccess(response) {
      $scope.coffeeData = response.data;
    }, function myError(response) {
      $scope.coffeeData = response.statusText;
    });
  }

  // For selecting how something is sorted.

  $scope.sortType = "";

// For selecting how something is filtered.

$scope.filterType = ""

// For searching through search results retrieved from main product search.

$scope.searchFilter = function(coffeeItem) {
  return (coffeeItem.description.includes(document.getElementById("filter-search-input").value) || coffeeItem.name.includes(document.getElementById("filter-search-input").value))
};

// Price range slider with non-linear values.
// This slider allow the user to choose a price range.
// The slider works in a non-linear fashion!!!
// Lower numbers will slide slower and higher numbers will slide faster.
// This makes it much easier to choose a price range as lower prices are more likely to be selected and usually more particular.
// Slider also makes far right slide position maximum price.
// -Josh

$scope.priceFilter = ""
angular.element(document).ready(function() {
  $("#slider").on( "slidechange", function( event, ui ) {
    $scope.$apply(function() {
     $scope.priceFilter = function(coffeeItem) {
      var min = $("#slider").slider("values")[0];
      var max = $("#slider").slider("values")[1];
        // Make values non-linear
        var nonLinearPriceMin = Math.easeIn(min, 0, 2001, 2.5);
        var nonLinearPriceMax = Math.easeIn(max, 1, 2001, 2.5);
        if (nonLinearPriceMax == 2001) {
          return (coffeeItem.price_raw >= nonLinearPriceMin);
        } else {
          return (coffeeItem.price_raw >= nonLinearPriceMin) && (coffeeItem.price_raw <= nonLinearPriceMax);
        }
      };
    });
  });
});

  // Function for making values non-linear

  Math.easeIn = function (val, min, max, strength) {
    val /= max;
    return (max-1)*Math.pow(val, strength) + min;
  };


  $( function() {
    $( "#slider" ).slider({
      change: function( event, ui) { var scope = angular.element($("#slider")).scope();
      scope.$apply(function() {
        scope.filterType = scope.priceFilter
      })
    },
    range: true,
    min: 0,
    max: 2001,
    values: [0, 2001],
    slide: function( event, ui ) {

      var nonLinearMin = Math.easeIn(ui.values[0], 0, 2001, 2.5);
      var nonLinearMax = Math.easeIn(ui.values[1], 0, 2001, 2.5);

      $('#min-amount').val("$" + Math.round(nonLinearMin));      
      if (ui.values[1] == 2001) {
        $("#max-amount").val("max")
      } else {
        $("#max-amount").val("$" + Math.round(nonLinearMax))
      }
    }
  });
    $( "#min-amount" ).val( "$" + $( "#slider" ).slider( "values", 0 ));

    $("#max-amount").val("max");

  });

  $scope.categoryFilter = function(coffeeItem) {
    var e = document.getElementById("category-dropdown-select")
    return (e.options[e.selectedIndex].text)
    function Ctrl($scope) {
      $scope.items = [{
        value: 'item_1_id',
        text: 'Item 1'
      }, {
        value: 'item_2_id',
        text: 'Item 2'
      }];   
    }
};

// Various data filters

$scope.brandFilter = function(coffeeItem) {
  return (document.getElementById("brand-option").value)
};

$scope.merchantFilter = function(coffeeItem) {
  return (document.getElementById("merchant-option").value)
};

// For highlighting names on hover

$scope.nameHighlightEnter = function() {
  $(".name-link-" + $scope.coffeeData[this.$index].id).css("color", "#f03d41");
}

$scope.nameHighlightLeave = function() {
  $(".name-link-" + $scope.coffeeData[this.$index].id).css("color", "black");
}

// For only showings a certain number of items until user scrolls to bottom of the page

$scope.itemLimit = 20;
angular.element(document).ready(function() {
  setTimeout(function() {
    $(window).scroll(function() {
     if($(window).scrollTop() + $(window).height() > ($(document).height() - 100)) {
       $scope.itemLimit = $scope.itemLimit + 20;
     }
   })
  },100)
})
})

// Events triggered as user scrolls down

window.onscroll = function() {
  var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  var scrollBottom = scrollTop + $(window).height()
  var minimizeHeader = document.getElementById("minimize-header")
  var headerTop = document.getElementById("coffee-header-top")
  var headerBottom = document.getElementById("coffee-header-bottom")
  var filterDisplay = document.getElementById("filter-display")
  var priceSlider = document.getElementById("price-slider")

  // var testFooter = document.getElementById("test-footer")
  // var scrolledOnce = false;
  if (scrollTop >= minimizeHeader.offsetTop) {
    headerBottom.classList.add("search-fixed")
    minimizeHeader.style.paddingBottom = "50px";
    // priceSlider.style.position = "fixed";
    priceSlider.style.top = "7.5px";

    // priceSlider.classList.add("slider-minimized")
    // priceSlider.classList.remove("slider-maximized")

    // coffeeHeader.style.visibility = "hidden"

    // cartHeader.style.visibility = "visible"
    // $("#cart-header").slideDown(400);
  } else {
    headerBottom.classList.remove("search-fixed")
    headerTop.style.paddingBottom = "0px";
    minimizeHeader.style.paddingBottom = "0px";

    priceSlider.style.top = "109px"
    priceSlider.style.left = "88px"
    // priceSlider.classList.add("slidier-maximized")
    // priceSlider.classList.remove("slider-minimized")
    // priceSlider.style.position = "absolute";


        // coffeeHeader.style.visibility = "visible"
    // $("#cart-header").slideUp(400), function() { 
      // cartHeader.style.visibility = "hidden"
    }

    // if (scrollTop >= filterDisplay.offsetTop) {
    //   // headerSlider.style.display = "block";
    // }
  }