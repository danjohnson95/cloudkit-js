import secrets from "../secrets";
import { CloudKitJs } from "../src";

const orm = new CloudKitJs({
    containerName: secrets.containerName,
    keyId: secrets.keyId,
    privateKeyPath: secrets.privateKeyPath,
})

/**
 * Counts all Recipes.
 */
const uploadImageToRecipe = async (imageUrl: string, recipeName: string) => {
    // We've got our recipe name, but we need the RecordName.
    // So let's query for that.
    const resp = await orm.queryRecords({
        desiredKeys: ["recordName"],
        resultsLimit: 1,
        query: {
            recordType: "Recipe",
            filterBy: {
                fieldName: "name",
                comparator: "EQUALS",
                fieldValue: {
                    value: recipeName,
                }
            }
        }
    })

    const recordName = resp.records[0].recordName

    // Now let's upload our image to the recipe.
    await orm.uploadAssetFromUrl(
        "Recipe", // The record type
        "image", // The name of the field where the asset should be stored
        imageUrl,
        recordName
    )
}

// Let's say we want to upload an image to our Cacio e Pepe recipe.
uploadImageToRecipe(
    "https://images.unsplash.com/photo-1663153465971-7fbb838043ca",
    "Cacio e Pepe"
)
