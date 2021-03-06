import helper from "./helper"
import { HOST_URL } from "../config"

$(document).ready(() => {

  fetchData()

  $('.modal-trigger').leanModal()
  $( "#sortable" ).sortable()
  $( "#sortable" ).disableSelection()

  document.getElementById('modalForm').addEventListener('submit', postBook)
  document.getElementById('modalEdit').addEventListener('submit', updateComponent)

  /** 
   * GET: all available book items
  */
  function fetchData() {
    fetch(HOST_URL)
    .then(res => {
      if (!res.ok) {
        throw new Error()
      }
      return res.json()
    })
    .then(data => {
      helper.addComponent(data)
      helper.counter(data)
    })
    .catch(err => {
      helper.notification('We could not processed your request. Please try again.')
    });
  }

  /**
   * POST: create a new book item
   */
  function postBook(event){
    event.preventDefault()

    let pic = $('#fileToUpload')
    const imgValidation = helper.imgValidation(pic)

    if (imgValidation == false) {
      helper.notification('Please select a valid image')
      return;
    }
    
    let description = $('#description')
    let title = $('#title')

    let formData = new FormData()
    formData.append('book', pic[0].files[0])
    formData.append('description', description.val())
    formData.append('title', title.val())
    
    fetch(HOST_URL+'books', {
      method: 'POST',
      body: formData
    })    
    .then(res => {
      if (!res.ok) {
        throw new Error()
      }
      return res.json()
    })
    .then(data => {
      helper.addComponent(data)
      helper.counter(data)
      $('#modal1').closeModal()
      document.getElementById("modalForm").reset();
    })
    .catch(err => {
      helper.notification('We could not processed your request. Please try again.')
    });
  }

  /**
   * PUT: update book item
   */
  function updateComponent(event) {
    event.preventDefault();

    let id = $('#modalEdit1').data('datac')
    let pic = $('#fileToUploadEdit')
    let description = $('#descriptionEdit')

    const imgValidation = helper.imgValidation(pic)
    if (imgValidation == false) {
      helper.notification('Please select a valid image')
      return;
    }

    let formData = new FormData()
    formData.append('book', pic[0].files[0])
    formData.append('description', description.val())

    fetch(HOST_URL+`books/${id}`, {
      method: 'PUT',
      body: formData
    })
    .then(res => {
      if (!res.ok) {
          throw new Error()
      }
      return res.json()
    })
    .then(res => {
      helper.updateComponent(res, id)
      $('#modalEdit1').closeModal()
      document.getElementById("modalEdit").reset();
    })
    .catch(err =>
      helper.notification('We could not processed your request. Please try again.')
    );
  }

})
