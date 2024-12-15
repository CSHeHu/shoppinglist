
document.getElementById("addToListForm").addEventListener("submit", event => {
    event.preventDefault();
    submitForm();
});

document.getElementById("addToListReset").addEventListener("click", event => {
  event.preventDefault();
  resetForm();
})

document.getElementById("SLContainer").addEventListener("click", event => {
  toggleItem(event);
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
     
      if (item.finished){
      listItem.className = "finished"
      listItem.textContent = `${item.name} - ${item.amount}`;
      SLContainer.appendChild(listItem);

      } else {
      listItem.textContent = `${item.name} - ${item.amount}`;
      SLContainer.appendChild(listItem);
      }
    })
  }
}

async function toggleItem(event){
  const listItem = event.target;
  if (listItem.className !== "finished"){
    listItem.className = "finished";
  } else {
    listItem.className = "";
  }
  // Needs db updating
}