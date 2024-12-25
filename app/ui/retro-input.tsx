import { FunctionComponent } from "react";

export const RetroInput: FunctionComponent<{
	id: string;
	name: string;
	label: string;
	type?: React.HTMLInputTypeAttribute,
	placeholder?: string;
	defaultValue?: string;
	isRequired: boolean;
}> = ({ id, name,label, type, placeholder, defaultValue, isRequired }) => {
	return (
		<div className="flex flex-col flex-grow p-[8px]">
			<label
				className="text-base font-regular text-retro-black"
				htmlFor={id}
			>
				{label}
			</label>
			<input
				className="border border-retro-black placeholder:italic placeholder:text-retro-gray text-base font-regular text-retro-black h-[36px] px-[8px] flex-grow"
				id={id}
				name={name}
				type={type}
				placeholder={placeholder}
				defaultValue={defaultValue}
				required={isRequired}
			/>
		</div>
	);
};