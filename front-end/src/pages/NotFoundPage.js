import { NoSymbolIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
	return (
		<section className="z-10 h-screen w-screen overflow-hidden flex justify-center items-center">
			<div className="glassmorphism py-12">
				<div className="-mx-4 flex">
					<div className="px-20">
						<div className="mx-auto max-w-[460px] text-center">
							<h2 className="mb-2 text-9xl font-bold leading-none text-main flex flex-row justify-center items-center pointer-events-none select-none">
								<span>4</span>
								<NoSymbolIcon
									fontWeight={800}
									className="size-28 font-extrabold"
								/>
								<span>4</span>
							</h2>
							<h4 className="mb-3 text-3xl font-semibold leading-relaxed text-textWhite [text-shadow:_0_4px_4px_rgb(0_0_0_/_0.4)]">
								Oops! Trang không tồn tại
							</h4>
							<p className="mb-8 text-2xl text-textWhite [text-shadow:_0_4px_4px_rgb(0_0_0_/_0.6)]">
								Trang bạn tìm đã có thể bị xóa
							</p>
							<Link
								to="/"
								className="inline-block rounded-lg border border-white px-8 py-3 text-center text-xl font-semibold text-main bg-highlight transition hover:opacity-50  underline underline-offset-2"
							>
								Trang chủ
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default NotFoundPage;
