

function redirectAdd() {
    location.href = "Add.html";
}
function redirectView() {
    location.href = "View.html";
}
const title = document.getElementById('Recipe_title');
const Recipe_Description = document.getElementById('Recipe_Description');
const Recipe_Ingred = document.getElementById('Recipe_Ingred');
const upload = document.getElementById('upload');
const savebtn = document.getElementById('button');
const message = document.getElementById('message');
const viewMessage = document.getElementById('view-message');
const showcards = document.getElementById('ShowCards');
const cards = document.getElementById('cards');
const modal = document.getElementById('modal_container');
if (modal) {
    modal.style.display = "none";
}
const close = document.getElementById('close');

let recipes = [];
const savedRecipes = localStorage.getItem("recipes");
if (savedRecipes) {
    recipes = JSON.parse(savedRecipes);
}
if (savebtn) {
    savebtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (!title.value.trim() || !Recipe_Description.value.trim() || !Recipe_Ingred.value.trim() || upload.files.length === 0) {
            message.innerHTML = "Please fill in all fields.";
            return;
        }
        const reader = new FileReader();
        reader.onload = function () {
            recipes.push({
                title: title.value.trim(),
                description: Recipe_Description.value.trim(),
                ingredients: Recipe_Ingred.value.trim(),
                image: reader.result
            });
            localStorage.setItem("recipes", JSON.stringify(recipes));

            title.value = "";
            Recipe_Description.value = "";
            Recipe_Ingred.value = "";
            upload.value = "";
            message.innerHTML = "You have successfully added the recipe to your vault";
        };
        reader.readAsDataURL(upload.files[0]);
    })
}
if (viewMessage) {
    if (recipes.length === 0) {
        viewMessage.innerHTML = "Your vault is empty";
    } else {
        function showMycards(filteredRecipes = recipes) {
            cards.innerHTML = "";
            filteredRecipes.forEach((card, index) => {
                const cardDiv = document.createElement("div");
                cardDiv.className = "cards";

                const images = document.createElement('img');
                images.src = card.image
                images.alt = "Recipe Image";
                const title = document.createElement('h3');
                title.textContent = card.title;
                const btnDelete = document.createElement('button');
                btnDelete.textContent = "Delete";
                btnDelete.type = "button";
                btnDelete.className = "btnDelete";
                btnDelete.addEventListener("click", function (e) {
                    e.stopPropagation();
                    recipes.splice(index, 1);
                    localStorage.setItem("recipes", JSON.stringify(recipes));
                    showMycards()


                })
                cardDiv.addEventListener("click", function () {
                    document.getElementById('modal-image').src = card.image;
                    document.getElementById('modal-title').textContent = card.title;
                    document.getElementById('modal-description').textContent = card.description;
                    const ingredientsList = card.ingredients
                        .split('\n')
                        .map(item => item.trim())
                        .filter(item => item !== "");

                    const modalIngred = document.getElementById('modal-Ingred');
                    modalIngred.innerHTML = ""; // Clear old list

                    ingredientsList.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        modalIngred.appendChild(li);
                    });

                    modal.style.display = "flex";
                })


                cardDiv.appendChild(images);
                cardDiv.appendChild(title);
                cardDiv.appendChild(btnDelete);
                cards.appendChild(cardDiv);



            });
        }
        close.addEventListener("click", function () {
            modal.style.display = "none";
        })
        showMycards();
    }
    const search = document.getElementById('search');
    const searchResult = document.getElementById('searchResult');
    if (search && searchResult) {
        search.addEventListener("input", function () {
            const query = search.value.toLowerCase();

            const filtered = recipes.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.ingredients.toLowerCase().includes(query)
            );

            showMycards(filtered);
        });

    }
   

    }
}
