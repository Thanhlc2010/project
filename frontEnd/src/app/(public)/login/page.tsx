import { Metadata } from 'next';

import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
	title: 'Login | PlanMaster',
	description: 'Login to your PlanMaster account',
};

const LoginPage = () => {
	return (
		<div
			className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat"
			style={{
				backgroundImage:
					"url('https://raw.githubusercontent.com/CiurescuP/LogIn-Form/main/bg.jpg')",
			}}>
			<LoginForm />
		</div>
	);
};

export default LoginPage;
