import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import { hideSuccessMessage } from '../../users/actions';
import { getSuccessMessage } from '../../users/selectors';
import './SuccessMessage.css';

const SuccessMessage = () => {

    const successMessage = useSelector(getSuccessMessage);
    const dispatch = useDispatch();

    useEffect(() => {
        if (successMessage) {
            console.log('SuccessMessage:', successMessage);
            const timer = setTimeout(() => {
                dispatch(hideSuccessMessage());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, dispatch]);

    if (!successMessage) {
        return null;
    }

    return (
        <Alert variant="success" className="success-message">
            {successMessage}
        </Alert>
    );

}

export default SuccessMessage;
