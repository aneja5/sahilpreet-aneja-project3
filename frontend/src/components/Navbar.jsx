import { MdHomeFilled } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import AppLogo from "./AppLogo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Navbar = () => {
	const queryClient = useQueryClient();
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/authenticate/logout", {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authenticateUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});

	const { data: authenticateUser } = useQuery({ queryKey: ["authenticateUser"] });

	return (
		<div className="md:flex-[2_2_0] w-18 max-w-52">
			<div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
				<Link to="/" className="flex justify-center md:justify-start">
				<AppLogo className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
				</Link>
				<ul className="flex flex-col gap-3 mt-4">
					<li className="flex justify-center md:justify-start">
						<Link
							to="/"
							className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
						>
							<MdHomeFilled className="w-8 h-8" />
							<span className="text-lg hidden md:block">Home</span>
						</Link>
					</li>

					{authenticateUser && (
						<>
							<li className="flex justify-center md:justify-start">
								<Link
									to={`/profile/${authenticateUser?.username}`}
									className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
								>
									<FaUser className="w-6 h-6" />
									<span className="text-lg hidden md:block">Profile</span>
								</Link>
							</li>
						</>
					)}
				</ul>

				{authenticateUser ? (
					<>
						<Link
							to={`/profile/${authenticateUser.username}`}
							className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
						>
							<div className="avatar hidden md:inline-flex">
								<div className="w-8 rounded-full">
									<img src={authenticateUser?.profileImg || "/avatar-placeholder.png"} />
								</div>
							</div>
							<div className="flex justify-between flex-1">
								<div className="hidden md:block">
									<p className="text-white font-bold text-sm w-20 truncate">{authenticateUser?.fullName}</p>
									<p className="text-slate-500 text-sm">@{authenticateUser?.username}</p>
								</div>
								<BiLogOut
									className="w-5 h-5 cursor-pointer"
									onClick={(e) => {
										e.preventDefault();
										logout();
									}}
								/>
							</div>
						</Link>
					</>
				) : (
					<>
						<li className="flex justify-center md:justify-start">
							<Link
								to="/login"
								className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
							>
								<FaUser className="w-6 h-6" />
								<span className="text-lg hidden md:block">Login</span>
							</Link>
						</li>
						<li className="flex justify-center md:justify-start">
							<Link
								to="/signup"
								className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
							>
								<FaUser className="w-6 h-6" />
								<span className="text-lg hidden md:block">Signup</span>
							</Link>
						</li>
					</>
				)}
			</div>
		</div>
	);
};

export default Navbar;
