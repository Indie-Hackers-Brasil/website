import { Link } from "@tanstack/react-router";
import { SITE } from "@/data/constants";

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="mt-auto border-t py-8">
			<div className="mx-auto w-full max-w-6xl px-4">
				<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Link to="/" className="font-medium text-foreground hover:underline">
							{SITE.name}
						</Link>
						<span>· {year}</span>
					</div>

					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<a
							href="https://discord.gg/indiehackersbrasil"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-foreground"
						>
							Discord
						</a>
						<a
							href="https://github.com/Indie-Hackers-Brasil/website"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-foreground"
						>
							GitHub
						</a>
					</div>
				</div>

				<p className="mt-4 text-center text-xs text-muted-foreground sm:text-left">
					Feito pela comunidade {SITE.name}
				</p>
			</div>
		</footer>
	);
}
