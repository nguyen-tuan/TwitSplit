function showPopupMess() {
  const popUp = document.querySelector('.popup')
  popUp.classList.add('show-popup')
}

function hiddenPopup() {
  const popUp = document.querySelector('.popup.show-popup')
  popUp.classList.remove('show-popup')
  hiddenMessArea()
}

function showMessArea() {
  const popUpArea = document.querySelector('.popup .popup-area')
  popUpArea.classList.add('in-mess')
}

function hiddenMessArea() {
  const popUpArea = document.querySelector('.popup .popup-area')
  popUpArea.classList.remove('in-mess')
}

function handleSubmitBtn() {
  const messInput = document.querySelector('.composer .input-mess')
  const btnSubmit = document.querySelector('.composer .btn-submit')
  if (messInput.value) {
    btnSubmit.disabled = false
  } else {
    btnSubmit.disabled = true
  }
}

function onSendMessage() {
  const messInput = document.querySelector('.composer .input-mess')
  let value = messInput.value
  const lengthOfText = value.length

  if (lengthOfText) {
    const areaMess = document.querySelector('.area-mess')
    const containerMess = document.querySelector('.area-mess .scroll-container')
    let arrMess = []
    const total = Math.ceil(lengthOfText / 50)

    for (let i = 0; i < total; i++) {
      const splitText = value.slice(0, 50)
      const lastIndexSpace = splitText.lastIndexOf(' ')

      if (lastIndexSpace === -1 && splitText.length === 50) {
        arrMess = null
        break;
      } else {
        if (lastIndexSpace === -1) {
          arrMess.push(splitText)
        } else {
          const textMess = splitText.slice(0, lastIndexSpace)
          arrMess.push(textMess)
          value = value.slice(lastIndexSpace + 1, value.length)
        }
      }
    }

    if (arrMess) {
      arrMess.map((item, i) => {
        createMess({ textMess: item, containerMess, total, index: i + 1 })
      })
    } else {
      const textMess = 'the message contains a span of non-whitespace characters longer than 50 characters';
      createMess({ textMess, containerMess, isError: true })
    }

    areaMess.scrollTop = areaMess.scrollHeight;
    messInput.value = ''
  }
}

function createMess({ textMess, containerMess, total, index, isError = false }) {
  const divMess = document.createElement("DIV")
  const text = document.createTextNode(textMess)

  divMess.classList.add('tweet-mess')
  if (isError) {
    divMess.classList.add('error-mess')
  }
  divMess.appendChild(text)
  containerMess.appendChild(divMess)

  if (index && total) {
    const divIndex = document.createElement("DIV")
    const textIndex = document.createTextNode(`${index}/${total}`)
    divIndex.classList.add('index-mess')
    divIndex.appendChild(textIndex)
    divMess.appendChild(divIndex)
  }
}

document.addEventListener('keydown', (e) => {
  if (e.which === 13) {
    onSendMessage()
  }
})
