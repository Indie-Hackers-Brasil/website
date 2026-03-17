import { Link, useRouter } from "@tanstack/react-router";
import {
	LogIn,
	LogOut,
	Menu,
	Search,
	Settings,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { SITE } from "@/data/constants";
import { getProfileByUserId } from "@/data/services/profile";
import { authClient } from "@/lib/auth/client";

interface NavProfile {
	username: string;
	displayName: string | null;
	avatarUrl: string | null;
}

export function Navbar() {
	const { data: session, isPending } = authClient.useSession();
	const [profile, setProfile] = useState<NavProfile | null>(null);
	const router = useRouter();

	useEffect(() => {
		if (!session?.user?.id) {
			setProfile(null);
			return;
		}

		getProfileByUserId({ data: session.user.id }).then((result) => {
			if (result) {
				setProfile({
					username: result.username,
					displayName: result.displayName,
					avatarUrl: result.avatarUrl,
				});
			}
		});
	}, [session?.user?.id]);

	const isAuthenticated = !!session;
	const avatarSrc = profile?.avatarUrl ?? session?.user?.image ?? undefined;
	const displayName =
		profile?.displayName ?? session?.user?.name ?? "Usuario";

	const handleSignIn = () => {
		authClient.signIn.social({
			provider: SITE.auth.provider,
			callbackURL: SITE.auth.callbackURL,
		});
	};

	const handleSignOut = async () => {
		await authClient.signOut();
		router.navigate({ to: "/" });
	};

	const navLinks = isAuthenticated
		? [
				{ to: "/feed" as const, label: "Feed" },
				{ to: "/projects" as const, label: "Projetos" },
				{ to: "/events" as const, label: "Eventos" },
			]
		: [
				{ to: "/projects" as const, label: "Projetos" },
				{ to: "/events" as const, label: "Eventos" },
			];

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4">
				{/* Left — Site title */}
				<Link
					to="/"
					className="shrink-0 font-bold text-lg hover:opacity-80"
				>
					{SITE.name}
				</Link>

				{/* Center — Navigation (desktop) */}
				<nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
					{navLinks.map((link) => (
						<Link
							key={link.to}
							to={link.to}
							className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
							activeProps={{
								className:
									"bg-accent/50 text-foreground",
							}}
						>
							{link.label}
						</Link>
					))}
				</nav>

				{/* Spacer for mobile (push right items to end) */}
				<div className="flex-1 md:hidden" />

				{/* Right — Actions */}
				<div className="flex items-center gap-2">
					{/* Search (placeholder) */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="text-muted-foreground"
								disabled
							>
								<Search className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Em breve</TooltipContent>
					</Tooltip>

					{isPending ? (
						<div className="size-8 animate-pulse rounded-full bg-muted" />
					) : isAuthenticated ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button
									type="button"
									className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
								>
									<Avatar className="size-8 cursor-pointer">
										<AvatarImage
											src={avatarSrc}
											alt={displayName}
										/>
										<AvatarFallback className="text-xs">
											{displayName[0]?.toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								{profile && (
									<DropdownMenuItem asChild>
										<Link
											to="/u/$username"
											params={{
												username: profile.username,
											}}
										>
											<User className="size-4" />
											Meu perfil
										</Link>
									</DropdownMenuItem>
								)}
								<DropdownMenuItem asChild>
									<Link to="/configuracoes">
										<Settings className="size-4" />
										Configuracoes
									</Link>
								</DropdownMenuItem>

								{/* Mobile-only: nav links */}
								<div className="md:hidden">
									<DropdownMenuSeparator />
									{navLinks.map((link) => (
										<DropdownMenuItem
											key={link.to}
											asChild
										>
											<Link to={link.to}>
												{link.label}
											</Link>
										</DropdownMenuItem>
									))}
								</div>

								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleSignOut}>
									<LogOut className="size-4" />
									Sair
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<>
							{/* Desktop: button */}
							<Button
								size="sm"
								onClick={handleSignIn}
								className="hidden md:inline-flex"
							>
								<LogIn className="size-4" />
								Entrar
							</Button>

							{/* Mobile: dropdown with menu + login */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="md:hidden"
									>
										<Menu className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-48"
								>
									{navLinks.map((link) => (
										<DropdownMenuItem
											key={link.to}
											asChild
										>
											<Link to={link.to}>
												{link.label}
											</Link>
										</DropdownMenuItem>
									))}
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleSignIn}>
										<LogIn className="size-4" />
										Entrar com Discord
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
