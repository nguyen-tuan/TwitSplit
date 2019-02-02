const invalidCommand = 'ERROR: Invalid command';
const notFound = 'ERROR: Key not found'
const notIntersection = 'No intersection among all set stored'
const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/;
let oldCommand = ''

document.addEventListener('keydown', (e) => {
  if (e.which === 13) {
    checkCommand()
  } else if (e.which === 38) {
    returnCommand({ old: true })
  } else if (e.which === 40) {
    returnCommand()
  }
})

function returnCommand({ old = false } = {}) {
  const inputCommand = document.querySelector('.input-command')
  inputCommand.value = old ? oldCommand : ''
}

function checkSpecialChar(text) {
  return format.test(text)
}

function getLengthAfterSplit(text) {
  return text.split(',').length
}

function createText(text) {
  const historyCommand = document.querySelector('.history-command')
  const divText = document.createElement("DIV")
  const textCommand = document.createTextNode(text)

  divText.appendChild(textCommand)
  historyCommand.appendChild(divText)
}

function removeCommand() {
  const inputCommand =  document.querySelector('.input-command')

  inputCommand.value = ''
}

function checkCommand() {
  const command = document.querySelector('.input-command').value
  const info = command.split(" ")
  const found = info.findIndex((element) => {
    return (!element || element.indexOf(' ') > -1 || checkSpecialChar(element)) 
  });

  oldCommand = command
  createText(`> ${command}`) // create command on history command
  removeCommand() // clear command in input

  if (found > -1) {
    // when found error
    createText(invalidCommand)
  } else {
    const keyWord = info[0]

    switch(keyWord) {
      case 'SET':
        setValue({ info })
        break;
  
      case 'GET':
        getValue({ info })
        break;

      case 'LLEN':
        getLength({ info })
        break;

      case 'RPUSH':
        pushList({ info })
        break;

      case 'LPOP': 
        returnItemOfList({ info })
        break;

      case 'RPOP':
        returnItemOfList({ info, index: 'last' })
        break;

      case 'LRANGE':
        returnItemOfList({ info, index: 'range' })
        break;

      case 'SADD':
        returnItemOfSet({ info, action: 'add' })
        break;

      case 'SREM':
        returnItemOfSet({ info, action: 'remove' })
        break;

      case 'SMEMBERS':
        returnItemOfSet({ info, action: 'all' })
        break;

      case 'SINTER':
        intersectionItem({ info })
        break;

      case 'KEYS':
        listAllKeys({ info })
        break;

      case 'DEL':
        delKey({ info })
        break;

      case 'EXPIRE':
        timeoutOfKey({ info })
        break;

      case 'TTL':
        queryTimeout({ info })
        break;

      
    }
  }
}

function queryTimeout({ info }) {
  let response = ''

  if (info.length === 2) {
    const key = info[1]

    if (localStorage[key]) {
      response = getCookie(key)
    } else {
      response = notFound
    }
  } else {
    response = invalidCommand
  }
  createText(response)      
}

function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
  return v ? v[2] : null
}

function deleteCookie(name) { 
  setCookie(name, '', -1)
}

function timeoutOfKey({ info }) {
  let response = ''
  const timeout = info[2]

  if (info.length === 3 && timeout > 0) {
    const key = info[1]

    if (localStorage[key]) {
      document.cookie = `${key}=${timeout}`
      response = timeout
    } else {
      response = notFound
    }
  } else {
    response = invalidCommand
  }
  createText(response)    
}

function delKey({ info }) {
  let response = ''
  if (info.length === 2) {
    const key = info[1]

    delete localStorage[key]
    deleteCookie(key)
    response = 'OK'
  } else {
    response = invalidCommand
  }
  createText(response)    
}

function listAllKeys({ info }) {
  const response = info.length === 1 ? Object.keys(localStorage) : invalidCommand
  createText(response)    
}

function intersectionItem({ info }) {
  const arrKey = info.slice(1)
  let arrIntersection = []
  let isError = false
  arrKey.every((item, index) => {
    const valueOfKey = localStorage.getItem(item)
    if (valueOfKey) {
      const arrValue = valueOfKey.split(',')
      if (arrIntersection.length === 0) {
        arrIntersection = arrValue
      } else {
        const arrTemporary = []        
        arrValue.forEach(item => {
          if (arrIntersection.indexOf(item) > -1) {
            arrTemporary.push(item)
          }
        })
        arrIntersection = arrTemporary
        if (arrIntersection.length === 0) {
          return false
        }
      }
      return true
    }
    isError = true
    return false
  })


  const response = isError ? notFound : arrIntersection.length === 0 ? notIntersection : `[${arrIntersection}]`
  createText(response)    
}

function returnItemOfSet({ info, action }) {
  const key = info[1]
  const valueOfKey = localStorage.getItem(key)
  const arrValueOfInput = info.slice(2)
  let response = ''

  if (valueOfKey) {
    const arrValueOfStore = valueOfKey.split(',')

    if (action === 'all') {
      if (info.length === 2) {
        response = `[${arrValueOfStore}]`
      } else {
        response = invalidCommand
      }
    } else {
      arrValueOfInput.forEach((item) => {
        const index = arrValueOfStore.indexOf(item)
        if (!(index > -1) && action === 'add') {
          arrValueOfStore.push(item)
        } else if (index > -1 && action === 'remove') {
          arrValueOfStore.splice(index, 1)        
        }
        localStorage[key] = arrValueOfStore      
        response = "OK"
      })
    }
  } else {
    response = notFound
  }
  createText(response)    
}

function returnItemOfList({ info, index }) {
  const key = info[1]
  const valueOfKey = localStorage.getItem(key)
  const arrValue = valueOfKey.split(',')
  let response = ''
  
  if (info.length === 2) {
    if (valueOfKey) {
      let value = arrValue[0]
      if (index === 'last') {
        value = arrValue[arrValue.length - 1]
      }
      localStorage[key] = value
      response = value
    } else {
      response = notFound
    }
  } else if (info.length === 4) {
    const start = info[2]
    const stop = info[3]

    if (index === 'range' && start >= 0 && stop >= 0) {
      const value = arrValue.slice(start, stop)
      localStorage[key] = value
      response = value
    } else {
      response = invalidCommand     
    }
  } else {
    response = invalidCommand     
  }

  createText(response)    
}

function pushList({ info }) {
  const key = info[1]
  const valueOfKey = localStorage.getItem(key)
  const arrValue = info.slice(2)

  localStorage[key] = valueOfKey ? `${valueOfKey}, ${arrValue}` : arrValue
  const response = getLengthAfterSplit(localStorage[key])
  createText(response)  
}


function getLength({ info }) {
  let response = ''

  if (info.length === 2) {
    const key = info[1]
    response = localStorage.getItem(key) ? getLengthAfterSplit(localStorage.getItem(key)) : notFound
  } else {
    response = invalidCommand     
  }

  createText(response)  
}

function setValue({ info, isPush = false }) {
  let response = ''

  if (info.length === 3) {
    const key = info[1]
    const value = info[2]

    localStorage.setItem(key, value)
    response = 'OK'
  } else {
    response = invalidCommand
  }

  createText(response)
}

function getValue({ info }) {
  let response = ''

  if (info.length === 2) {
    const key = info[1]
    response = localStorage.getItem(key) ? localStorage.getItem(key) : notFound
  } else {
    response = invalidCommand 
  }

  createText(response)
}

function focusInput() {
  document.querySelector('.input-command').focus();
}

focusInput()
