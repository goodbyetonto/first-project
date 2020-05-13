$(document).ready(function() {
    // Storage Object
    var storage = {
        // Master Ingredient List: 
        ingArray: [],

        // User Input Ingredient List: 
        selIng: [],

        // Generated Recipes Array
        selRecipes: []

    };

    // Convert selIng to string w/ comma separation

    // Filter by Multi-Ingredient: 
    // let multiIngList = "https://www.themealdb.com/api/json/v2/9973533/filter.php?i=" + queryAppend;

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
            // gathers all the most recent ingredients from the API
            for (i = 0; i < resp.meals.length; i++) {
                var ing = resp.meals[i].strIngredient;
                storage.ingArray.push(ing);   
            }
        }); 
    };

    // Function for when user selects multiple ingredients
    function multiIng() {
        var queryAppend = storage.selIng.join();
        let multiIngList = "https://www.themealdb.com/api/json/v2/9973533/filter.php?i=" + queryAppend;
        console.log(multiIngList); 
        $.ajax({ 
            url: multiIngList,
            method: "GET"
        }).then(function (respMulti) {
            console.log(respMulti);
            // check to see if there are any recipes
            if (respMulti.meals === null) {
                $('#recipes-div').html('<p class="text-center m-3"><em>Sorry, we do not have any recipes that match your ingredients!</em></p>');
            } else {
                // clear the current recipe div
                $('#recipes-div').html('');
    
                // clear the storage recipes array
                storage.selRecipes = [];
    
                respMulti.meals.forEach(function(cur) {
                    
                    // store each meal into the storage object
                    storage.selRecipes.push(cur);
    
                    // render the recipes into the recipes div
                    var html = 
                    `<div class="col mb-4">
                        <div class="card h-100 shadow">
                            <img src="${cur.strMealThumb}" class="card-img-top" alt="Photo of ${cur.strMeal}">
                            <div class="card-body d-flex flex-column justify-content-between">
                                <h5 class="card-title">${cur.strMeal}</h5>
                                <p class="text-muted"><em>TBD</em> Ingredients Selected</p>
                                <button type="button" class="btn btn-success shadow-sm modal-button" data-recipe="${cur.strMeal}">View Recipe</button>
                            </div>
                        </div>
                    </div>`
    
                    $('#recipes-div').append(html);
                });
    
                console.log(storage.selRecipes);

            };
            
        });
    };

    // function to render the ingredient list buttons
    function renderIngredientList() {
        $('#past-searches').html('');

        storage.selIng.forEach(function(cur) {
            var html = `
            <div class="col mb-3">
                <div class="card h-100">
                    <button type="button" class="past card-body text-muted list-group-item list-group-item-action d-flex justify-content-between align-items-center p-1 shadow-sm" data-ingredient="${cur}">${cur}<span class="delete-ing btn btn-danger p-1 m-1 shadow-sm">X</span></button>
                </div>
            </div>`;

            $('#past-searches').append(html);

        })
    };

    // function to convert input into title case for API string match
    function toTitleCase(str) {
        return str.replace(/(?:^|\s)\w/g, function(match) {
            return match.toUpperCase();
        });
    }

    
    // ======================================
    // EVENT LISTENERS
    // ======================================
    $('#search-btn').on('click', function(event) {
        event.preventDefault();
        var input = toTitleCase($('#search-bar').val());

        // Check to see if the ingredient is included in the API's ingredient list
        if (!(storage.ingArray.includes(input))) {
            alert(`Sorry, we don't have that ingredient listed.  Try a different ingredient!`);
            $('#search-bar').val('');
            return false;
        } else {
            if ((storage.selIng.includes(input))) {
                alert('Ingredient already included.  Pick a different ingredient!');
                $('#search-bar').val('');
            } else {
                // store the ingredient in our selected ingredient array in storage
                storage.selIng.push(input);
                console.log(storage.selIng);
    
                // render the ingredients list
                renderIngredientList();
    
                // get the available recipes based on the selected ingredients and render results
                multiIng();

                // clear the last input value
                $('#search-bar').val('');
            }

        };
    });

    $(document).on('click', '.delete-ing', function(event) {

    });



    genIngArray();
    console.log(storage.ingArray);
});    
   
   



// Modal Open
// $(".btn").on("click", function(event) {
//     $("#myModal").css("display", "block");
//     $('<div class="modal-backdrop"></div>').appendTo(document.body)
// });