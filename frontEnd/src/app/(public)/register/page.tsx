import { Metadata } from 'next';

import { RegisterForm } from './RegisterForm';

export const metadata: Metadata = {
	title: 'Register | PlanMaster',
	description: 'Register your PlanMaster account',
};

const RegisterPage = () => {
	return (
		<div
			className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat"
			style={{
				backgroundImage:
					"url('https://raw.githubusercontent.com/CiurescuP/LogIn-Form/main/bg.jpg')",
			}}>
			<RegisterForm />
		</div>
	);
};

export default RegisterPage;
