
    // Ingredient List: 
    var ingArray = [];


    // // Filter by Multi-Ingredient: 
    // let multiIngList = "https://www.themealdb.com/api/json/v2/9973533/filter.php?i=ingredient1,ingredient2,ingredient3";

    // // Filter by Main Ingredient: 
    // let https://www.themealdb.com/api/json/v2/9973533/filter.php?i=main_ingredient

    //     Ingredient.png:
    //     https://www.themealdb.com/images/ingredients/{ingredient}.png

    //         Lookup 10 Random Recipes:
    // https://www.themealdb.com/api/json/v2/9973533/randomselection.php

    // Lookup full meal details by ID:
    // https://www.themealdb.com/api/json/v2/9973533/lookup.php?i=52772


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
         console.log(ingArray);        
        }); 
    };

console.log(genIngArray()); 
