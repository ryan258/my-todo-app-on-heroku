document.addEventListener('click', function (e) {
  if (e.target.classList.contains('edit-me')) {
    // console.log('you clicked the edit button!');
    let userInput = prompt(
      'Enter your desired new text',
      e.target.parentElement.parentElement.querySelector('.item-text').innerHTML
    );
    // console.log(userInput);
    if (userInput) {
      axios
        .post('/update-item', {
          text: userInput,
          id: e.target.getAttribute('data-id'),
        })
        .then(function () {
          e.target.parentElement.parentElement.querySelector(
            '.item-text'
          ).innerHTML = userInput;
        })
        .catch(function () {
          console.log('please try again later');
        });
    }
  }
});
