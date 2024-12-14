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

    try{
        const response = await fetch('/', {
           method: 'POST',
           headers: {
            'Content-Type': 'application/json',
           },
           body: JSON.stringify({ name, amount}), 
        });
        
        if (response.ok){
          console.log('Waiting for 2 seconds before reloading...');
          // Wait for 2 seconds before reloading the page
          await new Promise(resolve => setTimeout(resolve, 2000));
          window.location.reload();}
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


    if (response.ok){
      console.log('Waiting for 2 seconds before reloading...');
      // Wait for 2 seconds before reloading the page
      await new Promise(resolve => setTimeout(resolve, 2000));
      window.location.reload();}




  }
  catch (err) {
    console.error('Error:', err)
  }
  
}