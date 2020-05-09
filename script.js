
    // Master Ingredient List: 
    var ingArray = [];

    // User Input Ingredient List: 
    var selIng = ['chicken', 'garlic'];

    // Convert selIng to string w/ comma separation
    var queryAppend = selIng.join();

    // Filter by Multi-Ingredient: 
    let multiIngList = "https://www.themealdb.com/api/json/v2/9973533/filter.php?i=" + queryAppend;

    // // Filter by Main Ingredient: 
    // let https://www.themealdb.com/api/json/v2/9973533/filter.php?i=main_ingredient

    //     Ingredient.png:
    //     https://www.themealdb.com/images/ingredients/{ingredient}.png

    //         Lookup 10 Random Recipes:
    // https://www.themealdb.com/api/json/v2/9973533/randomselection.php

    // Lookup full meal details by ID:
    // https://www.themealdb.com/api/json/v2/9973533/lookup.php?i=52772


    // AJAX call for API ingredient list
    function genIngArray() {
        let ingList = "https://www.themealdb.com/api/json/v2/9973533/list.php?i=list";
        $.ajax({ 
            url: ingList,
            method: "GET"
        }).then(function (resp) {
            for (i = 0; i < resp.meals.length; i++) {
                var ing = resp.meals[i].strIngredient;
                ingArray.push(ing);   
            }
        }); 
    };

    // Function for when user selects multiple ingredients
    function multiIng() {
        let multiIngList = "https://www.themealdb.com/api/json/v2/9973533/filter.php?i=" + queryAppend;
        console.log(multiIngList); 
        $.ajax({ 
            url: multiIngList,
            method: "GET"
        }).then(function (respMulti) {
            console.log(respMulti); 
        });
    };


multiIng();
   




