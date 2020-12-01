function itemTemplate(item) {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}

// initial page load render
let ourHTML = items
  .map(function (item) {
    return itemTemplate(item)
  })
  .join("")
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML)

// create feature
let createField = document.getElementById("create-field")

document.getElementById("create-form").addEventListener("submit", function (e) {
  e.preventDefault()
  axios
    .post("/create-item", {
      text: createField.value
    })
    .then(function (response) {
      // create HTML for a new item
      // console.log("you just created a new item")
      document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data))
      createField.value = ""
      createField.focus()
    })
    .catch(function () {
      console.log("please try again later")
    })
})

document.addEventListener("click", function (e) {
  // Delete Feature
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Do you really want to delete this item?")) {
      axios
        .post("/delete-item", {
          id: e.target.getAttribute("data-id")
        })
        .then(function () {
          e.target.parentElement.parentElement.remove()
        })
        .catch(function () {
          console.log("please try again later")
        })
    }
  }

  // Update Feature
  if (e.target.classList.contains("edit-me")) {
    // console.log('you clicked the edit button!');
    let userInput = prompt(
      "Enter your desired new text",
      // grab the pre-edited, current value
      // e.target = the thing that was interacted with
      e.target.parentElement.parentElement.querySelector(".item-text").innerHTML
    )
    // console.log(userInput);
    // if userInput isn't blank/empty
    if (userInput) {
      axios
        .post("/update-item", {
          // update item in MongoDB
          // use the user provided value
          text: userInput,
          // in the item with the matching data-id
          id: e.target.getAttribute("data-id")
        })
        .then(function () {
          // update item in browser
          // then we update the text value of the item in the browser
          e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
        })
        .catch(function () {
          console.log("please try again later")
        })
    }
  }
})
