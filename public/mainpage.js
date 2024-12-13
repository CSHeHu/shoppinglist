document.getElementById("addToListForm").addEventListener("submit", event => {
    event.preventDefault();
    submitForm();
});


async function submitForm(){
    const name = document.getElementById('addToListInput').value.trim();
    const amount = document.getElementById('addAmountToListInput').value.trim();

    try{
        const response = await fetch('/', {
           method: 'POST',
           headers: {
            'Content-Type': 'application/json',
           },
           body: JSON.stringify({ name, amount}), 
        });


        if (response.ok) {
        window.location.reload();  // Reload the page to reflect the changes
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'Failed to add item'));
      }
    }
    
    catch (err){
        console.error('Error:', err)
    }
}