import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

type ButtonProps = Readonly<{
  onClick?: () => void;
  children: string;
  type?: ButtonHTMLAttributes<unknown>["type"];
  disabled?: boolean;
}>;

export const Button = (props: ButtonProps) => (
  <button
    className={buttonClasses + " disabled:cursor-not-allowed"}
    type={props.type}
    onClick={props.onClick}
    disabled={props.disabled}
  >
    {props.children}
  </button>
);

type LinkButtonProps = Readonly<{
  children: string;
  link: string;
}>;

export const LinkButton = (props: LinkButtonProps) => (
  <Link className={buttonClasses} href={props.link}>{props.children}</Link>
);

const buttonClasses = "p-4 rounded-2xl border hover:bg-white hover:text-black disabled:bg-gray-600 disabled:text-gray-200";
