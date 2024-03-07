const https = require("https");

// Function to fetch data from "https://time.com" URL
// Returns a Promise containing the JSON array of title and link
function fetchStories() {
    return new Promise((resolve, reject) => {
        const url = "https://time.com";
        const result = [];

        https
            .get(url, (res) => {
                let data = "";

                res.on("data", (chunk) => {
                    data += chunk;
                });

                res.on("end", () => {
                    // String containing HTML to be extracted from response
                    const startString =
                        '<div class="partial latest-stories" data-module_name="Latest Stories"';
                    const endString = "</ul>";

                    // Find the start and end indices of the latest stories section
                    const startIndex = data.indexOf(startString);
                    const endIndex = data.indexOf(endString, startIndex);

                    // Extract the latest stories section
                    const latestStoriesSection = data.substring(
                        startIndex,
                        endIndex
                    );

                    // Extract individual stories
                    const stories = latestStoriesSection.match(
                        /<li class="latest-stories__item">(.*?)<\/li>/gs
                    );

                    // Extract title and link from each story
                    stories.forEach((story) => {
                        const titleMatch = story.match(
                            /<h3 class="latest-stories__item-headline">(.*?)<\/h3>/
                        );
                        const title = titleMatch ? titleMatch[1].trim() : "";
                        const linkMatch = story.match(/<a href="(.*?)">/);
                        const link = linkMatch
                            ? "https://time.com" + linkMatch[1]
                            : "";

                        result.push({ title: title, link: link });
                    });

                    // Resolve the promise with the result
                    resolve(result);
                });
            })
            // Reject the promise if an error occurs
            .on("error", (err) => {
                reject(err);
            });
    });
}

module.exports = fetchStories;
