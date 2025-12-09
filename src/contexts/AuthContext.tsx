import { User } from '@/types/user.interfact';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, name: string) => Promise<void>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { data: session, status } = useSession();
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	const checkAuth = async () => {
		setIsLoading(status === 'loading');
	};

	useEffect(() => {
		checkAuth();
	}, [status]);

	const login = async (email: string, password: string) => {
		try {
			const result = await signIn('credentials', {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				throw new Error(result.error);
			}

			router.push('/dashboard');
			toast.success('Login successful');
		} catch (error) {
			toast.error('Login failed');
			throw error;
		}
	};

	const register = async (email: string, password: string, name: string) => {
		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, name }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Registration failed');
			}

			await login(email, password);
			// Login success toast is handled in login function, but we can override or add specific register success if needed.
			// However, we shouldn't show double toasts. login() shows "Login successful".
			// Maybe we can rely on login's toast. Or suppress login's toast?
			// For now, let's keep it simple. The login function will redirect.
		} catch (error) {
			toast.error('Registration failed');
			throw error;
		}
	};

	const logout = async () => {
		try {
			await signOut({ redirect: false });
			router.push('/login');
			toast.success('Logged out successfully');
		} catch (error) {
			toast.error('Logout failed');
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user: session?.user ?? null,
				isLoading,
				isAuthenticated: !!session?.user,
				login,
				register,
				logout,
				checkAuth,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
