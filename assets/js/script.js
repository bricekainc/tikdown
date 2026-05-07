document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".download").addEventListener("click", handleVideoProcess);
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".modal").style.display = "none";
  });
});

async function handleVideoProcess(e) {
  e.preventDefault();
  const inputUrl = document.querySelector("#video-id").value.trim();

  if (!inputUrl) {
    showErrorMessage("Please enter a TikTok URL");
    return;
  }

  try {
    e.target.classList.add("loading");

    // Using the public Tikwm API for metadata/preview to avoid the onrender bottleneck
    const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(inputUrl)}`);
    const res = await response.json();

    if (res.code === 0 && res.data) {
      const data = res.data;
      
      // Update UI with Preview
      showPreviewUI(data, inputUrl);
    } else {
      showErrorMessage("Video metadata not found. Check the URL.");
    }
  } catch (error) {
    console.error(error);
    showErrorMessage("An error occurred while fetching the preview");
  } finally {
    e.target.classList.remove("loading");
  }
}

function showPreviewUI(data, originalUrl) {
  // Assuming you have a container for the preview (e.g., #preview-container)
  // If not, you can target your existing modal or a results div
  const container = document.querySelector("#preview-container") || document.querySelector(".modal");
  
  // Construct the Redirect URL for your domain
  const redirectUrl = `https://briceka.com/tikdown?url=${encodeURIComponent(originalUrl)}`;

  const htmlContent = `
    <div class="video-preview-wrapper" style="text-align: center; padding: 20px;">
      <img src="${data.cover}" alt="Preview" style="width: 100%; max-width: 300px; border-radius: 10px; margin-bottom: 15px;">
      <p style="font-weight: bold; margin-bottom: 15px;">${data.title || 'TikTok Video'}</p>
      <a href="${redirectUrl}" 
         style="display: inline-block; background: #fe2c55; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
         Download Video (No Watermark)
      </a>
    </div>
  `;

  // If using your modal to show the preview:
  const errorText = document.querySelector("#errorText");
  if(errorText) {
      errorText.innerHTML = htmlContent;
      document.querySelector(".modal").style.display = "block";
  }
}

function showErrorMessage(message) {
  const modal = document.querySelector(".modal");
  const errorText = document.querySelector("#errorText");
  errorText.textContent = message;
  modal.style.display = "block";
}
