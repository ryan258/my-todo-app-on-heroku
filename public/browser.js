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
