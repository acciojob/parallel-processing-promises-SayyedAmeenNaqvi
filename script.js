//your JS code here. If required.


// Get necessary DOM elements
const output = document.getElementById("output");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const btn = document.getElementById("download-images-button");

// Image URLs array (Added one non-existent URL for testing the error case)
const images = [
  { url: "https://picsum.photos/id/237/200/300" },
  { url: "https://picsum.photos/id/238/200/300" },
  { url: "https://picsum.photos/id/239/200/300" },
];

/**
 * downloadImage Function: Returns a Promise that resolves with the image element 
 * on successful load or rejects on failure with a descriptive error.
 * @param {string} url - The URL of the image.
 * @returns {Promise<HTMLImageElement>}
 */
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      // Success: Resolve the promise
      resolve(img);
    };
    
    img.onerror = () => {
      // Handle Download Failure: Reject the promise with a descriptive error message
      reject(new Error(`Image failed to load: ${url}`));
    };
    
    // Start the download
    img.src = url;
  });
}

/**
 * downloadImages Function: Main function using Promise.all() for parallel download management.
 */
async function downloadImages() {
  // Clear previous state and hide any old errors
  output.innerHTML = "";
  errorDiv.classList.add("hidden");

  // 1. Loading Spinner: SHOW the #loading div
  loadingDiv.classList.remove("hidden");
  
  // Create an array of Promises for all image downloads
  const imagePromises = images.map(item => downloadImage(item.url));

  try {
    // 2. Parallel Downloads: Wait for ALL promises to complete.
    // If one rejects, the entire Promise.all() operation rejects.
    const loadedImages = await Promise.all(imagePromises);

    // 3. Display Images: All images loaded successfully. Append them to the #output div.
    loadedImages.forEach(img => {
      output.appendChild(img);
    });

  } catch (error) {
    // 4. Error Handling: Display the error message in the #error div
    errorDiv.textContent = `A download failed! ${error.message}`;
    errorDiv.classList.remove("hidden");

  } finally {
    // 5. Loading Spinner: HIDE the #loading div, regardless of outcome
    loadingDiv.classList.add("hidden");
  }
}

// Attach the main function to the button click event
btn.addEventListener("click", downloadImages);