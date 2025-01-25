
document.getElementById("addToListForm").addEventListener("submit", event => {
    event.preventDefault();
    submitForm();
});

document.getElementById("addToListReset").addEventListener("click", event => {
  event.preventDefault();
  resetForm();
})

document.getElementById("SLContainer").addEventListener("click", event => {
  if (event.target.tagName === 'BUTTON' && event.target.id === 'collected') {
    toggleItem(event);
  }
  if (event.target.tagName === 'BUTTON' && event.target.id === 'delete'){
    const listItem = event.target.closest('li');
    const _id = listItem.getAttribute("id");
    deleteOneElement(_id);
  }
});

const listInputFields = document.querySelectorAll("#SLContainer input");

document.getElementById("SLContainer").addEventListener("focusout", event => {
  if (event.target.tagName === "INPUT") { 
    updateOneElement(event);
  }
});


async function submitForm(){
    const name = document.getElementById('addToListInput').value;
    const amount = document.getElementById('addAmountToListInput').value;
    const finished = false;
    try{
        const response = await fetch('/data', {
           method: 'POST',
           headers: {
            'Content-Type': 'application/json',
           },
           body: JSON.stringify({ name, amount, finished}), 
        });
  
        // for testing with errors
        if (!response.ok) {
            const errorHtml = await response.text(); 
            document.body.innerHTML = errorHtml; 
            return;
        }
        // for testing with errors

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

      // collected button
      const collectedButton = document.createElement("button");
      collectedButton.type = "button";
      collectedButton.id = "collected";
      collectedButton.textContent = "Collected";
      listItem.appendChild(collectedButton);

      // delete button
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.id = "delete";
      deleteButton.textContent = "Delete";
      listItem.appendChild(deleteButton);
      
      SLContainer.appendChild(listItem);

    })
  }
}

async function toggleItem(event){
  const listItem = event.target.parentElement;
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
  const listItem = event.target.parentElement;
  const _id = listItem.getAttribute("id");
  const name = listItem.children[0].value; 
  const amount = listItem.children[1].value;
  const finished = listItem.classList.contains("finished");
  
  try{
        const response = await fetch('/data', {
           method: 'PATCH',
           headers: {
            'Content-Type': 'application/json',
           },
           body: JSON.stringify({ _id, name, amount, finished}), 
        });
      }
    
    catch (err){
        console.error('Error:', err)
    }
  
}


async function deleteOneElement(_id){
  try{
        const response = await fetch(`/data/${_id}`, {
           method: 'DELETE',
        });
   
        if (response.ok){
          updateList();
        }
        else{
          console.log("Error deleting element");
        }
   
      }
    
    catch (err){
        console.error('Error:', err)
    }
  
}
