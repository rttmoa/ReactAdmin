/* eslint-disable no-fallthrough */
// import { PaginationProps } from '@arco-design/web-react/es/Pagination/pagination';
import { LOGIN } from './actionTypes';

const initialState = {
  userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
};

export interface UserLoginState {
  userInfo?: {
    name?: string;
    avatar?: string;
  };
}

export default function(state = initialState, action) {
  // console.log(action) // {type: 'LOGIN', payload: {token:'ey235asg', username:'admin'}}
  switch (action.type) {
    case LOGIN: {
      const userInfo = {
        ...action.payload,
        avatar: 'http://nevergiveupt.top:3000/static/mine.d0f112df.jpeg',
        name: action.payload.userName,
      };
      // 原payload属性为 token和userName
      // userInfo中新加了两个属性是 avatar和name
      // userInfo: avatar, name, token, userName
      // console.log('userInfo', userInfo)
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      state.userInfo = userInfo;
    }
    default:
      return state;
  }
}
