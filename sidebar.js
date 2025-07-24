const COHERE_API_KEY = "API KEY"; // <-- Put your Cohere API key here

document.getElementById("ask").addEventListener("click", async () => {
  const input = document.getElementById("input").value.trim();
  const output = document.getElementById("output");

  if (!input) {
    output.value = "Please enter a question or prompt.";
    return;
  }

  output.value = "Thinking...";

  try {
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json",
        "Cohere-Version": "2022-12-06"
      },
      body: JSON.stringify({
        model: "command-r-plus",
        message: input,
        temperature: 0.7
      }),
    });

    const data = await response.json();

    if (data.text) {
      output.value = data.text.trim();
    } else {
      output.value = "No response from Cohere.";
    }
  } catch (error) {
    console.error(error);
    output.value = "Error communicating with Cohere.";
  }
});


document.getElementById("typeIntoDoc").addEventListener("click", async () => {
  const textToType = document.getElementById("output").value;
  if (!textToType) {
    alert("No AI response to type.");
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async (text) => {
      const editable = document.querySelector('.kix-appview-editor');
      if (!editable) {
        alert('Could not find the editor.');
        return;
      }
      editable.focus();

      for (const char of text) {
        const eventInput = new InputEvent('beforeinput', { inputType: 'insertText', data: char, bubbles: true });
        editable.dispatchEvent(eventInput);

        document.execCommand('insertText', false, char);

        await new Promise(r => setTimeout(r, 50));
      }
    },
    args: [textToType]
  });
});
