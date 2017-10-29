var app = angular.module('app', [])

// Data factory

app.factory('CoffeeData', function($http) { 

  var coffeeSearch = []

  coffeeSearch.getData = function(keyword) {
    return $http.get("http://uk.gomerchants.net/inc/demo.php?keyword=" + keyword);
  }
  return coffeeSearch

});

// app.controller('ProductSearchController', ['$scope', 'CoffeeData', function($scope, CoffeeData) {

//   $scope.productSearch = function() {
//     var keyword = document.getElementById("product-search-input").value
//     CoffeeData.getData(keyword).then(function(test) {
//       console.log(test)
//       return test
//     })
//   }

// //  $scope.productSearch = function() {
// // var keyword = document.getElementById("product-search-input").value
// //   CoffeeData.getData().then(function(response) {
// //       return response.data;
// //     });
// // }

// }])


// Main controller

app.controller('CoffeeController', ['$scope', 'CoffeeData', function($scope, CoffeeData) {

  $scope.productSearch = function() {
    var keyword = document.getElementById("product-search-input").value
    CoffeeData.getData(keyword).then(function(response) {
    //   if (response.data != undefined) {
      $scope.coffeeData = response.data;
      // if ($scope.coffeeData)
      if ($scope.coffeeData.length != undefined) {
        $scope.resultNum = $scope.coffeeData.length + " results found"
      } else {
        $scope.resultNum = "no results found"
      }
    // } else {
    //   $scope.coffeeData = []
  })
    // } else {
    //     document.getElementById("no-results").style.visibility = "hidden";
    // }
  }
  // .then(function() {
  //     console.log($scope.coffeeData.length)
  //       if ($scope.coffeeData.length == 0) {
  //     document.getElementById("no-results").style.visibility = "visible";

  // For selecting how something is sorted.

  $scope.sortType = {};

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

$scope.priceFilter = ""
angular.element(document).ready(function() {
  $("#slider").on( "slidechange", function( event, ui ) {
    $scope.$apply(function() {
     $scope.priceFilter = function(coffeeItem) {
      var min = $("#slider").slider("values")[0];
      var max = $("#slider").slider("values")[1];
        // Make values non-linear
        var nonLinearPriceMin = Math.easeIn(min, 0, 2501, 2.5);
        var nonLinearPriceMax = Math.easeIn(max, 1, 2501, 2.5);
        if (nonLinearPriceMax == 2501) {
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

  $(function() {
    $( "#slider" ).slider({
      change: function( event, ui) { var scope = angular.element($("#slider")).scope();
      scope.$apply(function() {
        scope.filterType = scope.priceFilter
      })
    },
    range: true,
    min: 0,
    max: 2501,
    values: [0, 2501],
    slide: function( event, ui ) {

      var nonLinearMin = Math.easeIn(ui.values[0], 0, 2501, 2.5);
      var nonLinearMax = Math.easeIn(ui.values[1], 0, 2501, 2.5);

      $('#min-amount').val("$" + Math.round(nonLinearMin));      
      if (ui.values[1] == 2501) {
        $("#max-amount").val("max")
      } else {
        $("#max-amount").val("$" + Math.round(nonLinearMax))
      }
    }
  });
    $( "#min-amount" ).val( "$" + $( "#slider" ).slider( "values", 0 ));

    $("#max-amount").val("max");
  });

//   $scope.categoryFilter = function(coffeeItem) {
//     var e = document.getElementById("category-dropdown-select")
//     return (e.options[e.selectedIndex].text)
//     function Ctrl($scope) {
//       $scope.items = [{
//         value: 'item_1_id',
//         text: 'Item 1'
//       }, {
//         value: 'item_2_id',
//         text: 'Item 2'
//       }];   
//     }
// };

// Various data filters

$scope.categoryFilter = function(coffeeItem) {
  return (coffeeItem.category.includes($(this).text()))
}

$scope.brandFilter = function(coffeeItem) {
  return (document.getElementById("brand-option").text)
};

// $scope.merchantFilter = function(coffeeItem) {
//     return document.getElementById("merchant-" + coffeeItem[this.$index].id).text
// };

$scope.merchantFilter = function(coffeeItem) {
  return (coffeeItem.merchant.includes($(this).text()))
}

$scope.getScope = function() {
 return $scope;   
}

// $scope.merchantFilter = function(coffeeItem) {
//   return (document.getElementById("merchant-option").text)
// };

// $scope.merchantFilter = function() {
//   $("#merchant-" + $scope.coffeeData[this.$index].id).text;
// }

// For highlighting names on hover

$scope.nameHighlightEnter = function() {
  $("#name-link-" + $scope.coffeeData[this.$index].id).css("color", "#f03d41");
}

$scope.nameHighlightLeave = function() {
  $("#name-link-" + $scope.coffeeData[this.$index].id).css("color", "black");
}

// For only showings a certain number of items until user scrolls to bottom of the page. Still working on getting this to work properly.

$scope.itemLimit = 50;
angular.element(document).ready(function() {
  $(window).scroll(function() {
   if($(window).scrollTop() + $(window).height() > ($(document).height() - 100)) {
     $scope.itemLimit = $scope.itemLimit + 50;
   }
 })
})
}])

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

// Events triggered as user scrolls down

window.onscroll = function() {
  var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  var scrollBottom = scrollTop + $(window).height()
  var minimizeHeader = document.getElementById("minimize-header")
  var headerTop = document.getElementById("coffee-header-top")
  var headerBottom = document.getElementById("coffee-header-bottom")
  var filterDisplay = document.getElementById("filter-display")
  var priceSlider = document.getElementById("price-slider")


  if (scrollTop >= minimizeHeader.offsetTop) {
    headerBottom.classList.add("search-fixed")
    minimizeHeader.style.paddingBottom = "100px";

    priceSlider.style.top = "9px";

  } else {
    headerBottom.classList.remove("search-fixed")
    headerTop.style.paddingBottom = "0px";
    minimizeHeader.style.paddingBottom = "0px";

    priceSlider.style.top = "109px"

  }

}

// Change button text on resize

$(window).resize(function () {
  var popularity = $("#popularity");
  if (popularity.width() < 95) {
    $(".pop-text").text("Pop ")
  } else {
    $(".pop-text").text("Popularity ")
  }
})

// Loader

// var myVar;

// function myFunction() {
//     myVar = setTimeout(showPage, 3000);
// }

// function showPage() {
//   document.getElementById("loader").style.display = "none";
//   document.getElementById("myDiv").style.display = "block";
// }