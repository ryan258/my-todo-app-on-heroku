document.addEventListener('click', function (e) {
  if (e.target.classList.contains('edit-me')) {
    // console.log('you clicked the edit button!');
    let userInput = prompt('Enter your desired new text');
    // console.log(userInput);
    axios
      .post('/update-item', { text: userInput })
      .then(function () {
        // do something in the next part
      })
      .catch(function () {
        console.log('please try again later');
      });
  }
});
