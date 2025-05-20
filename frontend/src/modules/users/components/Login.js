import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as actions from '../actions';
import "../../app/style/UserStyle.css";
import Arthur from '../../common/assets/arthur.webp';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);

    let form;

    const handleSubmit = event => {
        event.preventDefault();
        setErrorEmail(false);
        setErrorPassword(false);
        setError(false);

        if (email.trim().length === 0 || !emailRegex.test(email)) {
            setErrorEmail(true);
            if (password.length === 0) {
                setErrorPassword(true);
            }
            return;
        }
        if (password.length === 0) {
            setErrorPassword(true);
            return;
        }

        if (form.checkValidity()) {
            dispatch(actions.login(
                email.trim(),
                password,
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
    };

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
             style={{ backgroundImage: `var(--background-image-opacity-2), url(https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/page_bg_raw.jpg?t=1720558643)` }}>
            <div className="Flex-center-div Text-center Justify-Content-Center">
                <div className="User-Login-Container">
                    <img src={Arthur} className="User-Login-Image" alt="Arthur" />
                    <div className="Text-left">
                        <h1 className="Margin-top Margin-bottom">
                            Iniciar sesión
                        </h1>

                        <Form
                            ref={node => form = node}
                            className="needs-validation"
                            noValidate
                            onSubmit={handleSubmit}
                        >
                            <div className="Margin-bottom">
                                <div data-testid="email" className="User-Login-Label">
                                    Correo electrónico
                                </div>
                                <Form.Control
                                    type="email"
                                    className="User-Login-Input"
                                    id="email"
                                    name="email"
                                    placeholder=""
                                    value={email}
                                    onChange={event => setEmail(event.target.value)}
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
                                <div data-testid="password" className="User-Login-Label">
                                    Contraseña
                                </div>
                                <Form.Control
                                    type="password"
                                    className="User-Login-Input"
                                    id="password"
                                    name="password"
                                    placeholder=""
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                    required
                                />
                                { errorPassword && (
                                    <div className="Margin-bottom User-Login-Error">
                                        Debes introducir tu contraseña.
                                    </div>
                                )}
                            </div>

                            <div className="Margin-bottom User-Login-Error">
                                <Errors errors={parseError(error)} onClose={() => setError(null)} />
                            </div>

                            <Button type="submit" data-testid="submit" className="User-Login-Button">
                                Entrar
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
            <div className="Flex-center-div Justify-Content-Center">
                <div className="User-Login-Alternative">
                    ¿No tienes cuenta?&nbsp;&nbsp;
                    <Link to="/signUp" className="Formatted-Link-Blue">
                        Regístrate
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
