import { useRef, useEffect } from 'react';
import styles from './app.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const fieldsScheme = yup.object().shape({
	email: yup
		.string()
		.required('Поле почтового ящика не заполнено')
		//		.matches(
		//			/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/,
		.email('Неверный почтовый ящик! Используйте примерно такой формат: name@mail.ru'),
	password: yup
		.string()
		.required('Поле пароля не может быть пустым')
		.min(8, 'Пароль должен быть больше 8 символов')
		.max(20, 'Пароль должен быть небольше 20 символов'),
	repeatPassword: yup
		.string()
		.required('Поле пароля не может быть пустым')
		.oneOf([yup.ref('password')], 'Введенные пароли не совпадают'),
});

export const App = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm({
		mode: 'onBlur',
		defaultValues: {
			email: '',
			password: '',
			repeatPassword: '',
		},
		resolver: yupResolver(fieldsScheme),
	});

	const emailError = errors.email?.message;
	const passwordError = errors.password?.message;
	const repeatPasswordError = errors.repeatPassword?.message;

	const submitButtonRef = useRef(null);

	useEffect(() => {
		if (isValid) {
			submitButtonRef.current.focus();
		}
	}, [isValid]);

	const onSubmit = (formData) => {
		console.log(formData.email, formData.password);
		reset();
	};

	return (
		<div className={styles.app}>
			<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
				<h3>Регистрация нового пользователя</h3>
				{emailError && <div className={styles.errorLabel}>{emailError}</div>}
				<input
					className={styles.input}
					type="email"
					name="email"
					{...register('email')}
					placeholder="Почта"
				/>
				{passwordError && (
					<div className={styles.errorLabel}>{passwordError}</div>
				)}
				<input
					className={styles.input}
					type="password"
					name="password"
					{...register('password')}
					placeholder="Пароль"
				/>
				{repeatPasswordError && (
					<div className={styles.errorLabel}>{repeatPasswordError}</div>
				)}
				<input
					className={styles.input}
					type="password"
					name="repeatPassword"
					{...register('repeatPassword')}
					placeholder="Повтор пароля"
				/>
				<button
					className={styles.button}
					ref={submitButtonRef}
					type="submit"
					disabled={!isValid}
				>
					Зарегистрироваться
				</button>
			</form>
		</div>
	);
};
