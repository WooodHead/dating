import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from 'api';
import { toast } from 'react-toastify';

const contact = createAsyncThunk('contact', async (data) => {
  try {
    const res = await api.contact.postMessage(data);
    // console.log('=> RES CONTACT', res.data);
    toast.success('Your message has been successfully sent')
    return res.data;
  } catch (err) {
    if (err?.response?.status === 400) {
      err.response.data.forEach((errMsg) => {
        const formattedErrMsg = errMsg.split(' - ');
        toast.error(formattedErrMsg[1]);
      });
    }
    throw err;
  }
});

const thunks = {
  contact,
};

export { thunks };
