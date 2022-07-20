const changingUserOrPhotoHeart = (state, key, action) => {
  if (action === 'add') {
    state[key].heart += 1;
    state[key].isUserPutHeart = true;
  }
  
  if (action === 'remove') {
    state[key].heart -= 1;
    state[key].isUserPutHeart = false;
  }
};

const changingUserOrPhotoLike = (state, key, action) => {
  if (action === 'add') {
    state[key].like += 1;
    state[key].isUserPutLike = true;
  }
  
  if (action === 'remove') {
    state[key].like -= 1;
    state[key].isUserPutLike = false;
  }
};

export {
  changingUserOrPhotoHeart,
  changingUserOrPhotoLike,
}