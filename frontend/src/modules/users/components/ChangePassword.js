import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as actions from '../actions';
import "../../app/style/UserStyle.css";
import Button from "react-bootstrap/Button";
import users from "../index";

const ChangePassword = () => {

    const user = useSelector(users.selectors.getUser);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState(false);
    const [errorMinLengthPassword, setErrorMinLengthPassword] = useState(false);


    const [errorCurrentPassword, setErrorCurrentPassword] = useState(null);
    const [errorNewPassword, setErrorNewPassword] = useState(null);
    const [errorConfirmNewPassword, setErrorConfirmNewPassword] = useState(null);

    let form;

    const handleSubmit = event => {
        event.preventDefault();
        setErrorCurrentPassword(false);
        setErrorNewPassword(false);
        setErrorConfirmNewPassword(false);
        setPasswordsDoNotMatch(false);
        setErrorMinLengthPassword(false);
        setError(false);

        let hasError = false;

        if (currentPassword.length === 0) {
            setErrorCurrentPassword(true);
            hasError = true;
        }
        if (newPassword.length === 0) {
            setErrorNewPassword(true);
            hasError = true;
        }
        if (confirmNewPassword.length === 0) {
            setErrorConfirmNewPassword(true);
            hasError = true;
        }

        if (hasError) return;

        if (newPassword.length < 7) {
            setErrorMinLengthPassword(true);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setPasswordsDoNotMatch(true);
            return;
        }

        if (form.checkValidity()) {
            if (!user?.id) {
                setError([{ message: 'Usuario no autenticado' }]);
                return;
            }

            dispatch(actions.changePassword(
                user.id,
                currentPassword,
                newPassword,
                () => {
                    navigate('/account');
                },
                errors => setError(errors)
            ));
        } else {
            setError(null);
            form.classList.add('was-validated');
        }
    }

    const parseError = (error) => {
        if (!error) return [];

        const errorMessages = Array.isArray(error) ? error : [error];

        return errorMessages.map(err => {
            const msg = typeof err === 'string'
                ? err
                : err?.message ?? JSON.stringify(err);

            if (msg.includes('IncorrectPasswordException')) {
                return 'Contraseña actual incorrecta.';
            }
            if (msg.includes('Usuario no autenticado')) {
                return 'Usuario no autenticado. Por favor, inicia sesión.';
            }
            return 'Ha ocurrido un error inesperado';
        });
    };

    const Errors = ({ errors = [] }) => {
        if (!errors || errors.length === 0) return null;

        return (
            <div className="alert alert-danger" role="alert">
                <ul className="mb-0">
                    {errors.map((err, index) => (
                        <li key={index}>{err}</li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="User-Login Content Justify-Content-Center"
             style={{
                 backgroundImage: `var(--background-image-opacity-2), url(/theeasteregg_web/assets/origins_back.webp)`
             }}
        >
            <div className="Flex-center-div Text-center Justify-Content-Center">
                <div className="User-Login-Container">
                    <img src="/theeasteregg_web/assets/origins.webp" className="User-Login-Image" alt="Origins" />
                    <div className="Text-left">
                        <h1 className="Margin-top Margin-bottom">Actualizar contraseña</h1>

                        <Form
                            ref={node => form = node}
                            className="needs-validation"
                            noValidate
                            onSubmit={handleSubmit}
                        >
                            <div className="Margin-bottom">
                                <div data-testid="current-password" className="User-Login-Label">
                                    Contraseña actual*
                                </div>
                                <Form.Control
                                    type="password"
                                    className="User-Login-Input"
                                    id="current-password"
                                    name="current-password"
                                    placeholder=""
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    required
                                />
                                { errorCurrentPassword && (
                                    <div className="Margin-bottom User-Login-Error">
                                        Debes introducir tu contraseña actual
                                    </div>
                                )}
                            </div>

                            <div className="Margin-bottom">
                                <div data-testid="new-password" className="User-Login-Label">
                                    Nueva contraseña*
                                </div>
                                <Form.Control
                                    type="password"
                                    className="User-Login-Input"
                                    id="new-password"
                                    name="new-password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                />
                                { errorNewPassword && (
                                    <div className="Margin-bottom User-Login-Error">
                                        Debes introducir la contraseña nueva
                                    </div>
                                )}
                                { errorMinLengthPassword && (
                                    <div className="Margin-bottom User-Login-Error">
                                        La contraseña debe tener una longitud mínima de 7 caracteres
                                    </div>
                                )}
                            </div>

                            <div className="Margin-bottom">
                                <div data-testid="confirm-new-password" className="User-Login-Label">
                                    Confirma tu nueva contraseña*
                                </div>
                                <Form.Control
                                    type="password"
                                    className="User-Login-Input"
                                    id="confirm-new-password"
                                    name="confirm-new-password"
                                    value={confirmNewPassword}
                                    onChange={e => setConfirmNewPassword(e.target.value)}
                                    required
                                />
                                { errorConfirmNewPassword && (
                                    <div className="Margin-bottom User-Login-Error">
                                        Debes confirmar tu nueva contraseña
                                    </div>
                                )}
                                { passwordsDoNotMatch && (
                                    <div className="Margin-bottom User-Login-Error">
                                        Las contraseñas no coinciden
                                    </div>
                                )}
                                { errorMinLengthPassword && (
                                    <div className="Margin-bottom User-Login-Error">
                                        La contraseña debe tener una longitud mínima de 7 caracteres
                                    </div>
                                )}
                            </div>

                            <div className="Margin-bottom">
                                <div className="User-Login-Label-Small">
                                    * Campos obligatorios
                                </div>
                            </div>

                            <div className="Margin-bottom User-Login-Error">
                                <Errors errors={parseError(error)} onClose={() => setError(null)} />
                            </div>

                            <Button type="submit" data-testid="submit" className="User-Login-Button">
                                Aplicar cambios
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
            <div className="Flex-center-div Justify-Content-Center">
                <div className="User-Login-Alternative">
                    <Link to="/account" className="Formatted-Link-Blue">
                        Atrás
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
