'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useAuthenticated from '@/hooks/useAuthenticated';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const registerSchema = z
	.object({
		name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
		email: z.string().email({ message: 'Please enter a valid email address' }),
		password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
		confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
	const { register } = useAuthStore();
	useAuthenticated(true);
	const error = useAuthStore((state) => state.error);
	const isLoading = useAuthStore((state) => state.loading);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const onSubmit = async (data: RegisterFormValues) => {
		try {
			await register(data.email, data.password, data.name);
			toast.success('Account created successfully');
		} catch (error) {
			// Error will be handled by the error effect
		}
	};

	useEffect(() => {
		if (error !== null) {
			toast.error(error);
		}
	}, [error]);

	return (
		<div className={cn('flex flex-col gap-6 w-[min(90vw,400px)]', className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Sign Up</CardTitle>
					<CardDescription>Create a new account to get started</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input placeholder="John Doe" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="m@example.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showPassword ? 'text' : 'password'}
													{...field}
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
													onClick={() => setShowPassword(!showPassword)}>
													{showPassword ? (
														<EyeOff className="h-4 w-4 text-muted-foreground" />
													) : (
														<Eye className="h-4 w-4 text-muted-foreground" />
													)}
													<span className="sr-only">
														{showPassword
															? 'Hide password'
															: 'Show password'}
													</span>
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showConfirmPassword ? 'text' : 'password'}
													{...field}
													onChange={(e) => {
														field.onChange(e);
														if (
															e.target.value !==
															form.getValues('password')
														) {
															form.setError('confirmPassword', {
																type: 'manual',
																message: 'Passwords do not match',
															});
														} else {
															form.clearErrors('confirmPassword');
														}
													}}
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
													onClick={() =>
														setShowConfirmPassword(!showConfirmPassword)
													}>
													{showConfirmPassword ? (
														<EyeOff className="h-4 w-4 text-muted-foreground" />
													) : (
														<Eye className="h-4 w-4 text-muted-foreground" />
													)}
													<span className="sr-only">
														{showConfirmPassword
															? 'Hide password'
															: 'Show password'}
													</span>
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								className="w-full"
								disabled={isLoading || !form.formState.isValid}>
								{isLoading ? (
									<>
										Creating account{' '}
										<Loader2 className="ml-2 h-4 w-4 animate-spin" />
									</>
								) : (
									'Create Account'
								)}
							</Button>
							<div className="text-center text-sm">
								Already have an account?{' '}
								<Link href="/login" className="underline underline-offset-4">
									Login
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
