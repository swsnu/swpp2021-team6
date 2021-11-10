import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { History } from 'history';
import { signout } from '../../store/actions/index';

interface SignOutProps {
  history: History;
}

const SignOut: React.FC<SignOutProps> = ({ history }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    history.push('/signin');
    dispatch(signout());
  }, [dispatch, history]);
  return <></>;
};

export default SignOut;
