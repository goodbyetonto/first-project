$(document).ready(function() {
    // Storage Object
    var storage = {
        // Master Ingredient List: 
        ingArray: [],

        // User Input Ingredient List: 
        selIng: [],

        // Generated Recipes Array
        selRecipes: [],

        // Selected recipe's list of ingredients in modal
        listIng: []

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
                                <button type="button" class="btn btn-success shadow-sm modal-button" data-recipe="${cur.idMeal}">View Recipe</button>
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
                    <button type="button" class="past card-body text-muted list-group-item list-group-item-action d-flex justify-content-between align-items-center p-1 shadow-sm">${cur}<span class="delete-ing btn btn-danger p-1 m-1 shadow-sm" data-ingredient="${cur}">X</span></button>
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
    };

    function genModalDetails(mealID) {
        // set the url with the selected meal ID
        var mealQuery = "https://www.themealdb.com/api/json/v2/9973533/lookup.php?i=" + mealID;

        // call for our mealQuery
        $.ajax({
            url: mealQuery,
            method: 'GET'
        }).then(function(resp) {
            // select the current meal
            var curMeal = resp.meals[0];
            console.log(curMeal.strMealThumb);

            // change the modal's title
            $('.modal-title').text(curMeal.strMeal);

            // change the modal's image
            $('#modal-img').attr('src', curMeal.strMealThumb)

            // change the modal's instructions
            $('#modal-instructions').text(curMeal.strInstructions);
            
            var entries = Object.entries(curMeal);

            // Append each ingredient as a list item
            for (var i = 1; i <= 20; i++) {
                var curIngredient = `strIngredient${i}`;    
                var curMeasure = `strMeasure${i}`;
                
                for (const [key, value] of entries) {
                    if (key === curIngredient && (value !== "" && value !== null)) {
                        storage.listIng.push([value])
                    };

                    if (key === curMeasure && (value !== "" && value !== null)) {
                        console.log(value);
                        storage.listIng[i-1].push(value);
                    };
                };
            };

            console.log(storage.listIng);
            
            for (var i = 0; i < storage.listIng.length; i++) {
                $('#modal-ingredients').append(`<li>${storage.listIng[i][0]}, ${storage.listIng[i][1]} </li>`)
            };


            // Display the modal
            $("#myModal").css("display", "block");
            $('<div class="modal-backdrop"></div>').appendTo(document.body);
        });
    };

    // Function for when the user selects random recipes
    function randRecipe() {
        let respLength = storage.selRecipes.length; 
        let randNum = Math.floor(Math.random() * respLength);
        console.log(randNum);
        let mealID = storage.selRecipes[randNum].idMeal; 

        genModalDetails(mealID);  
    };
    
    
    
    
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

    // Dynamic Event Listener for delete ingredient buttons
    $(document).on('click', '.delete-ing', function(event) {
        var selectedIngredient = $(this).data('ingredient');

        // Remove the selected ingredient from the storage array
        storage.selIng = $.grep(storage.selIng, function(value) {
            return value != selectedIngredient;
        });

        // render the updated ingredient list
        renderIngredientList();

        // generate the new recipe list
        multiIng();
    });

    // Modal Open
    $("body").on("click", "button.btn", function(event) {
        
        // select the data attribute for the meal ID
        var mealID = $(this).data('recipe');

        genModalDetails(mealID);
    });
    
    $('#ing-instr-btn').on("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        console.log('working?');

        if ($('#modal-instructions-div').hasClass('hide')) {
            $('#ing-instr-btn').text('See Ingredients')
        } else {
            $('#ing-instr-btn').text('See Instructions')
        };

        $('#modal-instructions-div').toggleClass('hide');
        $('#modal-ingredients-div').toggleClass('hide');
    });


    multiIng();
    genIngArray();

    // Modal Close
    $("body").on("click", "button.btn-danger", function() {
        $("#myModal").css("display", "none");
        $("div").remove(".modal-backdrop");
    });

    // I'm Feeling Hungry Button event listener
    $('#feeling-hungry-btn').on('click', function() {
        console.log('random button clicked');
        randRecipe();
    });
});    

