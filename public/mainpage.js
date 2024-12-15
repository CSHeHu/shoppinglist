
document.getElementById("addToListForm").addEventListener("submit", event => {
    event.preventDefault();
    submitForm();
});

document.getElementById("addToListReset").addEventListener("click", event => {
  event.preventDefault();
  resetForm();
})

async function submitForm(){
    const name = document.getElementById('addToListInput').value.trim();
    const amount = document.getElementById('addAmountToListInput').value.trim();
    const finished = false;
    try{
        const response = await fetch('/', {
           method: 'POST',
           headers: {
            'Content-Type': 'application/json',
           },
           body: JSON.stringify({ name, amount, finished}), 
        });
    
        updateList();
      }
    
    catch (err){
        console.error('Error:', err)
    }
}

async function resetForm(){
  try{
    const response = await fetch('/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    updateList();
  }
  
  catch (err) {
    console.error('Error:', err)
  }
  
}

async function updateList(){
  const response = await fetch('http://localhost:3000/data');
  const data = await response.json();

  // Clear the old list
  const SLContainer = document.getElementById("SLContainer");
  SLContainer.innerHTML = '';
  // Update the list with new items
  if (data && data.length > 0){
    data.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = `${item.name} - ${item.amount}`;
      SLContainer.appendChild(listItem);
    })

  }


}