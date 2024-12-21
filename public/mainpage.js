
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
    const name = document.getElementById('addToListInput').value;
    const amount = document.getElementById('addAmountToListInput').value;
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
    const response = await fetch('/data', {
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
  const response = await fetch('/data');
  const data = await response.json();


  // Clear the old list
  const SLContainer = document.getElementById("SLContainer");
  SLContainer.innerHTML = '';
  // Update the list with new items
  if (data && data.length > 0){
    data.forEach(item => {
      const listItem = document.createElement('LI');
      listItem.setAttribute("id", item._id);
     
      // finished
      if (item.finished){
      listItem.className = "finished"
      }
      
      // name
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "name";
      nameInput.value = item.name;
      listItem.appendChild(nameInput);

      // amount
      const amountInput = document.createElement("input");
      amountInput.type = "number";
      amountInput.className = "amount";
      amountInput.value = item.amount;
      listItem.appendChild(amountInput);
      
      SLContainer.appendChild(listItem);

    })
  }
}

async function toggleItem(event){
  const listItem = event.target;
  if (!listItem) return;

  // Toggle the "finished" class on the <li> element
  if (!listItem.classList.contains("finished")) {
    listItem.classList.add("finished");
  } else {
    listItem.classList.remove("finished");
  }
  updateOneElement(event);
}

async function updateOneElement(event){
  const listItem = event.target;

  const _id = listItem.getAttribute("id");
  const name = listItem.children[0].value; 
  const amount = listItem.children[1].value;
  const finished = listItem.classList.contains("finished");

  console.log(_id, name, amount, finished);
  
  try{
        const response = await fetch('/data', {
           method: 'PATCH',
           headers: {
            'Content-Type': 'application/json',
           },
           body: JSON.stringify({ _id, name, amount, finished}), 
        });
        
        updateList();
      }
    
    catch (err){
        console.error('Error:', err)
    }
  
}