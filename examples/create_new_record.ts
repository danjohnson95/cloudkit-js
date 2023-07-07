import secrets from "../secrets";
import { CloudKitJs } from "../src";

const orm = new CloudKitJs({
    containerName: secrets.containerName,
    keyId: secrets.keyId,
    privateKeyPath: secrets.privateKeyPath,
})

/**
 * Creates a new recipe.
 */
const createNewRecipe = async ({
    recipeName,
    ingredients,
    method,
    timeToCook,
    rating
}: {
    recipeName: string,
    ingredients: string[],
    method: string[],
    timeToCook: number,
    rating: number
}) => {
    await orm.createRecord({
        recordType: "Recipes",
        fields: {
            recipeName: { value: recipeName },
            ingredients: { value: ingredients },
            method: { value: method },
            timeToCook: { value: timeToCook },
            rating: { value: rating }
        }
    })

    console.log(`${recipeName} was successfully created.`)
}

// Now let's create a recipe for a delicious pasta dish.
createNewRecipe({
    recipeName: "Cacio e Pepe",
    ingredients: [
        "Pasta",
        "Pecorino Romano",
        "Black Pepper"
    ],
    method: [
        "Boil water",
        "Add pasta",
        "Grate cheese",
        "Add cheese and pepper to pasta",
        "Mix"
    ],
    timeToCook: 15,
    rating: 5
})