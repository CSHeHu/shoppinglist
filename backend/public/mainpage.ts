import type { StatusError } from "../types/StatusError.js";

document.getElementById("addToListForm")!.addEventListener("submit", event => {
  event.preventDefault();
  submitForm();
});

document.getElementById("addToListReset")!.addEventListener("click", event => {
  event.preventDefault();
  resetForm();
})

document.getElementById("SLContainer")!.addEventListener("click", event => {
  const target = event.target as HTMLElement;
  if (target.tagName === 'BUTTON' && target.id === 'collected') {
    toggleItem(event);
  }
  if (target.tagName === 'BUTTON' && target.id === 'delete') {
    const listItem = target.closest('li');
    const _id = listItem?.getAttribute("id");
    if (_id) deleteOneElement(_id);
  }
});

const listInputFields = document.querySelectorAll<HTMLInputElement>("#SLContainer input");

document.getElementById("SLContainer")!.addEventListener("focusout", event => {
  const target = event.target as HTMLElement;
  if (target.tagName === "INPUT") {
    updateOneElement(event);
  }
});

function showError(message: string) {
  const errorDiv = document.getElementById('errorMessage')!;
  errorDiv.textContent = message;
  errorDiv.style.display = '';
}

function hideError() {
  const errorDiv = document.getElementById('errorMessage')!;
  errorDiv.textContent = '';
  errorDiv.style.display = 'none';
}

async function submitForm() {
  hideError();
  const name = (document.getElementById('addToListInput') as HTMLInputElement).value;
  const amount = (document.getElementById('addAmountToListInput') as HTMLInputElement).value;
  const finished = false;
  try {
    const response = await fetch('/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, amount, finished }),
    });
    await handleResponse(response);
    updateList();
  }
  catch (err: unknown) {
    const error = err as StatusError;
    showError(error.message);
  }
}

async function resetForm() {
  hideError();
  try {
    const response = await fetch('/items', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    await handleResponse(response);
    updateList();
  }
  catch (err: unknown) {
    const error = err as StatusError;
    showError(error.message);
  }
}

async function updateList() {
  hideError();
  try {
    const response = await fetch('/items');
    await handleResponse(response);
    const data: Array<{ _id: string, name: string, amount: number, finished: boolean }> = await response.json();
    // Clear the old list
    const SLContainer = document.getElementById("SLContainer")!;
    SLContainer.innerHTML = '';
    // Update the list with new items
    if (data && data.length > 0) {
      data.forEach(item => {
        const listItem = document.createElement('LI');
        listItem.setAttribute("id", item._id);
        // finished
        if (item.finished) {
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
        amountInput.value = String(item.amount);
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
  } catch (err: any) {
    showError(err.message);
  }
}

async function toggleItem(event: Event) {
  const target = event.target as HTMLElement;
  const listItem = target.parentElement as HTMLElement;
  if (!listItem) return;
  // Toggle the "finished" class on the <li> element
  if (!listItem.classList.contains("finished")) {
    listItem.classList.add("finished");
  } else {
    listItem.classList.remove("finished");
  }
  updateOneElement(event);
}

async function updateOneElement(event: Event) {
  hideError();
  const target = event.target as HTMLElement;
  const listItem = target.parentElement as HTMLElement;
  const _id = listItem.getAttribute("id");
  const name = (listItem.children[0] as HTMLInputElement).value;
  const amount = (listItem.children[1] as HTMLInputElement).value;
  const finished = listItem.classList.contains("finished");
  try {
    const response = await fetch(`/items/${_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, amount, finished }),
    });
    await handleResponse(response);
  }
  catch (err: unknown) {
    const error = err as StatusError;
    showError(error.message);
  }
}

async function deleteOneElement(_id: string) {
  hideError();
  try {
    const response = await fetch(`/items/${_id}`, {
      method: 'DELETE',
    });
    await handleResponse(response);
    updateList();
  }
  catch (err: unknown) {
    const error = err as StatusError;
    showError(error.message);
  }
}

async function handleResponse(response: Response) {
  if (response.redirected) {
    window.location.href = response.url;
    return;
  }
  if (!response.ok) {
    let errorMsg = `HTTP error ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) {
        errorMsg = `${errorData.error.message} (${errorData.error.code})`;
      }
    } catch (e) {
    }
    throw new Error(errorMsg);
  }
  return response;
}
