const ages = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99];

const weights = [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160];

const heights = [150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220];

const relations = {
  DEFAULT: 'Default',
  BLOCK: 'Block',
  // FOLLOW: 'Follow',
};

const genders = {
  ALL: 'All',
  MALE: 'Male',
  FEMALE: 'Female',
};

const preferences = {
  ALL: 'All',
  MALE: 'Male',
  FEMALE: 'Female',
};

const notificationTypes = {
  CHAT: 'Chat',
  ALBUM: 'Album',
};

const mediaSizes = {
  xs: 390,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

const subscriptionPlans = [
  {
    _id: 1,
    icon: <img src="/img/plans/icon-standard.svg" />,
    alternativeIcon: <img src="/img/plans/icon-standard-alternative.svg" />,
    type: 'Free',
    title: 'Standard',
    price: 'Free',
    direction: null,
    accesses: [
      { included: true, text: 'people search limit'},
      { included: true, text: 'message limit'},
      { included: true, text: 'photo limit'},
      { included: false, text: 'first message someone'},
      { included: false, text: 'access to instant messages'},
      { included: false, text: 'access to private albums'},
      { included: false, text: 'access to public albums'},
    ],
    buttonColor: '#323B52',
    buttonText: 'Back to free',
  },
  {
    _id: 2,
    icon: <img src="/img/plans/icon-trial.svg" />,
    type: 'Trial',
    title: 'Trial',
    price: '4$',
    direction: '5 days',
    accesses: [
      { included: true, text: 'people search limit'},
      { included: true, text: 'message limit'},
      { included: true, text: 'photo limit'},
      { included: true, text: 'first message someone'},
      { included: true, text: 'access to instant messages'},
      { included: true, text: 'access to private albums'},
      { included: true, text: 'access to public albums'},
    ],
    buttonColor: '#FFA6A9',
  },
  {
    _id: 3,
    icon: <img src="/img/plans/icon-premium.svg" />,
    type: 'Premium',
    title: 'Premium',
    price: '12$',
    direction: 'month',
    accesses: [
      { included: true, text: 'people search limit'},
      { included: true, text: 'message limit'},
      { included: true, text: 'photo limit'},
      { included: true, text: 'first message someone'},
      { included: true, text: 'access to instant messages'},
      { included: true, text: 'access to private albums'},
      { included: true, text: 'access to public albums'},
    ],
    buttonColor: '#A16294',
  },
]

export {
  ages,
  weights,
  heights,
  relations,
  genders,
  preferences,
  notificationTypes,
  mediaSizes,
  subscriptionPlans
}
