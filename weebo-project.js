

// import {coffeeData} from 'coffee-data.js'
// var coffeeData = coffeeData();


// const proxyurl = "https://cors-anywhere.herokuapp.com/";
// // const proxyurl = "https://crossorigin.me/"
// const url = " http://uk.gomerchants.net/inc/twenga.php?keyword=%7Bcoffee%7D&method=searchOffer"; // site that doesn’t send Access-Control-*
// fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
// .then(response => response.text())
// .then(contents => console.log(contents))
// .catch(console.log("Can’t access " + url + " response. Blocked by browser?"))

// $.getScript("coffee-data.js", function() {

//  alert("Script loaded but not necessarily executed.");

// });

var app = angular.module('app', [])

app.filter('unique', function() {
   // we will return a function which will take in a collection
   // and a keyname
   return function(collection, keyname) {
      // we define our output and keys array;
      var output = [], 
          keys = [];
      
      // we utilize angular's foreach function
      // this takes in our original collection and an iterator function
      angular.forEach(collection, function(item) {
          // we check to see whether our object exists
          var key = item[keyname];
          // if it's not already part of our keys array
          if(keys.indexOf(key) === -1) {
              // add it to our keys array
              keys.push(key); 
              // push this item to our final output array
              output.push(item);
          }
      });
      // return our array which should be devoid of
      // any duplicates
      return output;
   };
});



// $(document).ready(function() {

  // $("#slider-range").change(function() {



 // $scope.priceFunction = function($scope.sliderValues) {
 //    if ($scope.sliderValues < 100) {
 //      return (product.attrs.att_old == 0)
 //    } else if (ageValue == 1) {
 //      return (product.attrs.att_old == 1)
 //    } else {
 //      return ""
 //    }
 //  }

// })

// })

  // $scope.sliderValues = $scope.$on('$viewContentLoaded', function() {
  //   $( "#slider-range" ).slider( "values");
  // })

  app.controller('CoffeeController', function($scope, $http) {

//   $http.get('coffee-data.json')
//        .then(function(res){
//           $scope.coffeeData = coffeeD;                
//         });
// });

$scope.coffeeData = coffeeJSON.data;

$scope.sortType = "";

$scope.filterType = ""

$scope.searchFilter = function(coffeeItem) {
  return (coffeeItem.description.includes(document.getElementById("search-input").value) || coffeeItem.name.includes(document.getElementById("search-input").value))
};

// $("#slider-range").on("slidechange", function(event, ui) {
  angular.element(document).ready(function() {
 $scope.priceFilter = function(coffeeItem) {
  var priceValues = $("#slider-range" ).slider("values");
  return (coffeeItem.price_raw >= priceValues[0]) && (coffeeItem.price_raw <= priceValues[1]);
};
})

$scope.categoryFilter = function(coffeeItem) {
  var e = document.getElementById("category-dropdown-select")
  return (e.options[e.selectedIndex].text)

//   var e = document.getElementById("ddlViewBy");
// var strUser = e.options[e.selectedIndex].value;
};

$scope.brandFilter = function(coffeeItem) {
  return (document.getElementById("brand-option").value)
};

$scope.merchantFilter = function(coffeeItem) {
  return (document.getElementById("merchant-option").value)
};
// })

$scope.maxPrice = "test"


// $( "#slider-range" ).on( "slidechange", function( event, ui ) {

//   $scope.sliderValues = 

//   $( "#slider-range" ).slider( "values");
// })

$scope.nameHighlightEnter = function() {
  $(".name-link-" + $scope.coffeeData[this.$index].id).css("color", "#f03d41");
}

$scope.nameHighlightLeave = function() {
  $(".name-link-" + $scope.coffeeData[this.$index].id).css("color", "black");
}

$scope.itemLimit = 20;
angular.element(document).ready(function() {
setTimeout(function() {
  $(window).scroll(function() {
   if($(window).scrollTop() + $(window).height() > ($(document).height() - 100)) {
     $scope.itemLimit = $scope.itemLimit + 4;
   }
 })
},100)
})

});

//   $http({
//     method: "POST",
//     url: "/http://uk.gomerchants.net/inc/twenga.php",
//     params: {
//      'keyword': 'coffee',
//      'method': 'searchOffer'
//    }
//  }).then(function mySuccess(response) {
//   $scope.myWelcome = response.data;
// }, function myError(response) {
//   $scope.myWelcome = response.statusText;
// });
// });

// //cors-anywhere.herokuapp.comhttps:/http://uk.gomerchants.net/inc/twenga.php?keyword=coffee&method=searchOffer

// $scope.donePopUp = function(title) {
//     if (title.includes("DONE") == true) {
//       var popUp = document.getElementById("done-popup-" + $scope.products[this.$index].id);
//       popUp.style.visibility = 'visible'
//     }
//   }




// mainApp.service('UserService', function($http, $q){

//    this.getUsers = function(page = 1, limit = 100, sort = 'id', direction = 'desc') {

//         var dfrd = $q.defer();
//         $http.get('https://www.your-website.com/api/users.json', 
//             {
//                 params:{page: page, limit: limit, sort: sort, direction: direction},
//                 headers: {Authorization: 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='}
//             }
//         )
//         .then(function(response) {
//             if ( response.data.success == true ) { 

//             } else {

//             }
//         }, function(x) {

//             dfrd.reject(true);
//         });
//         return dfrd.promise;
//    }

// });

angular.module('ui.filters').filter('unique', function () {

  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var hashCheck = {}, newItems = [];

      var extractValueToCompare = function (item) {
        if (angular.isObject(item) && angular.isString(filterOn)) {
          return item[filterOn];
        } else {
          return item;
        }
      };

      angular.forEach(items, function (item) {
        var valueToCheck, isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
});

