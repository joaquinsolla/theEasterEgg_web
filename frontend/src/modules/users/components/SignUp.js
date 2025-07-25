import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as actions from '../actions';
import "../../app/style/UserStyle.css";
import Button from "react-bootstrap/Button";

const SignUp = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState(false);
    const [errorMinLengthPassword, setErrorMinLengthPassword] = useState(false);


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorUserName, setErrorUserName] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(null);

    let form;

    const handleSubmit = event => {
        event.preventDefault();
        setErrorEmail(false);
        setErrorUserName(false);
        setErrorPassword(false);
        setErrorConfirmPassword(false);
        setPasswordsDoNotMatch(false);
        setErrorMinLengthPassword(false);
        setError(false);

        let hasError = false;

        if (email.trim().length === 0 || !emailRegex.test(email)) {
            setErrorEmail(true);
            hasError = true;
        }
        if (userName.trim().length === 0) {
            setErrorUserName(true);
            hasError = true;
        }
        if (password.length === 0) {
            setErrorPassword(true);
            hasError = true;
        }
        if (confirmPassword.length === 0) {
            setErrorConfirmPassword(true);
            hasError = true;
        }

        if (hasError) return;

        if (password.length < 7) {
            setErrorMinLengthPassword(true);
            return;
        }

        if (password !== confirmPassword) {
            setPasswordsDoNotMatch(true);
            return;
        }

        if (form.checkValidity()) {
            dispatch(actions.signUp(
                {
                    userName: userName.trim(),
                    email: email.trim(),
                    password: password,
                },
                () => navigate('/'),
                errors => setError(errors),
                () => {
                    navigate('/login');
                    dispatch(actions.logout());
                }
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

            if (msg.includes('IncorrectLoginException')) {
                return 'Credenciales incorrectas.';
            }
            if (msg.includes('DuplicateInstanceException')) {
                return 'Ya existe una cuenta con este email.';
            }
            if (msg.includes('DuplicateUserNameException')) {
                return 'Ya existe una cuenta con este nombre de usuario.';
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
                 backgroundImage: `var(--background-image-opacity-2), url(https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1888930/page_bg_raw.jpg?t=1746041320)`
             }}
        >
            <div className="Flex-center-div Text-center Justify-Content-Center">
                <div className="User-Login-Container">
                    <img src="/theeasteregg_web/assets/ellie.webp" className="User-Login-Image" alt="Ellie" />
                    <div className="Text-left">
                        <h1 className="Margin-top Margin-bottom">Registrarse</h1>

                        <Form
                            ref={node => form = node}
                            className="needs-validation"
                            noValidate
                            onSubmit={handleSubmit}
                        >
                            <div className="Margin-bottom">
                                <div data-testid="email" className="User-Login-Label">
                                    Correo electrónico*
                                </div>
                                <Form.Control
                                    type="email"
                                    className="User-Login-Input"
                                    id="email"
                                    name="email"
                                    placeholder=""
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                                { errorEmail && (
                                    <div className="Margin-bottom User-Login-Error">
                                        Debes introducir un email válido.
                                    </div>
                                )}
                            </div>

                            <div className="Margin-bottom">
                                <div data-testid="userName" className="User-Login-Label">
                                    Nombre de usuario*
                                </div>
                                <Form.Control
                                    type="text"
                                    className="User-Login-Input"
                                    id="userName"
                                    name="userName"
                                    value={userName}
                                    onChange={e => setUserName(e.target.value)}
                                    required
                                />
                                { errorUserName && (
                                    <div className="Margin-bottom User-Login-Error">
                                        Debes introducir un nombre de usuario.
                                    </div>
                                )}
                            </div>

                            <div className="Margin-bottom">
                                <div data-testid="password" className="User-Login-Label">
                                    Contraseña*
                                </div>
                                <Form.Control
                                    type="password"
                                    className="User-Login-Input"
                                    id="password"
                                    name="password"
                                    placeholder=""
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                                { errorPassword && (
                                    <div className="Margin-bottom User-Login-Error">
                                        Debes introducir una contraseña.
                                    </div>
                                )}
                            </div>

                            <div className="Margin-bottom">
                                <div data-testid="confirmPassword" className="User-Login-Label">
                                    Confirma tu contraseña*
                                </div>
                                <Form.Control
                                    type="password"
                                    className="User-Login-Input"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                />
                                { errorConfirmPassword && (
                                    <div className="Margin-bottom User-Login-Error">
                                        Debes confirmar tu contraseña.
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
                                Crear cuenta
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
            <div className="Flex-center-div Justify-Content-Center">
                <div className="User-Login-Alternative">
                    ¿Ya tienes una cuenta?&nbsp;&nbsp;
                    <Link to="/login" className="Formatted-Link-Blue">
                        Inicia sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
