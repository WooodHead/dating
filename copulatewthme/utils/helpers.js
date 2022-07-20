const bodyOverflow = (borderWidth) => {
  const {innerWidth: windowWidth} = window
  if(windowWidth === borderWidth || windowWidth < borderWidth) {
    let {overflow} = document.body.style
    if(overflow) {
      document.body.style.overflow = '';
    } else document.body.style.overflow = 'hidden'
  }
}

const cancelOverflow = () => {
  document.body.style.overflow = '';
}

export {
  bodyOverflow,
  cancelOverflow
}