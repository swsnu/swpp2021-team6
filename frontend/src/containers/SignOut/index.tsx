import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { signout } from '../../store/actions';

const SignOut = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    history.push('/signin');
    dispatch(signout());
  }, [dispatch, history]);

  return null;
};

export default SignOut;
